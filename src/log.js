/**
 * @file 日志处理
 * @author xiaowu
 * @email fe.xiaowu@gmail.com
 */

import 'colors';

let showLog = {};

/**
 * 日志前缀
 *
 * @type {String}
 */
const PREFIX = '【check-version】: ';

/**
 * 输出日志，为的测试用例
 *
 * @param  {string} str  输出字符
 * @param  {string} [type=success] 类型，成功:log，失败:error
 */
let _write = showLog._write = (str, type = 'log') => {
    console[type](str);
};

/**
 * 输出错误日志
 *
 * @param  {string} str 字符
 */
let error = showLog.error = str => {
    if ('object' === typeof str) {
        str = JSON.stringify(str);
    }

    showLog._write(String(PREFIX + str).red, 'error');
};

/**
 * 输出成功日志
 *
 * @param  {string} str 字符
 */
let success = showLog.success = str => {
    if ('object' === typeof str) {
        str = JSON.stringify(str);
    }

    showLog._write(String(PREFIX + str).green);
};

export {
    showLog as default,
    _write,
    success,
    error
};
