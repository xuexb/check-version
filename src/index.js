

/**
 * @file check-version
 * @author xiaowu
 * @email fe.xiaowu@gmail.com
 */

'use strict';

import request from 'request';

import config from '../config.json';
import header from '../header.json';

let rule = config.rule;

let resPromise = [];

rule.forEach((val) => {
    let defer = new Promise((resolve, reject) => {

        // console.info('开始加载：' + val.url);

        request.get({
            headers: header,
            url: val.url
        }, (error, response, body) => {
            if (error) {
                reject({
                    errcode: 2,
                    errmsg: error,
                    name: val.name
                });
            }
            else if (response.statusCode !== 200) {
                reject({
                    errcode: 1,
                    errmsg: response.statusCode,
                    name: val.name
                });
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

    resPromise.push(defer);
});

Promise.all(resPromise).then(data => {
    data.forEach(val => {
        console.log(val.name + ' => ' + val.version);
    });
}, err => {
    console.error(err);
});
