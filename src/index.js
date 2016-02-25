/**
 * @file check-version
 * @author xiaowu
 * @email fe.xiaowu@gmail.com
 */

'use strict';

import request from 'request';
import {RecurrenceRule, scheduleJob} from 'node-schedule';

import cache from './cache';
import sendMail from './mail';
import {send, error} from './log';
import config from '../config.json';

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
 * @param {string}      options.rule[].match   规则查找$
 *
 * @return {Promise}    请求数据的Promise
 */
let Check = (options = {}) => {
    // 如果没有需要监听
    if (!options.watch) {
        return Check._exec(options);
    }

    // 先执行下，再绑定事件
    return Check._exec(options).then(data => {
        // 创建定时任务
        let rule = new RecurrenceRule();

        // 如果是每天检查则设置每天的00:00检查，否则设置为每小时的0分检查
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

    return defer.then(data => sendMail(options, data)).then(data => send(options, data)).catch(err => {
        error(err);
    });
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

    // 如果规则不存在则报错
    if (!options.rule || !options.rule.length) {
        return Promise.reject('config.rule is empty');
    }

    // 所有请求的promise，并列执行，后续优化成串行的
    let promiseAll = [];

    // 上次版本号的缓存
    let versionCache = cache.get('version') || {};

    // 循环规则，生成Promise
    options.rule.forEach(val => {
        // 生成一个promise
        let defer = new Promise((resolve, reject) => {
            // 请求源码
            request.get({
                headers: options.header || {},
                url: val.url
            }, (err, response, body) => {
                // 如果有错误
                if (err) {
                    val.errcode = 1;
                    val.errmsg = err;
                    reject(val);
                }
                // 如果响应码不是200
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

        promiseAll.push(defer);
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
                versionCache[key] = val.version;
                return;
            }

            // 如果上个版本缓存过
            // 如果是新加的规则则忽略，因为新加的无法与上次对比查看是否有更新
            if (versionCache.hasOwnProperty(key)) {
                // 如果版本号不同
                // 如果上次为null，而走到这里时当前版本肯定是有的，然后这就算更新了
                if (val.version !== versionCache[key] || versionCache[key] === null) {
                    val.prevVersion = versionCache[key];
                    res.update.push(val);
                }
            }

            versionCache[key] = val.version;
        });

        cache.set('version', versionCache);
        return res;
    });
};

export default Check;
