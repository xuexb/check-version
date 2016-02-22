/**
 * @file 发送邮件
 * @author xiaowu
 * @email fe.xiaowu@gmail.com
 */

'use strict';

import nodemailer from 'nodemailer';
import marked from 'marked';

import path from 'path';
import {readFileSync} from 'fs';

let getMailTpl = data => {
    let html = [];
    let update = {};

    html.push(`### 当前有${data.update.length}个更新：\n`);

    html.push('名称 | 版本 | 状态');

    html.push('--- | --- | ---');

    data.update.forEach(val => {
        html.push(`${val.name} | ${val.lastVertion || '-'} -> ${val.version || '-'} | 有更新`);

        // 打上已更新标识
        update[val.name] = true;
    });

    data.update.forEach(val => {
        if (!update[val.name]) {
            html.push(`${val.name} | ${val.lastVertion || '-'} | 无更新`);
        }

        delete update[val.name];
    });

    html = marked(html.join('\n'));

    let cssdata = readFileSync(path.resolve(__dirname, '../static/main.css')).toString();

    return `<style>${cssdata}</style><div class="markdown-body">${html}</div>`;
};

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
        // 如果没有开启发送邮箱
        // 如果没有更新的内容包
        if (!options.email || !options.email.on || !data.update.length) {
            return resolve(data);
        }

        if (!options.email.to || !options.email.user || !options.email.pass || !options.email.host) {
            return reject('config.email 解析错误');
        }

        // 开启一个 SMTP 连接池
        let smtpTransport = nodemailer.createTransport({
            host: options.email.host,
            secure: true,
            port: 465,
            auth: {
                user: options.email.user,
                pass: options.email.pass
            }
        });

        // 设置邮件内容
        let mailOptions = {
            from: `check-version <${options.email.user}>`,
            to: options.email.to,
            subject: `【check-version】有${data.update.length}个更新`,
            html: getMailTpl(data)
        };

        // 发送邮件
        smtpTransport.sendMail(mailOptions, (error, response) => {
            smtpTransport.close();

            if (error) {
                reject(error);
            }
            else {
                resolve(data);
            }
        });
    });
}
