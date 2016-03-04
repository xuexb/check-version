/**
 * @file 测试用例
 * @author xiaowu
 */

'use strict';

var assert = require('assert');
var strictEqual = assert.strictEqual;
var Check = require('../');

describe('key-cache', function () {
    it('new', function () {
        strictEqual(typeof Check, 'function');
    });

    it('getData()', function (done) {
        var flag;

        Check.getData().then(function () {
            flag = true;
        }).catch(function () {
            flag = false;
        });

        setTimeout(function () {
            strictEqual(flag, false);
            done();
        });
    });

    it('getData({rule: []})', function (done) {
        var flag;

        Check.getData({
            rule: []
        }).then(function () {
            flag = true;
        }).catch(function () {
            flag = false;
        });

        setTimeout(function () {
            strictEqual(flag, false);
            done();
        });
    });

    it('getData load error', function (done) {
        Check.getData({
            rule: [
                {
                    url: '/getData'
                }
            ]
        }).then(function () {
            strictEqual(false, true, '请求判断失败');
            done();
        }).catch(function (data) {
            strictEqual(data.errcode, 1, 'errcode is 1');
            done();
        });
    });

    // it('getData statusCode error', function (done) {
    //     Check.getData({
    //         rule: [
    //             {
    //                 url: 'https://xuexb.com/404'
    //             }
    //         ]
    //     }).then(function () {
    //         strictEqual(false, true, '请求判断失败');
    //         done();
    //     }).catch(function (data) {
    //         strictEqual(data.errcode, 1, 'errcode is 1');
    //         done();
    //     });
    // });
});
