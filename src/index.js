/**
 * @file check-version
 * @author xiaowu
 * @email fe.xiaowu@gmail.com
 */

'use strict';

import request from 'request';
import KeyCache from 'key-cache';

import sendMail from './sendMail';
import printLog from './printLog';

import config from '../config.json';

let cache = new KeyCache({
    dir: './cache/',
    md5key: false
});

let Check = (options = {}) => {
    // 如果没有需要监听
    if (!options.watch) {
        return Check.exec(options);
    }
};

Check.exec = (options = {}) => {
    let defer = Check.getData(options);

    return defer.then(data => sendMail(options, data)).then(data => printLog(options, data)).catch(err => {
        console.error(err);
        return err;
    });
};


Check.getData = (options = {}) => {
    let promiseAll = [];

    let lastVertion = cache.get('lastVertion') || {};

    options = {...config, ...options};

    if (!options.rule || !options.rule.length) {
        return Promise.reject('config.rule 为空');
    }

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
