/**
 * @file check-version
 * @author xiaowu
 * @email fe.xiaowu@gmail.com
 */

import {readFileSync, existsSync} from 'fs';
import path from 'path';
import program from 'commander';

import pkg from '../package';
import Check from './index';
import {success, error} from './log';
import cache from './cache';

// 设置命令行工具
program
    .version(pkg.version)
    .option('-c, --config [filepath]', 'config file path')
    .parse(process.argv);

/**
 * 获取配置文件数据
 *
 * @return {Promise} 数据的Promise
 */
let getConfig = function () {
    return new Promise((resolve, reject) => {
        let configpath = cache.get('configpath');

        // 如果没有配置文件
        if (!configpath || 'string' !== typeof configpath) {
            return reject('Please set the profile path using 【check-version  -c filepath】');
        }

        // 配置文件不存在
        if (!existsSync(configpath)) {
            return reject('Config file does not exist');
        }

        let config;

        // 解析json结构
        // 使用readfile可以保证每次都是新的
        try {
            config = readFileSync(configpath).toString();
            config = JSON.parse(config);
        }
        catch (e) {
            return reject('Failed to parse the config file');
        }

        resolve(config);
    });
};

/**
 * 设置文件配置
 *
 * @param {string} configpath 文件路径
 *
 * @return {Promise}
 */
let setConfig = function (configpath) {
    return new Promise((resolve, reject) => {
        // 路径设置有问题
        if (configpath === 'true' || configpath === true) {
            return reject('Please set the config file path');
        }

        // 解析路径
        configpath = path.resolve('./', configpath);

        // 如果文件不存在
        if (!existsSync(configpath)) {
            return reject('Config file does not exist');
        }

        // 设置缓存
        cache.set('configpath', configpath);

        resolve(configpath);
    });
};

// 如果是在配置文件
if (program.config) {
    setConfig(program.config).then(data => {
        success('Setting success, the file path is : ' + data);
    }).catch(err => error(err));
}
else {
    getConfig().then(data => {
        new Check(data);
    }).catch(err => error(err));
}
