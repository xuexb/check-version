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
    new Promise((resolve, reject) => {

        // console.info('开始加载：' + val.url);

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
        console.log(data.name + ' => ' + data.version);
    }, err => {
        console.error(err);
    });
});
