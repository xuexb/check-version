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

    // it('send promise', () => {
    //     log.send().should.be.Promise();
    // });

    // it('send({}, {})', done => {

    //     return log.send({}, {
    //         update: [],
    //         all: []
    //     }).then(data => {
    //         data.update.length.should.be.equal(0);
    //         data.all.length.should.be.equal(0);
    //         done();
    //     });
    // });

    // it('send update:1', done => {
    //     log.send({}, {
    //         update: [
    //             {
    //                 prevVersion: 1,
    //                 name: 'test1',
    //                 version: 2
    //             }
    //         ],
    //         all: [
    //             {
    //                 prevVersion: null,
    //                 name: 'test1',
    //                 version: 0
    //             },
    //             {
    //                 prevVersion: 1,
    //                 name: 'test1',
    //                 version: 2
    //             }
    //         ]
    //     }).then(function (data) {
    //         done();
    //     });
    // });
});
