var _services = angular.module('ionic_rewards.services', ['ngFileUpload', 'ngImgCrop']);

_services.factory('BearerAuthInterceptor', function($window, $q, $injector) {
    return {
        request: function(config) {
            config.params = config.params || {};
            if ($window.localStorage.getItem('usr.token') && config.method == 'POST') { //SOLO PETICIONES A LA API
                // may also use sessionStorage
                if (typeof config.data == 'object') {
                    config.data.append('tokenAuth', $window.localStorage.getItem('usr.token'));
                } else {
                    config.data = config.data + '&tokenAuth=' + $window.localStorage.getItem('usr.token');
                }
                //config.params.tokenAuth = $window.localStorage.getItem('usr.token');
            }
            return config || $q.when(config);
        },
        response: function(response) {
            return response || $q.when(response);
        },
        responseError: function(rejection) {
            switch (rejection.status) {
                case 401:
                    //  Redirect user to login page / signup Page.
                    $window.location = "#/login";
                    break;
                case 403:
                    $ionicLoading.show({
                        template: rejection.data.message,
                        duration: 2000
                    });
                    break;

            }
            return $q.reject(rejection);
        }
    };
});

_services.service('AjaxService', function($http, $httpParamSerializer, $cordovaFileTransfer, $q, app_config, Upload) {
    function _processArrays(data) {
        var _newData = {}
        angular.forEach(data, function(item, key) {
            if (item && typeof(item.push) == 'function') _newData[key + '[]'] = item;
            else _newData[key] = item
        });
        return _newData;
    }

    function serialize(obj, prefix) {
        var str = [];
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                var k = prefix ? prefix + "[" + p + "]" : p,
                    v = obj[p];
                str.push(typeof v == "object" ?
                    serialize(v, k) :
                    encodeURIComponent(k) + "=" + encodeURIComponent(v));
            }
        }
        return str.join("&");
    }

    return {
        run_ajax: function(prms_api) {
            return $http({
                method: 'POST',
                url: app_config.apiUrl,
                data: $httpParamSerializer(_processArrays(prms_api)),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
        },
        send_form_1pic: function(extra_prms, local_image) {
            var formData = new FormData();

            angular.forEach(extra_prms, function(value, key) {
                formData.append(key, value);
            });
            if (local_image !== null) {
                formData.append("data_img", Upload.dataUrltoBlob(local_image));
            }

            return $http({
                method: 'POST',
                url: app_config.apiUrl,
                data: formData,
                headers: {
                    'Content-Type': undefined
                },
                enctype: 'multipart/form-data'
            });
            /*
                        var options = new FileUploadOptions(),
                            ft = new FileTransfer();
                        if (localStorage.getItem('usr.token')) { //ANEXAR TOKEN EN LA SUBIDA DE IMAGENES
                            extra_prms.tokenAuth = localStorage.getItem('usr.token');
                        }
                        options.fileKey = "data_img";
                        options.fileName = local_image.split("/").pop();
                        options.mimeType = "image/png";
                        options.params = extra_prms; //PARAMS EXTRAS EN EL POST AL SERVER

                        return $cordovaFileTransfer.upload(app_config.apiUrl, local_image, options);*/
        }, //SUBE MULTI-IMAGENES A AWS Y DEVUELVE SU URL ASOCIADO A UN KEY
        upload_bunch_images: function(data) {
            var _tasks = [],
                _self = this;

            angular.forEach(data.images, function(image) {
                var _prms, promise;
                if (image.url) {
                    _prms = angular.extend({}, data.api, {
                        'key': image.key
                    });

                    promise = _self.send_form_1pic(_prms, image.url);
                    _tasks.push(promise);
                }

            });

            return $q.all(_tasks);
        }
    };
});
/*
 *
 */
_services.factory('ctrlPickImage', ['$q', '$ionicPlatform', '$cordovaImagePicker',
    function($q, $ionicPlatform, $cordovaImagePicker) {

        return {
            sel_Image: function(MAX_ALLOWED, sizes) {

                var _def = $q.defer(),
                    _iw = sizes ? sizes[0] : 240,
                    _ih = sizes ? sizes[1] : 240;

                $ionicPlatform.ready(function() {

                    if (window.imagePicker) {
                        var options = {
                            maximumImagesCount: MAX_ALLOWED || 4,
                            width: _iw,
                            height: _ih
                        };
                        $cordovaImagePicker.getPictures(options).then(function(results) {
                            if (results.length > 0) {
                                _def.resolve(((MAX_ALLOWED == 1) ? results[0] : results));
                            }
                        });
                    } else {
                        _def.reject();
                    }

                });

                return _def.promise;

            }
        };
    }
]);



_services.service('ctrlPickImagecrop', ['$q', '$ionicPlatform', '$cordovaImagePicker', '$ionicModal', '$ionicActionSheet',
    function($q, $ionicPlatform, $cordovaImagePicker, $ionicModal, $ionicActionSheet) {
        return {
            sel_Image: function($scope, sizes, nodelete) {
                var _def = $q.defer(),
                    _iw = typeof sizes !== 'undefined' ? sizes : 240;
                $scope.sizesImg = {
                    width: _iw
                };
                var options = (typeof nodelete !== 'undefined' && nodelete ===true)?[{
                    text: '<b>Upload</b>'
                }]:[{
                    text: '<b>Upload</b>'
                }, {
                    text: 'Delete'
                }];

                var actionSheet = $ionicActionSheet.show({
                    buttons: options,
                    titleText: 'Change image',
                    cancelText: 'Cancel',
                    cancel: function() {
                        _def.reject(angular.copy(null));
                    },
                    buttonClicked: function(index) {
                        switch (index) {
                            case 0:
                                (function() {
                                    $ionicModal.fromTemplateUrl('templates/add_img.html', {
                                            scope: $scope,
                                            controller: 'AddimgCtrl',
                                            animation: 'slide-in-up'
                                        })
                                        .then(function(modal) {
                                            $scope.aux_modal = {
                                                'el': modal,
                                                'img': modal.el.querySelector('img'),
                                                'defer': _def
                                            };
                                            modal.show();
                                        });
                                })();
                                break;
                            case 1:
                                _def.resolve(angular.copy(null));
                                break;
                            default:
                                _def.reject(angular.copy(null));
                        }
                        return true;
                    }
                });
                return _def.promise;

            }
        };
    }
]);




/*
 *
 */
_services.factory('session', function($q, AjaxService) {
    var _self = this,
        account = {},
        prms_api = {
            'query': {
                'method': 'get.account',
                'app_ns': 'reifax.service.reward'
            },
        };

    _self._user = (window.localStorage['usr.data']) ? JSON.parse(window.localStorage['usr.data']) : {};

    function readAccount() {
        return JSON.parse(window.localStorage.getItem('loyalty')) || {};
    }

    (function() {
        account = readAccount();
    })();

    return {
        loyalty: account,
        setSession: function(data) {
            _self._user = data.user;
            window.localStorage['usr.data'] = JSON.stringify(data.user);
            window.localStorage['usr.token'] = data.jwt;
        },
        getSession: function() {
            return _self._user;
        },
        destroy: function() {
            this.setSession({
                'user': {},
                'jwt': ''
            });
        },
        getAccount: function() {
            return this.loyalty;
        }
    }
});
