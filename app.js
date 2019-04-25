/*!
     express ajax
     author: svon <svon.me@gmail.com>
 */
 const axios = require('axios')
 const Qs = require('qs')

 function Http(baseURL, token, headers) {
     var opt = {
         baseURL: baseURL,
         timeout: 5000,
         headers: {
             'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
         },
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

// function qs (data) {
//     var param = []
//     data || (data = {})
//     for (var key in data) {
//         param.push(key + '=' + data[key])
//     }
//     if (param.length > 0) {
//         return param.join('&')
//     }
//     return ''
// }

function http(baseURL, success, token, headers) {
    const http = new Http(baseURL, token, headers)
    http.interceptors.response.use(function(response){
        if (response.code || response.code === 0) {
            if (response.code === success) {
                return response.data
            }
            return Promise.reject(response)
        } else {
            return response
        }
    }, function(error){
        if (error) {
            return Promise.reject(error.response)
        }
        return Promise.reject(error)
    });
    return http
}

class XML {
    constructor(baseURL, success, token, headers) {
        this.http = http(baseURL, token, headers)
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
