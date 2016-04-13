/**
 * @file 测试用例
 * @author xiaowu
 */

import 'should';

import Check from '../src/index';
import types from './types';
import log from '../src/log';


describe('check-version', () => {
    let write = log._write;

    afterEach(() => {
        log._write = write;
    });

    it('new', () => {
        Check.should.be.type('function');
    });

    // it('getData()', done => {
    //     var flag;

    //     Check.getData().then(() => {
    //         flag = true;
    //     }).catch(() => {
    //         flag = false;
    //     });

    //     setTimeout(() => {
    //         strictEqual(flag, false);
    //         done();
    //     });
    // });

    it('Check.getData promise', () => Check.getData().should.be.Promise());
    it('getData({rule: []})', done => {
        let flag;

        Check.getData({
            rule: []
        }).then(() => {
            flag = true;
        }).catch(() => {
            flag = false;
        });

        setTimeout(() => {
            flag.should.be.false();
            done();
        });
    });

    // it('getData load error', done => {
    //     Check.getData({
    //         rule: [
    //             {
    //                 url: '/getData'
    //             }
    //         ]
    //     }).then(() => {
    //         strictEqual(false, true, '请求判断失败');
    //         done();
    //     }).catch(function (data) {
    //         strictEqual(data.errcode, 1, 'errcode is 1');
    //         done();
    //     });
    // });

    // it('getData statusCode error', done => {
    //     Check.getData({
    //         rule: [
    //             {
    //                 url: 'https://xuexb.com/404'
    //             }
    //         ]
    //     }).then(() => {
    //         strictEqual(false, true, '请求判断失败');
    //         done();
    //     }).catch(function (data) {
    //         strictEqual(data.errcode, 1, 'errcode is 1');
    //         done();
    //     });
    // });
    
    it('_sendLog promise', () => {
        Check._sendLog().should.be.Promise();
    });

    // 没有更新
    it('_sendLog({}, {})', done => {
        let num = 0;
        log._write = () => {
            num += 1;
        };
        return Check._sendLog({}, {
            update: [],
            all: []
        }).then(data => {
            data.update.length.should.be.equal(0);
            data.all.length.should.be.equal(0);
            num.should.be.equal(2);
        }).then(done);
    });

    it('_sendLog update:1', done => {
        let num = 0;
        log._write = () => {
            num += 1;
        };

        Check._sendLog({}, {
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
            data.update.length.should.be.equal(1);
            data.all.length.should.be.equal(2);
            (num === 4).should.be.true();
            done();
        });
    });

    it('_sendLog update:0', done => {
        let num = 0;
        log._write = () => {
            num += 1;
        };

        Check._sendLog({}, {
            update: [
            ],
            all: [
                {
                    prevVersion: 1,
                    name: 'test1',
                    version: 1
                }
            ]
        }).then(function (data) {
            data.update.length.should.be.equal(0);
            data.all.length.should.be.equal(1);
            (num === 3).should.be.true();
            done();
        });
    });
});
