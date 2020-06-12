//首次执行的防抖
export function throttle(fn, remain = 1000) {
    let times = 0;
    return function () {
        const args = arguments;
        let context = this;
        if (times == 0) {
            fn.call(context, ...args);
            times = 1;
            setTimeout(() => {
                times = 0;
            }, remain);
        }
    };
}

//尾部执行的节流
export function debounceTail(fn, delay = 500, ctx) {
    let timerID = null;
    return function () {
        let args = arguments;
        // 清空上一次操作
        clearTimeout(timerID);
        // delay时间之后，任务执行
        timerID = setTimeout(function () {
            fn.apply(ctx, args);
        }, delay);
    };
}

//尾部执行的节流
/*
@
* */
export function debounceTailIncomponent(fn, delay = 500, ctx, timerName = 'timerID') {
    return function () {
        let args = arguments;
        // 清空上一次操作
        clearTimeout(ctx[timerName]);
        // delay时间之后，任务执行
        ctx[timerName] = setTimeout(function () {
            fn.apply(ctx, args);
        }, delay);
    };
}

export function isJSON(target) {
    return typeof target == 'object' && target.constructor == Object;
}

export function isArray(o) {
    return Object.prototype.toString.call(o) == '[object Array]';
}

export function isNumber(o) {
    return Object.prototype.toString.call(o) == '[object Number]';
}

export function mergeJSON(minor, main) {

    for (let key in minor) {
        if (main[key] === undefined || isArray(minor[key])) { // 不冲突的，直接赋值
            main[key] = minor[key];
            continue;
        }
        // 冲突了，如果是Object，看看有么有不冲突的属性
        // 不是Object 则以（minor）为准为主，
        if (isJSON(minor[key])) { // arguments.callee 递归调用，并且与函数名解耦
            //arguments.callee(minor[key], main[key]);
            mergeJSON(minor[key], main[key]);
        } else {
            main[key] = minor[key];
        }
    }
    return main;
    // console.log(main);
}

export function removePxUnit(str) {
    let len = str.length;
    return Number(str.substring(0, len - 2));
}

// 把一个数组按照一定长度分割成若干数组
function arrayGroup(array, subGroupLength) {
    let index = 0;
    let newArray = [];
    while (index < array.length) {
        newArray.push(array.slice(index, index += subGroupLength));
    }
    return newArray;
}

export function numberToChinese(number) {
    let reverseArr = String(number).split('').reverse();
    let numGroup = arrayGroup(reverseArr, 4);
    let chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    let chnUnitGroup = ['', '万', '亿', '万亿', '亿亿'];
    let chnUnitChar = ['', '十', '百', '千'];
    let zeroReg = new RegExp(/(0+)$/);
    let len = String(number).length;
    if (len === 1) {
        return chnNumChar[len];
    }
    let unitGroup = [];
    for (let i = 0; i < numGroup.length; i++) {
        const element = numGroup[i].reverse();
        let j = 0;
        let zeroCount = false;
        let zeroIndex = element.join('').match(zeroReg) && element.join('').match(zeroReg).index;
        let len = element.length;
        let array = [];
        while (j < len) {
            if (j === zeroIndex) {
                array[j] = chnUnitGroup[i];
                break;
            }
            if (element[j] == 0) {
                if (!zeroCount) {
                    array.push('零');
                }
                zeroCount = true;
            } else {
                zeroCount = false;
                if (j === len - 1) {
                    array.push(chnNumChar[element[j]] + chnUnitChar[len - j - 1] + chnUnitGroup[i]);
                } else {
                    array.push(chnNumChar[element[j]] + chnUnitChar[len - j - 1]);
                }
            }
            j++;
        }
        unitGroup.unshift(array);
    }
    return unitGroup.flat().join('').replace(/^一十/, '十');

}

export function minorNumberToChinese(number) {
    let numArray = String(number).split('');
    let chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    let chnUnitChar = ['', '十', '百', '千'];
    let zeroReg = new RegExp(/(0+)$/);
    let len = String(number).length;
    if (len === 1) {
        return chnNumChar[len];
    }
    let exportArr = [];
    let zeroIndex = numArray.join('').match(zeroReg) && numArray.join('').match(zeroReg).index;
    for (let i = 0; i < numArray.length; i++) {
        const element = numArray[i];
        let zeroCount = false;
        if (i === zeroIndex) {
            break;
        }
        if (element == 0) {
            if (!zeroCount) {
                exportArr.push('零');
            }
            zeroCount = true;
        } else {
            zeroCount = false;
            exportArr.push(chnNumChar[element] + chnUnitChar[len - i - 1]);
        }
    }
    return exportArr.join('').replace(/^一十/, '十');
}

// 获取url的token
export function getQueryString(name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    let r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

// 读取cookie
export function getCookie(name) {
    let arr = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'));
    if (arr != null) return unescape(arr[2]);
    return false;
}

// 自定义 log
export function log() {
    let d = new Date()
    let year = d.getFullYear()
    let month = d.getMonth() + 1
    let day = d.getDay()
    let hh = d.getHours()
    let mm = d.getMinutes()
    let ss = d.getSeconds()
    let text = `${year}/${month}/${day} ${hh}:${mm}:${ss} **********`
    console.log(text, ...arguments)
}


