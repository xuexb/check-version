/**
 * @file 测试用例 log.js
 * @author xiaowu
 */

import 'should';

import log from '../src/log';
import types from './types';

let write = log._write;

describe('log.js', () => {

    afterEach(() => {
        log._write = write;
    });

    it('error', () => {
        let num = 0;
        log._write = () => {
            num += 1;
        };
        types.forEach(msg => log.error(msg));

        num.should.be.equal(types.length);
    });

    it('_write(str)', () => {
        log._write('test');
    });

    it('_write(str, error)', () => {
        log._write('test', 'error');
    });

    it('success', () => {
        let num = 0;

        log._write = () => {
            num += 1;
        };

        types.forEach(msg => log.success(msg));

        num.should.be.equal(types.length);
    });
});
