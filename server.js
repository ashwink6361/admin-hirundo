var express = require('express'),
    http = require('http'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    fs = require('fs'),
    path = require('path'),
    request = require('request'),
    _ = require('underscore-node'),
    cons = require('consolidate'),
    multer   = require('multer'),
    Config = require('./config/config'),
    root = fs.realpathSync('.'),
    app = express(),
    soap = require('soap'),
    download = require('image-downloader'),
    CircularJSON = require('circular-json');
//configuring vendor based middlewares
app.use('/release', express.static(__dirname + '/release/'));
app.use('/uploads', express.static(__dirname + '/uploads/'));
app.use('/assets', express.static(__dirname + '/release/assets/'));
app.use('/styles', express.static(__dirname + '/release/styles/'));
app.use('/fonts', express.static(__dirname + '/release/fonts/'));
app.use('/maps', express.static(__dirname + '/release/maps/'));
app.use('/node_modules', express.static(__dirname + '/node_modules/'));
app.use('/bower_components', express.static(__dirname + '/bower_components/')); //handling the statics - assets (js, css, images)
app.use('/scripts', express.static(__dirname + '/release/scripts/'));
app.use('/src', express.static(__dirname + '/src/'));
app.use('/lib', express.static(__dirname + '/lib/'));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({    
    extended: false
}));

app.all('*', function (req, res, next) {    
    res.header("Access-Control-Allow-Origin", "*");    
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');    
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');    
    next();
});

app.use(multer({
    dest: './uploads/'
}).any());

//rendering engine
app.set('views', './');
app.engine('html', cons.underscore);
app.set('view engine', 'html');
app.set('apiUrl', Config.apiUrl);
app.set('adminApiUrl', Config.adminApiUrl);
app.set('secretKey', Config.key.privateKey);
app.set('socketUrl', Config.socketUrl);
console.log(Config.adminApiUrl);

//intercepting API requests
app.use('/api/*', function (req, res, next) {    
    var token = req.cookies.session;    
    var headers = {        
        Authorization: 'Bearer ' + token,
        privatekey: app.set('secretKey')    
    };    
    var urlArr = req.originalUrl.split('/');    
    urlArr.splice(0, 2);    
    var path = urlArr.join('/');

        
    var method = req.method;    
    var uri = app.get('adminApiUrl') + path;     //POST INTERCEPTOR
console.log('method',method);
    
    if (method == 'POST') {  
console.log('in 1',method);
              
        if (_.isEmpty(req.files)) {            
            request.post({                
                url: uri,
                json: req.body,
                headers: headers            
            }, function (error, httpResponse, body) {                
                if (!error) {                    
                    res.status(httpResponse.statusCode).send(body);                
                }            
            });        
        } else {            
            var formData = req.body;            
            var fileObj = _.pairs(req.files);            
            for (var i = 0; i < fileObj.length; i++) {                
                formData[fileObj[i][1].fieldname] = fs.createReadStream(__dirname + '/uploads/' + fileObj[i][1].filename);                
                fs.unlink(__dirname + '/uploads/' + fileObj[i][1].filename, function (error) {});            
            }            
            request.post({                
                url: uri,
                formData: formData,
                headers: headers            
            }, function (error, httpResponse, body) {                
                if (!error) {                    
                    res.status(httpResponse.statusCode).send(body);                
                }            
            });        
        }    
    }     //PUT INTERCEPTOR
        
    if (method == 'PUT') {
console.log('in 2',method);
                
        if (_.isEmpty(req.files)) {            
            request.put({                
                url: uri,
                json: req.body,
                headers: headers            
            }, function (error, httpResponse, body) {                
                if (!error) {                    
                    res.status(httpResponse.statusCode).send(body);                
                }            
            });        
        } else {            
            var formData = req.body;            
            var fileObj = _.pairs(req.files);            
            for (var i = 0; i < fileObj.length; i++) {                
                formData[fileObj[i][1].fieldname] = fs.createReadStream(__dirname + '/uploads/' + fileObj[i][1].name);            
            }            
            request.put({                
                url: uri,
                formData: formData,
                headers: headers            
            }, function (error, httpResponse, body) {                
                if (!error) {                    
                    res.status(httpResponse.statusCode).send(body);                
                }            
            });        
        }    
    }

         //GET INTERCEPTOR
        
    if (method == 'GET') {  
console.log('in 3',method);
              
        request.get({            
            url: uri,
            headers: headers        
        }, function (error, httpResponse, body) {            
            if (!error) {                
                var resStatus = (httpResponse && httpResponse.statusCode) ? httpResponse.statusCode : 200;                
                res.status(resStatus).send(body);            
            } else {                
                var resStatus = (httpResponse && httpResponse.statusCode) ? httpResponse.statusCode : 500;                
                return res.status(resStatus).send({                    
                    err: error                
                });            
            }        
        });    
    }

         //DELETE INTERCEPTOR
        
    if (method == 'DELETE') {        
        request.del({            
            url: uri,
            headers: headers        
        }, function (error, httpResponse, body) {            
            if (!error) {                
                res.status(httpResponse.statusCode).send(body);            
            }        
        });    
    }
});

