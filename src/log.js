/**
 * @file 日志处理
 * @author xiaowu
 * @email fe.xiaowu@gmail.com
 */

'use strict';

import 'colors';

let {log} = console;

/**
 * 输出错误日志
 *
 * @param  {string} str 信息
 */
function error(str) {
    log(String(str).red);
}

function success(str) {
    log(String(str).green);
}

/**
 * 发送邮件方法
 *
 * @param  {Object} options 配置对象
 * @param  {Object} data    数据对象
 *
 * @return {Promise}         Promise
 */
function send(options = {}, data = {}) {
    return new Promise((resolve, reject) => {
        if (data.update.length) {
            success(`当前有${data.update.length}个更新.`);
        }
        else {
            success(`当前无更新`);
        }

        // 美好的分隔线
        success(`\n-------------\n`);

        // 循环输出
        data.all.forEach(val => {
            success(`${val.name} 当前版本：${val.version}`);
        });

        resolve(data);
    });
}

export {
    send as default,
    send,
    success,
    error
}