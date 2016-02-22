/**
 * @file check-version
 * @author xiaowu
 * @email fe.xiaowu@gmail.com
 */

'use strict';

import request from 'request';
import KeyCache from 'key-cache';
import {RecurrenceRule, scheduleJob} from 'node-schedule';

import sendMail from './sendMail';
import printLog from './printLog';
import config from '../config.json';

// 创建缓存
let cache = new KeyCache({
    dir: './cache/',
    md5key: false
});

/**
 * 构造函数
 *
 * @param {Object}      options                     配置参数
 * @param {boolean}     options.watch               是否监听
 * @param {string}      options.time                时间间隔，有day天，hour分钟
 * @param {Object}      options.email               邮箱配置
 * @param {boolean}     options.email.on            是否开启发送邮件通知
 * @param {string}      options.email.to            接收邮件列表
 * @param {string}      options.email.host          邮箱host配置
 * @param {string}      options.email.user          邮箱用户名
 * @param {string}      options.email.pass          邮箱密码
 * @param {Object}      options.header              请求的header头信息
 * @param {Array}       options.rule                请求规则
 * @param {string}      options.rule[].name         规则名称，唯一key
 * @param {string}      options.rule[].url          请求链接
 * @param {string}      options.rule[].reg          规则的正则表达式，需要转义
 * @param {string}      [options.rule[].match=$1]   规则查找$
 *
 * @return {Promise}    请求数据的Promise
 */
let Check = (options = {}) => {
    // 如果没有需要监听
    if (!options.watch) {
        return Check.exec(options);
    }
    
    // 先执行下，再绑定事件
    return Check._exec(options).then((data) => {
        // 创建定时任务
        let rule = new RecurrenceRule();
        if (options.time === 'day') {
            rule.hour = 0;
        }
        else {
            rule.minute = 0;
        }

        // 执行定时任务
        scheduleJob(rule, () => Check._exec(options));

        // 返回数据
        return data;
    });
};

/**
 * 执行
 *
 * @param  {Object} options 配置参数
 *
 * @return {Promise}         请求参数Promise
 */
Check._exec = (options = {}) => {
    let defer = Check.getData(options);

    console.log('_exec');

    return defer.then(data => sendMail(options, data)).then(data => printLog(options, data))
};


/**
 * 获取数据
 *
 * @param  {Object} options 配置参数
 *
 * @return {Promise}         请求参数Promise
 */
Check.getData = (options = {}) => {
    // 合并参数
    options = {...config, ...options};

    if (!options.rule || !options.rule.length) {
        return Promise.reject('config.rule 为空');
    }

    let promiseAll = [];
    let lastVertion = cache.get('lastVertion') || {};

    // 循环规则，生成Promise
    options.rule.forEach(val => {
        let temp = new Promise((resolve, reject) => {
            request.get({
                headers: options.header,
                url: val.url
            }, (error, response, body) => {
                if (error) {
                    val.errcode = 1;
                    val.errmsg = error;
                    reject(val);
                }
                else if (response.statusCode !== 200) {
                    val.errcode = 2;
                    val.errmsg = response.statusCode;
                    reject(val);
                }
                else {
                    let reg = new RegExp(val.reg);
                    let match = val.match || '$1';
                    match = Math.floor(match.replace('$', '')) || 0;

                    try {
                        body = body.match(reg);
                        if (body && body.length > match - 1) {
                            body = body[match];
                        }
                    }
                    catch (e) {
                        body = null;
                    }

                    val.version = body;

                    resolve(val);
                }
            });
        });

        promiseAll.push(temp);
    });

    // 并行执行请求
    // 并对数据进行处理，主要是检查版本号
    return Promise.all(promiseAll).then(data => {
        let res = {
            update: [],
            all: data
        };

        data.forEach(val => {
            let key = val.name;

            // 如果没有获取到版本
            if (!val.version) {
                return;
            }

            // 如果上个版本缓存过
            if (lastVertion.hasOwnProperty(key)) {
                if (val.version > lastVertion[key] || lastVertion[key] === null) {
                    val.lastVertion = lastVertion[key];
                    res.update.push(val);
                }
            }

            // 写放当前版本
            lastVertion[key] = val.version;
        });

        cache.set('lastVertion', lastVertion);

        return res;
    });
};

export default Check;
