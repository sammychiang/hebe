var request = require('request');
var max = 2000000;
var send = 0;
var success = 0;
var interval = setInterval(function () {
    if (send == max) {
        clearInterval(interval);
        return;

    }
    send++;
    request
        .get(
            'https://api.m.sm.cn/rest?method=tools.vote&sc=yisou_variety&act=add&item=5e52d29ab095de5920254a0cf4f1d119&timestamp=1476723499975&callback=jsonp2',
            function (error, response, body) {
                success++;
                console.log(body, "   successed: ", success, " / ", max) // 200
                    // console.log(response) // 'image/png'
                    //
            }
        )

}, 10);
