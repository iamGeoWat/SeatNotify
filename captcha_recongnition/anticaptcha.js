var Anticaptcha = function(clientKey) {
    return new function(clientKey) {
        this.params = {
            host: 'api.anti-captcha.com',
            port: 80,
            clientKey: clientKey,

            // reCAPTCHA 2
            websiteUrl: null,
            websiteKey: null,
            websiteSToken: null,
            recaptchaDataSValue: null,
            proxyType: 'http',
            proxyAddress: null,
            proxyPort: null,
            proxyLogin: null,
            proxyPassword: null,
            userAgent: '',
            cookies: '',

            // reCAPTCHA 3
            minScore: '',
            pageAction: '',

            // FunCaptcha
            websitePublicKey: null,
            funcaptchaApiJSSubdomain: null,

            // GeeTest
            websiteChallenge: null,
            geetestApiServerSubdomain: null,
            geetestGetLib: null,

            // image
            phrase: null,
            case: null,
            numeric: null,
            math: null,
            minLength: null,
            maxLength: null,

            // CustomCaptcha
            imageUrl: null,
            assignment: null,
            forms: null,

            softId: null,
            languagePool: null
        };

        var connectionTimeout = 20,
            firstAttemptWaitingInterval = 5,
            normalWaitingInterval = 2;

        this.getBalance = function (cb) {
            var postData = {
                clientKey: this.params.clientKey
            };

            this.jsonPostRequest('getBalance', postData, function (err, jsonResult) {
                if (err) {
                    return cb(err, null, jsonResult);
                }

                cb(null, jsonResult.balance, jsonResult);
            });
        };

        this.createTask = function (cb, type, taskData) {
            type = typeof type == 'undefined' ? 'NoCaptchaTask' : type;
            var taskPostData = this.getPostData(type);
            taskPostData.type = type;

            // Merge incoming and already fetched taskData, incoming data has priority
            if (typeof taskData == 'object') {
                for (var i in taskData) {
                    taskPostData[i] = taskData[i];
                }
            }

            var postData = {
                clientKey: this.params.clientKey,
                task: taskPostData,
                softId: this.params.softId !== null ? this.params.softId : 0
            };

            if (this.params.languagePool !== null) {
                postData.languagePool = this.params.languagePool;
            }

            this.jsonPostRequest('createTask', postData, function (err, jsonResult) {
                if (err) {
                    return cb(err, null, jsonResult);
                }

                // Task created
                var taskId = jsonResult.taskId;

                cb(null, taskId, jsonResult);
            });
        };

        this.createTaskProxyless = function (cb) {
            this.createTask(cb, 'NoCaptchaTaskProxyless');
        };

        this.createHCaptchaTaskProxyless = function (cb) {
            this.createTask(cb, 'HCaptchaTaskProxyless');
        };

        this.createHCaptchaTask = function (cb) {
            this.createTask(cb, 'HCaptchaTask');
        };

        this.createRecaptchaV3TaskProxyless = function (cb) {
            this.createTask(cb, 'RecaptchaV3TaskProxyless');
        };

        this.createFunCaptchaTask = function(cb) {
            this.createTask(cb, 'FunCaptchaTask');
        };

        this.createFunCaptchaTaskProxyless = function(cb) {
            this.createTask(cb, 'FunCaptchaTaskProxyless');
        };

        this.createGeeTestTask = function(cb) {
            this.createTask(cb, 'GeeTestTask');
        };

        this.createGeeTestTaskProxyless = function(cb) {
            this.createTask(cb, 'GeeTestTaskProxyless');
        };

        this.createImageToTextTask = function (taskData, cb) {
            this.createTask(cb, 'ImageToTextTask', taskData);
        };

        this.createCustomCaptchaTask = function (cb) {
            this.createTask(cb, 'CustomCaptchaTask');
        };

        this.getTaskRawResult = function(jsonResult) {
            if (typeof jsonResult.solution.gRecaptchaResponse != 'undefined') {
                return jsonResult.solution.gRecaptchaResponse;
            } else if (typeof jsonResult.solution.token != 'undefined') {
                return jsonResult.solution.token;
            } else if (typeof jsonResult.solution.answers != 'undefined') {
                return jsonResult.solution.answers;
            } else if (typeof jsonResult.solution.text !== 'undefined') {
                return jsonResult.solution.text;
            } else {
                return jsonResult.solution;
            }
        }

        this.getTaskSolution = function (taskId, cb, currentAttempt, tickCb) {
            currentAttempt = currentAttempt || 0;

            var postData = {
                clientKey: this.params.clientKey,
                taskId: taskId
            };

            var waitingInterval;
            if (currentAttempt == 0) {
                waitingInterval = firstAttemptWaitingInterval;
            } else {
                waitingInterval = normalWaitingInterval;
            }

            console.log('Waiting %s seconds', waitingInterval);

            var that = this;

            setTimeout(function() {
                that.jsonPostRequest('getTaskResult', postData, function (err, jsonResult) {
                    if (err) {
                        return cb(err, null, jsonResult);
                    }

                    if (jsonResult.status == 'processing') {
                        // Every call I'm ticki-ing
                        if (tickCb) {
                            tickCb();
                        }
                        return that.getTaskSolution(taskId, cb, currentAttempt + 1, tickCb);
                    } else if (jsonResult.status == 'ready') {
                        return cb(
                            null,
                            that.getTaskRawResult(jsonResult),
                            jsonResult
                        );
                    }
                });
            }, waitingInterval * 1000);
        };

        this.getPostData = function(type) {
            switch (type) {
                case 'CustomCaptchaTask':
                    return {
                        imageUrl:       this.params.imageUrl,
                        assignment:     this.params.assignment,
                        forms:          this.params.forms
                    };
                case 'ImageToTextTask':
                    return {
                        phrase:         this.params.phrase,
                        case:           this.params.case,
                        numeric:        this.params.numeric,
                        math:           this.params.math,
                        minLength:      this.params.minLength,
                        maxLength:      this.params.maxLength
                    };
                    break;
                case 'NoCaptchaTaskProxyless':
                    return {
                        websiteURL:     this.params.websiteUrl,
                        websiteKey:     this.params.websiteKey,
                        websiteSToken:  this.params.websiteSToken,
                        recaptchaDataSValue:  this.params.recaptchaDataSValue
                    };
                    break;
                case 'HCaptchaTaskProxyless':
                    return {
                        websiteURL:     this.params.websiteUrl,
                        websiteKey:     this.params.websiteKey
                    };
                    break;
                case 'HCaptchaTask':
                    return {
                        websiteURL:     this.params.websiteUrl,
                        websiteKey:     this.params.websiteKey,
                        proxyType:      this.params.proxyType,
                        proxyAddress:   this.params.proxyAddress,
                        proxyPort:      this.params.proxyPort,
                        proxyLogin:     this.params.proxyLogin,
                        proxyPassword:  this.params.proxyPassword,
                        userAgent:      this.params.userAgent,
                        cookies:        this.params.cookies
                    };
                    break;
                case 'RecaptchaV3TaskProxyless':
                    return {
                        websiteURL:     this.params.websiteUrl,
                        websiteKey:     this.params.websiteKey,
                        minScore:       this.params.minScore,
                        pageAction:     this.params.pageAction,
                    };
                    break;
                case 'FunCaptchaTask':
                    return {
                        websiteURL:                 this.params.websiteUrl,
                        websitePublicKey:           this.params.websitePublicKey,
                        funcaptchaApiJSSubdomain:   this.params.funcaptchaApiJSSubdomain,
                        proxyType:          this.params.proxyType,
                        proxyAddress:       this.params.proxyAddress,
                        proxyPort:          this.params.proxyPort,
                        proxyLogin:         this.params.proxyLogin,
                        proxyPassword:      this.params.proxyPassword,
                        userAgent:          this.params.userAgent,
                        cookies:            this.params.cookies
                    };
                    break;
                case 'FunCaptchaTaskProxyless':
                    return {
                        websiteURL:                 this.params.websiteUrl,
                        websitePublicKey:           this.params.websitePublicKey,
                        funcaptchaApiJSSubdomain:   this.params.funcaptchaApiJSSubdomain,
                    }
                case 'GeeTestTask':
                    return {
                        websiteURL:                 this.params.websiteUrl,
                        gt:                         this.params.websiteKey,
                        challenge:                  this.params.websiteChallenge,
                        geetestApiServerSubdomain:  this.params.geetestApiServerSubdomain,
                        geetestGetLib:              this.params.geetestGetLib,

                        proxyType:                  this.params.proxyType,
                        proxyAddress:               this.params.proxyAddress,
                        proxyPort:                  this.params.proxyPort,
                        proxyLogin:                 this.params.proxyLogin,
                        proxyPassword:              this.params.proxyPassword,
                        userAgent:                  this.params.userAgent,
                        cookies:                    this.params.cookies
                    };
                    break;
                case 'GeeTestTaskProxyless':
                    return {
                        websiteURL:                 this.params.websiteUrl,
                        gt:                         this.params.websiteKey,
                        challenge:                  this.params.websiteChallenge,
                        geetestApiServerSubdomain:  this.params.geetestApiServerSubdomain,
                        geetestGetLib:              this.params.geetestGetLib,
                    }
                default: // NoCaptchaTask
                    return {
                        websiteURL:     this.params.websiteUrl,
                        websiteKey:     this.params.websiteKey,
                        websiteSToken:  this.params.websiteSToken,
                        recaptchaDataSValue:  this.params.recaptchaDataSValue,
                        proxyType:      this.params.proxyType,
                        proxyAddress:   this.params.proxyAddress,
                        proxyPort:      this.params.proxyPort,
                        proxyLogin:     this.params.proxyLogin,
                        proxyPassword:  this.params.proxyPassword,
                        userAgent:      this.params.userAgent,
                        cookies:        this.params.cookies
                    };
            }


        };

        this.jsonPostRequest = function(methodName, postData, cb) {
            if (typeof process === 'object' && typeof require === 'function') { // NodeJS
                var http = require('http');

                // http request options
                var options = {
                    hostname: this.params.host,
                    port: this.params.port,
                    path: '/' + methodName,
                    method: 'POST',
                    headers: {
                        'accept-encoding':  'gzip,deflate',
                        'content-type':     'application/json; charset=utf-8',
                        'accept':           'application/json',
                        'content-length':   Buffer.byteLength(JSON.stringify(postData))
                    }
                };

                // console.log(options);
                // console.log(JSON.stringify(postData));

                var req = http.request(options, function(response) { // on response
                    var str = '';

                    // another chunk of data has been recieved, so append it to `str`
                    response.on('data', function (chunk) {
                        str += chunk;
                    });

                    // the whole response has been recieved, so we just print it out here
                    response.on('end', function () {
                        // console.log(str);

                        try {
                            var jsonResult = JSON.parse(str);
                        } catch (err) {
                            return cb(err);
                        }

                        if (jsonResult.errorId) {
                            return cb(new Error(jsonResult.errorDescription, jsonResult.errorCode), jsonResult);
                        }

                        return cb(null, jsonResult);
                    });
                });

                // send post data
                req.write(JSON.stringify(postData));
                req.end();

                // timeout in milliseconds
                req.setTimeout(connectionTimeout * 1000);
                req.on('timeout', function() {
                    console.log('timeout');
                    req.abort();
                });

                // After timeout connection throws Error, so we have to handle it
                req.on('error', function(err) {
                    console.log('error');
                    return cb(err);
                });

                return req;
            } else if (
                // in browser or chrome extension
                typeof window !== 'undefined' || typeof chrome === 'object'
            ) {
                var protocol;
                protocol = window.location.protocol != 'http:' ? 'https:' : window.location.protocol;
                var url = protocol + '//'
                    + this.params.host
                    + (protocol != 'https:' ? ':' + this.params.port : '')
                    + '/' + methodName;

                // with jQuery
                if (typeof jQuery == 'function') {
                    jQuery.ajax(
                        url,
                        {
                            method: 'POST',
                            data: JSON.stringify(postData),
                            dataType: 'json',
                            success: function (jsonResult) {
                                if (jsonResult && jsonResult.errorId) {
                                    return cb(new Error(jsonResult.errorDescription, jsonResult.errorCode), jsonResult);
                                }

                                cb(false, jsonResult);
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                cb(new Error(textStatus != 'error' ? textStatus : 'Unknown error, watch console')); // should be errorThrown
                            }
                        }
                    );
                }
            } else {
                console.error('Application should be run either in NodeJs or a WebBrowser environment');
            }
        };

        this.setClientKey = function (value) {
            this.params.clientKey = value;
        };

        //proxy access parameters
        this.setWebsiteURL = function (value) {
            this.params.websiteUrl = value;
        };

        this.setWebsiteKey = function (value) {
            this.params.websiteKey = value;
        };

        this.setMinScore = function (value) {
            this.params.minScore = value;
        };

        this.setPageAction = function (value) {
            this.params.pageAction = value;
        };

        this.setWebsiteSToken = function (value) {
            this.params.websiteSToken = value;
        };

        this.setRecaptchaDataSValue = function (value) {
            this.params.recaptchaDataSValue = value;
        };

        this.setWebsitePublicKey = function (value) {
            this.params.websitePublicKey = value;
        };

        this.setFuncaptchaApiJSSubdomain = function (value) {
            this.params.funcaptchaApiJSSubdomain = value;
        };

        this.setWebsiteChallenge = function (value) {
            this.params.websiteChallenge = value;
        };

        this.setGeetestApiServerSubdomain = function (value) {
            this.params.geetestApiServerSubdomain = value;
        };

        this.setGeetestGetLib = function (value) {
            this.params.geetestGetLib = value;
        };

        this.setProxyType = function (value) {
            this.params.proxyType = value;
        };

        this.setProxyAddress = function (value) {
            this.params.proxyAddress = value;
        };

        this.setProxyPort = function (value) {
            this.params.proxyPort = value;
        };

        this.setProxyLogin = function (value) {
            this.params.proxyLogin = value;
        };

        this.setProxyPassword = function (value) {
            this.params.proxyPassword = value;
        };

        this.setUserAgent = function (value) {
            this.params.userAgent = value;
        };

        this.setCookies = function (value) {
            this.params.cookies = value;
        };

        // image
        this.setPhrase = function (value) {
            this.params.phrase = value;
        };

        this.setCase = function (value) {
            this.params.case = value;
        };

        this.setNumeric = function (value) {
            this.params.numeric = value;
        };

        this.setMath = function (value) {
            this.params.math = value;
        };

        this.setMinLength = function (value) {
            this.params.minLength = value;
        };

        this.setMaxLength = function (value) {
            this.params.maxLength = value;
        };

        this.setImageUrl = function (value) {
            this.params.imageUrl = value;
        };

        this.setAssignment = function (value) {
            this.params.assignment = value;
        };

        this.setForms = function (value) {
            this.params.forms = value;
        };

        this.setSoftId = function (value) {
            this.params.softId = value;
        };

        this.setLanguagePool = function (value) {
            this.params.languagePool = value;
        };

        this.setHost = function (value) {
            this.params.host = value;
        };

        this.setPort = function (value) {
            this.params.port = value;
        };

    }(clientKey);
};

if (typeof process === 'object' && typeof require === 'function') { // NodeJS
    module.exports = Anticaptcha;
}
