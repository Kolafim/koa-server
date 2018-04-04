/** 通用async转换函数 */
Function.prototype.sync = async function(...k){
  // console.log('arguments',arguments);
  let _t = this;
  let _f = new Promise(function (resolve, reject) {
    _t.call(_t, ...k, resolve, reject);
  }).catch((err)=>{
    //此处处理async过程中的异常
    if('object'==typeof Sync) Sync.url_temp = '';
    console.log('Function.sync err:',err);
  });
  return await _f;
};

// const _ajax = Symbol('ajax')

/**
 *  @ await Sync.post(url,data/form)
 *  @ await Sync.ajax({url,data/form,type,dataType})
 *  @ await Sync.sleep(ms) 等待ms
 *  @ Sync.formData(form) form表单序列
 */
// class Sync {
let Sync = {
  // constructor(){}
  url_temp:'',
  async sleep(ms){
    console.log(`sleep ${ms}ms!`);
    let _func = (ms,s)=>{
      setTimeout(()=>{
        console.log('sleep end!');
        s(ms);
      },ms);
    }
    await _func.sync(ms);
  },
  async ajax(obj){
    if(!obj.url) return false;
    if(obj.url == this.url_temp) {
      console.log('Sync.ajax 重复请求:',obj.url);
      return false;
    }
    if('object' == typeof obj && 'object' == typeof obj.data && obj.data.nodeName == 'FORM') obj.data = this.formData(obj.data)
    return await this._ajax.sync(obj)
  },
  async get(url,data){
    if('object' == typeof data && data.nodeName == 'FORM') data = this.formData(data)
    return await this._ajax.sync({url,data})
  },
  async post(url,data){
    if('object' == typeof data && data.nodeName == 'FORM') data = this.formData(data)
    return await this._ajax.sync({url,data,type:'POST'})
  },
  formData(form){
    var arr={};
    for (var i = 0; i < form.elements.length; i++) {
      var feled=form.elements[i];
      switch(feled.type) {
        case undefined:
        case 'button':
        case 'file':
        case 'reset':
        case 'submit':
        break;
        case 'checkbox':
        case 'radio':
        if (!feled.checked) {
          break;
        }
        default:
          if (arr[feled.name]) {
            arr[feled.name]=arr[feled.name]+','+feled.value;
          }else{
            arr[feled.name]=feled.value;
          }
      }
    }
    return arr
  },
  _ajax(obj,s,f){
    obj=obj||{};
    obj.type=(obj.type||'GET').toUpperCase();
    obj.dataType=obj.dataType||'json';
    let formatParams = function(data){
      //辅助函数，格式化参数
      var arr=[];
      for(var name in data){
         arr.push(encodeURIComponent(name)+"="+encodeURIComponent(data[name]));
      }
      // arr.push("t="+Math.random());//设置随机数，防止缓存
      return arr.join("&");
    };
    let params=formatParams(obj.data);//参数格式化
    if(window.XMLHttpRequest){
       var xhr=new XMLHttpRequest();
    }else{
       var xhr=new ActiveXObject('Microsoft.XMLHTTP');
    }

    xhr.onreadystatechange=function(x){
      if(xhr.readyState==4){
        Sync.url_temp = '';
        // if(xhr.state>=200 && xhr.status<300){
        s(JSON.parse(xhr.responseText))
      }
    }

    if(obj.type=='GET'){
       xhr.open('GET',obj.url+'?'+params,true);
       xhr.send(null);
    }else if(obj.type=='POST'){
       xhr.open('POST',obj.url,true);
       //设置请求头，以表单形式提交数据
       xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
       xhr.send(params);
    }
  }
}
