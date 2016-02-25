/**
 * @file 日志处理
 * @author xiaowu
 * @email fe.xiaowu@gmail.com
 */

'use strict';

import 'colors';

/**
 * 输出错误日志
 *
 * @param  {string||Object} str 信息
 */
function error(str) {
    if ('object' === typeof str) {
        str = JSON.stringify(str);
    }
    console.error(String('【check-version】: ' + str).red);
}

/**
 * 输出成功日志
 *
 * @param  {string||Object} str 信息
 */
function success(str) {
    if ('object' === typeof str) {
        str = JSON.stringify(str);
    }
    console.log(String('【check-version】: ' + str).green);
}

/**
 * 发送日志方法
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
        success(`-------------`);

        // 循环输出
        data.all.forEach(val => {
            // 如果有上次的版本号
            // 如果上次为null，那么则说明这次不是null了，这次更新了，则提示下
            if (val.prevVersion || val.prevVersion === null) {
                success(`${val.name} : ${val.prevVersion} => ${val.version}`);
            }
            else {
                success(`${val.name} : ${val.version}`);
            }
        });

        resolve(data);
    });
}

export {
    send as default,
    send,
    success,
    error
};
