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
});
