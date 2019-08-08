/*!
     express ajax
     author: svon <svon.me@gmail.com>
 */
 var axios = require('axios')
 var Qs = require('qs')
// 创建 axios 对象
 function Http(baseURL, token, headers) {
     var opt = {
         baseURL: baseURL,
         timeout: 5000,
         headers: {
             'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
         },
         withCredentials: true,
         transformRequest: [
             function(data) {
                 if (data) {
                     var to_string = data.toString()
                     if (to_string.indexOf('FormData') >= 0) {
                         return data
                     }
                     return Qs.stringify(data)
                 }
                 return ''
             }
         ]
     };
     if (token) {
         opt.headers = Object.assign(opt.headers, {
             token: token
         })
     }
     if (headers) {
         opt.headers = Object.assign(opt.headers, headers)
     }
     // 初始化 http 对象
     var http = axios.create(opt)
     http.interceptors.response.use(function(response){
         if (response.status === 200 || response.statusText === 'OK') {
             return response.data
         }
         return response
     }, function(error){
         return Promise.reject(error.response)
     })
     return http
}
// 实列化一个 http 对象
function http(baseURL, success, token, headers) {
    var http = new Http(baseURL, token, headers)
    http.interceptors.response.use(function(response){
        if (response.code || response.code === 0) {
            if (success) {
                var data = response.data
                if (response['code'] === success) {
                    return response.data
                }
                return Promise.reject(response)
            }
            return response.data
        } else {
            return response
        }
    }, function(error){
        if (error) {
            return Promise.reject(error.response)
        }
        console.log(5)
        return Promise.reject(error)
    });
    return http
}

class XML {
    constructor(baseURL, success, token, headers) {
        this.http = http(baseURL, success, token, headers)
    }
    get(url, data) {
        return this.http({
            url: url,
            params: data,
            method: 'GET'
        })
    }
    post(url, data) {
        return this.http({
            url: url,
            data: data,
            method: 'POST'
        })
    }
    form(url, data) {
        return this.http({
            url: url,
            data: data,
            method: 'POST'
        })
    }
    put(url, data) {
        return this.http({
            method: 'put',
            url: url,
            data: data,
        })
    }
    ['delete'](url, data) {
        return this.http({
            method: 'delete',
            params: data,
            url: url
        })
    }
}


module.exports = {
    Http: Http,
    XML: XML
}
