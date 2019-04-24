
var Http = require("../bin/www")

var xml = new Http.XML()

xml.get('http://www.baidu.com').then(function(data){
    console.log(data)
})
