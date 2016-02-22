/**
 * @file 打印日志
 * @author xiaowu
 * @email fe.xiaowu@gmail.com
 */

'use strict';

let {log} = console;

/**
 * 发送邮件方法
 *
 * @param  {Object} options 配置对象
 * @param  {Object} data    数据对象
 *
 * @return {Promise}         Promise
 */
export default function (options = {}, data = {}) {
    return new Promise((resolve, reject) => {
        if (data.update.length) {
            log(`当前有${data.update.length}个更新.`);
        }
        else {
            log(`当前无更新`);
        }

        // 美好的分隔线
        log(`\n-------------\n`);

        // 循环输出
        data.all.forEach(val => {
            log(`${val.name} 当前版本：${val.version}`);
        });

        resolve(data);
    });
}
