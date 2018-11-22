let com = {
    transTime(val){
        let myDate = new Date(val),
            year = myDate.getFullYear(),
            month = myDate.getMonth()+1 < 10 ? '0'+Number(myDate.getMonth()+1) : Number(myDate.getMonth()+1),
            date = myDate.getDate() < 10 ? '0'+myDate.getDate() : myDate.getDate(),
            hh = myDate.getHours() < 10 ? '0'+myDate.getHours() : myDate.getHours(),
            mm = myDate.getMinutes() < 10 ? '0'+myDate.getMinutes() : myDate.getMinutes(),
            ss = myDate.getSeconds() < 10 ? '0'+myDate.getSeconds() : myDate.getSeconds()

        return year+"-"+month+"-"+date+" "+hh+":"+mm+":"+ss
    },
    returnFloat(value){  //保留两位小数
        var value=Math.round(parseFloat(value)*100)/100;
        var xsd=value.toString().split(".");
        if(xsd.length==1){
            value=value.toString()+".00";
            return value;
        }
        if(xsd.length>1){
            if(xsd[1].length<2){
                value=value.toString()+"0";
            }
            return value;
        }
    },
    filterUnit(val){
        let unit = '';
        switch(val){
            case 'P':
                unit = '个';
                break;
            case 'D':
                unit = '天';
                break;
            case '%':
                unit = '%';
                break;
            case 'M':
                unit = '月';
                break;
            case 'Y':
                unit = '年';
                break;
            default:
                unit = val
        }
        return unit
    },
    uniqueArray(array, key){   //JSON数组去重,唯一的key名，根据此键名进行去重
        var result = [array[0]];
        for(var i = 1; i < array.length; i++){
          var item = array[i];
          var repeat = false;
          for (var j = 0; j < result.length; j++) {
            if (item[key] == result[j][key]) {
              repeat = true;
              break;
            }
          }
          if (!repeat) {
            result.push(item);
          }
        }
        return result;
    },
}
export default com

// co.js
var slice = Array.prototype.slice;
co.wrap = function(fn) {
  createPromise.__generatorFunction__ = fn;
  return createPromise;
  function createPromise() {
    return co.call(this, fn.apply(this, arguments));
  }
};
function co(gen) {
  var ctx = this;
  var args = slice.call(arguments, 1)
  return new Promise(function(resolve, reject) {
    if (typeof gen === 'function') {
      gen = gen.apply(ctx, args);
    }
    if (!gen || typeof gen.next !== 'function') {
      return resolve(gen);
    }
    onFulfilled();
    function onFulfilled(res) {
      var ret;
      try {
        ret = gen.next(res);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }
    function onRejected(err) {
      var ret;
      try {
        ret = gen.throw(err);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }
    function next(ret) {
      if (ret.done) {
        return resolve(ret.value);
      }
      var value = toPromise.call(ctx, ret.value);
      if (value && isPromise(value)) {
        return value.then(onFulfilled, onRejected);
      }
      return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, ' + 'but the following object was passed: "' + String(ret.value) + '"'));        }
  });
}
function toPromise(obj) {
  if (!obj) return obj;
  if (isPromise(obj)) return obj;
  if (isGeneratorFunction(obj) || isGenerator(obj)) return co.call(this, obj);
  if ('function' == typeof obj) return thunkToPromise.call(this, obj);
  if (Array.isArray(obj)) return arrayToPromise.call(this, obj);
  if (isObject(obj)) return objectToPromise.call(this, obj);
  return obj;
}
function thunkToPromise(fn) {
  var ctx = this;
  return new Promise(function(resolve, reject) {
    fn.call(ctx, function(err, res) {
      if (err) return reject(err);
      if (arguments.length > 2) res = slice.call(arguments, 1);
      resolve(res);
    });
  });
}
function arrayToPromise(obj) {
  return Promise.all(obj.map(toPromise, this));
}
function objectToPromise(obj) {
  var results = new obj.constructor();
  var keys = Object.keys(obj);
  var promises = [];
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var promise = toPromise.call(this, obj[key]);
    if (promise && isPromise(promise)) defer(promise, key);
    else results[key] = obj[key];
  }
  return Promise.all(promises).then(function() {
    return results;
  });
  function defer(promise, key) {
    // predefine the key in the result
    results[key] = undefined;
    promises.push(promise.then(function(res) {
      results[key] = res;
    }));
  }
}
function isPromise(obj) {
  return 'function' == typeof obj.then;
}
function isGenerator(obj) {
  return 'function' == typeof obj.next && 'function' == typeof obj.throw;
}
function isGeneratorFunction(obj) {
  var constructor = obj.constructor;
  if (!constructor) return false;
  if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) return true;
  return isGenerator(constructor.prototype);
}
function isObject(val) {
  return Object == val.constructor;
}
function thunkify(fn) {
  return function() {
    var args = new Array(arguments.length);
    var ctx = this;

    for (var i = 0; i < args.length; ++i) {
      args[i] = arguments[i];
    }

    return function (done) {
      var called;

      args.push(function () {
        if (called) return;
        called = true;
        done.apply(null, arguments);
      });

      try {
        fn.apply(ctx, args);
      } catch (err) {
        done(err);
      }
    }
  }
}
export {co, thunkify}
