/**
 * @file check-version
 * @author xiaowu
 * @email fe.xiaowu@gmail.com
 */

'use strict';

import request from 'request';
import {green, red} from 'colors/safe';
import KeyCache from 'key-cache';

import config from '../config.json';
import header from '../header.json';

let promiseAll = [];
let rule = config.rule;

let cache = new KeyCache({
    dir: './cache/',
    md5key: false
});

let lastVertion = cache.get('lastVertion') || {};

rule.forEach((val) => {
    let temp = new Promise((resolve, reject) => {
        request.get({
            headers: header,
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
    }).then(data => {
        if (data.version) {
            console.log(green(data.name + ' => ' + data.version));
        }
        else {
            console.log(red(data.name + ' => ' + data.version));
        }

        return data;
    }, err => {
        console.error(red(err));
    });

    promiseAll.push(temp);
});

Promise.all(promiseAll).then(data => {
    let update = [];

    console.log('------------------------');

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
                update.push(val);
                lastVertion[key] = val.version;
            }
        }
        else {
            lastVertion[key] = val.version;
        }
    });

    if (!update.length) {
        console.log(green('没有更新'));
    }
    else {
        console.log(green('有 ') + red(update.length) + green(' 个更新'));
        update.forEach(val => {
            console.log(green(val.name + ' ' + val.lastVertion + ' => ' + val.version));
        });
    }

    cache.set('lastVertion', lastVertion);
});