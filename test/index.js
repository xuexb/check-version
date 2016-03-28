/**
 * @file 测试用例
 * @author xiaowu
 */

import should from 'should';

import Check from '../src/index';
import types from './types';



describe('check-version', () => {
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
});
