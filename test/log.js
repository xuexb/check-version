/**
 * @file 测试用例 log.js
 * @author xiaowu
 */

import 'should';

import {success, error, send} from '../src/log';
import types from './types';


describe('log.js', () => {

    it('error', () => {
        let oldError = console.error;
        let num = 0;
        global.console.error = () => {
            num += 1;
        };
        types.forEach(msg => error(msg));

        num.should.be.equal(types.length);
        global.console.error = oldError;
    });

    it('success', () => {
        let oldLog = console.log;
        let num = 0;
        global.console.log = () => {
            num += 1;
        };
        types.forEach(msg => success(msg));

        num.should.be.equal(types.length);

        global.console.log = oldLog;
    });

    it('send promise', () => {
        send().should.be.Promise();
    });

    it('send({}, {})', done => {

        return send({}, {
            update: [],
            all: []
        }).then(data => {
            data.update.length.should.be.equal(0);
            data.all.length.should.be.equal(0);
            done();
        });
    });

    it('send update:1', done => {
        send({}, {
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
            done();
        });
    });
});