app.post('/login', function (req, res, next) {    
    var url = app.get('adminApiUrl') + 'login';    
    var body = req.body;
    body.secretKey = app.set('secretKey');    
    var headers = {        
        "accept-language": req.headers['accept-language'],
        "content-type": "application/json"    
    };    
    request.post({        
        url: url,
        json: body,
        headers: headers    
    }, function (error, httpResponse, body) {        
        if (!error) {            
            res.status(httpResponse.statusCode).send(body);        
        }    
    });
});

app.post('/forgetpassword', function (req, res, next) {    
    var url = app.get('adminApiUrl') + 'user/forgot/password';    
    var body = req.body;
    body.secretKey = app.set('secretKey');    
    var headers = {        
        "accept-language": req.headers['accept-language'],
        "content-type": "application/json"    
    };    
    request.post({        
        url: url,
        json: body,
        headers: headers    
    }, function (error, httpResponse, body) {        
        if (!error) {            
            res.status(httpResponse.statusCode).send(body);        
        }    
    });
});

app.get('/', function (req, res) {    
    res.sendFile(path.join(root, 'release/auth.html'));
});

app.get('/platform/', function (req, res) {
    res.render(path.join(root, 'release/index.html'), {
        apiUrl: app.get('adminApiUrl'),
        apiKey: app.get('secretKey'),
        socketUrl: app.get('socketUrl')
    });
});

app.get('/admin/account/verify', function (req, res) {
    var uri = app.get('adminApiUrl') + 'account/verify?userId=' + req.query.userId + '&email=' + req.query.email + '&token=' + req.query.token;    
    var headers = {        
        "accept-language": req.headers['accept-language'],
        "content-type": "application/json"    
    };
    request.get({
        url: uri,
        headers: headers
    }, function (error, httpResponse, body) {
        var result = JSON.parse(body);
        if (result.statusCode == 200) {
            res.send("<p style='text-align: center; color: #fff; background-color: green; padding: 20px; font-size: 18px;'>" + result.message + " <a href='/' style='color: #fff;'>Go</a> back to home</p>");
        } else {
            res.send("<p style='text-align: center; color: #fff; background-color: red; padding: 20px; font-size: 18px;'>" + result.message + " <a href='/' style='color: #fff;'>Go</a> back to home</p>");
        }
    });
});

// Reset Password

app.get('/resetPassword', function (req, res) {
    var uri = app.get('adminApiUrl') + '/user/reset/password?token=' + req.query.token;    
    var headers = {        
        "accept-language": req.headers['accept-language'],
        "content-type": "application/json"    
    };
    request.get({
        url: uri,
        headers: headers
    }, function (error, httpResponse, body) {
        if (!error) {
            var result = JSON.parse(body);
            res.render(path.join(root, 'release/user-reset-password.html'));
        } else {
            res.send(error);    
        }
    });
});

//SERVER LISTENING
var port = Config.server.port || 5001;
var server = app.listen(port, function () {    
var host = server.address().address;    
var port = server.address().port;     //Route to Frontend to make socket connection
console.log('Node server running at http://%s:%s. API in use: %s', host, port, app.get('env'));
});
