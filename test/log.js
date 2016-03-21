/**
 * @file 测试用例 log.js
 * @author xiaowu
 */

'use strict';

var assert = require('assert');
var strictEqual = assert.strictEqual;
var log = require('../lib/log');
var types = require('./types');

describe('log.js', function () {

    it('error', function () {
        var error = console.error;
        var num = 0;
        global.console.error = function () {
            num += 1;
        };
        types.forEach(function (msg) {
            log.error(msg);
        });
        strictEqual(num, types.length);
        global.console.error = error;
    });

    it('success', function () {
        var _log = console.log;
        var num = 0;
        global.console.log = function () {
            num += 1;
        };
        types.forEach(function (msg) {
            log.success(msg);
        });
        strictEqual(num, types.length);
        global.console.log = _log;
    });

    it('send promise', function (done) {
        var _log = global.console.log;

        global.console.log = function () {};

        log.send({}, {
            update: [],
            all: []
        }).then(function (data) {
            strictEqual(data.update.length, 0);
            strictEqual(data.all.length, 0);
            global.console.log = _log;
            done();
        });
    });

    it('send update:1', function (done) {
        var _log = global.console.log;
        var num = 0;

        global.console.log = function () {
            num += 1;
        };

        log.send({}, {
            update: [
                {
                    prevVersion: 1,
                    name: 'test1',
                    version: 2
                }
            ],
            all: [
                {
                    prevVersion: null,
                    name: 'test1',
                    version: 0
                },
                {
                    prevVersion: 1,
                    name: 'test1',
                    version: 2
                }
            ]
        }).then(function (data) {
            // console.error(data)
            global.console.log = _log;
            setTimeout(function () {
                strictEqual(num, 4);
                done();
            });
        });
    });
});
