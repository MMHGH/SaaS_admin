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