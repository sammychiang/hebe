var request = require('request');
const console = require('better-console');

var send = 0;
var success = 0;
var balanceInterval;
var ramdomDelay = Math.floor((Math.random() * 60) + 1);
var limit = {
    value: Math.floor((Math.random() * 100 * 10000) + 5 * 10000),
    interval: 15 * 60 * 1000
}

setInterval(function () {
    limit.value = Math.floor((Math.random() * 100 * 10000) + 20 * 10000);
    console.log(limit.value);
}, limit.interval);

function balance(switcher) {
    console.log(switcher, !balanceInterval);
    if (switcher && !balanceInterval) {
        console.log("open  " + new Date());
        balanceInterval = setInterval(function () {
            send++;
            request
                .get(
                    'https://api.m.sm.cn/rest?method=tools.vote&sc=yisou_variety&act=add&item=5e52d29ab095de5920254a0cf4f1d119&timestamp=1476723499975&callback=jsonp2',
                    function (error, response, body) {
                        success++;
                        console.log(body, "   successed: ", success,
                                " / ") // 200
                            // console.log(response) // 'image/png'
                            //
                    }
                )

        }, 10);
    } else if (!switcher) {
        clearInterval(balanceInterval);
        balanceInterval = null;
        console.info("close  " + new Date());
    }
}



var statTimes = 2;
var gap = 0;
var lastgap = 0;
var interval = 5;
var stat = {
    interval: interval * statTimes,
    advance: {
        start: 0,
        end: 0
    },
    hebe: {
        start: 0,
        end: 0
    },
    linjunjie: {
        start: 0,
        end: 0
    }
};
var loop = 0;
var checkTimes = 0;

//secondstotime
function secondstotime(secs) {
    var t = new Date(1970, 0, 1);
    t.setSeconds(secs);
    var s = t.toTimeString().substr(0, 8);
    if (secs > 86399)
        s = Math.floor((t - Date.parse("1/1/70")) / 3600000) + s.substr(2);
    return s;
}

//nuber format
function number_format(number, decimals, dec_point, thousands_sep) {
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        toFixedFix = function (n, prec) {
            // Fix for IE parseFloat(0.55).toFixed(0) = 0;
            var k = Math.pow(10, prec);
            return Math.round(n * k) / k;
        },
        s = (prec ? toFixedFix(n, prec) : Math.round(n)).toString().split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}
// if pass point
function passPoint(number, lastNumber, point) {
    if (number > point && lastNumber < point) {
        return "up"
    } else if (number < point && lastNumber > point) {
        return "down"
    } else {
        return null
    }
}

//beep
function beep(times) {
    times = times ? times : 1;
    for (var i = 0; i < times; i++)
        console.log("\007");
}

console.log(new Date() + "started");
console.log("delay for " + ramdomDelay + " seconds");
setTimeout(function () {
    var gapInterval = setInterval(function () {
            request.post(
                "https://api.m.sm.cn/rest?method=sc.yisou&q=%E5%A3%B0%E9%9F%B3%E7%9A%84%E6%88%98%E4%BA%89&ext=yisouvideolg_1732573&act=getmax&max_type=yisou_variety&max_sc_name=yisou_sc%3Ainter_op_max&max_sc_param=inter_op_max_subtype%3Dmulti_vote",
                function (error, response, data) {
                    var votes = JSON.parse(data).multi_vote[0].data;
                    var linjunjie = votes.find(function (item) {
                        return item.link == "林俊杰";
                    });
                    var hebe = votes.find(function (item) {
                        return item.link == "田馥甄";
                    });
                    checkTimes++;
                    loop = checkTimes % statTimes;
                    var gap = hebe.vote_count - linjunjie.vote_count;
                    if (loop == 1) {
                        stat.advance.start = gap;
                        stat.hebe.start = hebe.vote_count;
                        stat.linjunjie.start = linjunjie.vote_count;
                    }
                    if (loop == 0) {
                        stat.advance.end = gap;
                        stat.hebe.end = hebe.vote_count;
                        stat.linjunjie.end = linjunjie.vote_count;
                        var advance = stat.advance.end - stat.advance
                            .start;
                        var lagEachHour = Math.floor(
                            60 * 60 / stat.interval *
                            advance);
                        var remainTime = Math.floor(Math.abs(
                                gap) /
                            Math.abs(advance) *
                            stat.interval);
                        if (gap < 0) {
                            if (advance <= 0) {
                                console.error("!!!不可能追回!!!" +
                                    "---每小时落后" +
                                    lagEachHour +
                                    "---1小时后落后" + (
                                        lagEachHour + gap) +
                                    "---3小时后落后" + (3 *
                                        lagEachHour +
                                        gap) +
                                    "---5小时后落后" + (5 *
                                        lagEachHour +
                                        gap) +
                                    "---8小时后落后" + (8 *
                                        lagEachHour +
                                        gap));
                            } else {
                                console.info(secondstotime(
                                        remainTime) +
                                    " 可追回");
                            }
                        } else {
                            if (advance >= 0) {
                                console.info("领先扩大")
                            } else {
                                console.info(secondstotime(
                                        remainTime) +
                                    " 会被追回");
                            }
                            var halfHourAdvance = 0.5 *
                                lagEachHour + gap;
                            var tenMsAdvance = 0.2 *
                                lagEachHour + gap;
                            console.info(new Date() +
                                "---每小时领先" +
                                lagEachHour +
                                "---半小时后领先" +
                                halfHourAdvance +
                                "---1小时后领先" + (lagEachHour +
                                    gap) +
                                "---3小时后领先" + (3 *
                                    lagEachHour +
                                    gap) +
                                "---5小时后领先" + (5 *
                                    lagEachHour +
                                    gap) +
                                "---8小时后领先" + (8 *
                                    lagEachHour +
                                    gap));
                            if (tenMsAdvance < 0 || gap <
                                100000) {
                                balance(1);
                            } else if (gap >
                                limit.value) {
                                balance(0)
                            }
                        }

                        stat.advance.start = gap;
                    }
                    lastgap = gap;
                })
        },
        interval * 1000);

}, ramdomDelay * 1000);
