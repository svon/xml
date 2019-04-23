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

function qs (data) {
    var param = []
    data || (data = {})
    for (var key in data) {
        param.push(key + '=' + data[key])
    }
    if (param.length > 0) {
        return param.join('&')
    }
    return ''
}

function http(option) {
    let opt = Object.assign({
        success: 10000
    }, option || {})
    const http = new Http(null, opt.token, opt.headers)
    http.interceptors.response.use(function(response){
        if (response.code || response.code === 0) {
            if (response.code === opt.success) {
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

function get(url, data) {
    const xhr = http()
    return xhr({
        url: url + '?' + qs(data),
        method: 'GET'
    })
}

function post(url, data) {
    const xhr = http()
    return xhr({
        url: url,
        data: data,
        method: 'POST'
    })
}

// get: function(url, data) {
//     let query = qs(data);
//     return http({
//         method: 'get',
//         url: url + (query ? '?' + query : query),
//     });
// },
// post: function(url, data) {
//     return http({
//         method: 'post',
//         url: url,
//         data: data,
//     });
// },
// // 表单提交，比如需要上传文件
// form: function (url, data) {
//     return http({
//         method: 'post',
//         url: url,
//         data: data,
//         headers: {
//             'Content-Type': 'multipart/form-data'
//         }
//     });
// },
// put: function (url, data) {
//     return http({
//         method: 'put',
//         url: url,
//         data: data,
//     });
// },
// 'delete': function (url, data) {
//     let query = qs(data);
//     return http({
//         method: 'delete',
//         url: url + (query ? '?' + query : query),
//     });
// },
// table: function (method, url, data) {
//     method = (data.method || 'get').toLocaleLowerCase();
//     return new Promise(function(resolve, reject) {
//         require(['table'], function (Table) {
//             var table = Table();
//             table[method](url, data).then(function (result) {
//                 resolve(result);
//             }).catch(function (error) {
//                 reject(error);
//             });
//         });
//     });
// }

module.exports = {
    Http: Http,
    http: http,
    get: get,
    post: post
}
