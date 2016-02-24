/**
 * @file 缓存管理
 * @author xiaowu
 */

import {resolve} from 'path';
import KeyCache from 'key-cache';

let cache = new KeyCache({
    dir: resolve(__dirname, '../cache/'),
    md5key: false
});

export default cache;
