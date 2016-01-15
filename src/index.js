
/**
 * @file check-version
 * @author xiaowu
 * @email fe.xiaowu@gmail.com
 */

'use strict';

import request from 'request';
import fs from 'fs';
import path from 'path';

import config from '../config.json';

let rule = config.rule;

let resPromise = [];

rule.forEach((val) => {
    let defer = new Promise((resolve, reject) => {
        
        console.info('开始加载：' + val.url);

        request(val.url, (error, response, body) => {
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
                resolve({
                    data: 'ok'
                });
            }
        });
    });

    resPromise.push(defer);
});

Promise.all(resPromise).then(data => {
    console.log(data);
}, err => {
    console.log(err);
});