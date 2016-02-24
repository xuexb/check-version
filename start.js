var config = {
    "header": {
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36"
    },
    "rule": [
        {
            "name": "nginx",
            "url": "http://nginx.org/",
            "reg": "class=\"date\"><a name=\".+?\"><\/a>.+?<\/td><td><p><a href=\"en\/download.html\">nginx-([^\/]+?)<\/a>"
        },
        {
            "name": "nodejs 4.x",
            "url": "https://github.com/nodejs/node/releases",
            "reg": "<span class=\"tag-name\">v(4\\..+?)<\/span>"
        },
        {
            "name": "nodejs 5.x",
            "url": "https://github.com/nodejs/node/releases",
            "reg": "<span class=\"tag-name\">v(5\\..+?)<\/span>"
        }
    ]
};

var Check = require('./');
new Check(config);