var _controllers = angular.module('ionic_rewards.controllers', []);
_controllers.controller('cssCtrl',
    function($scope, $sce, $timeout, app_config) {
        var _self = this,
            _css = '';
        _self.mystyles = '';
        _self.company = app_config.dataCompany;
        /*if(app_config.dataCompany.costApkCbg) _self.mystyles='.scrollx:not(.notheme), .bar-subfooter, .item:not(.notheme), .pane:not(.notheme), .view:not(.notheme), ion-footer-bar.bar{background-color:' +app_config.dataCompany.costApkCbg+';}';
        if(app_config.dataCompany.costApkCfc) _self.mystyles+='ion-view .icon:not(.istab), .item:not(.notheme),.item p:not(.notheme), .item h1:not(.notheme), .item h2:not(.notheme), .item h3:not(.notheme), .item h4:not(.notheme), .item h5:not(.notheme), .item h6:not(.notheme) {color:' +app_config.dataCompany.costApkCfc+';}';*/
        //COLORIZING APP
        $timeout(function() {
            //ITEMS: COLOR FONDO Y LETRA
            if (app_config.dataCompany.costApkIbg) _css += ' ion-item:not(.notheme) *,.item:not(.notheme),  .item:not(.notheme) *:not(.track):not(.handle) {background-color:' + app_config.dataCompany.costApkIbg + ' !important;}\n\r';
            if (app_config.dataCompany.costApkIfc) _css += '.item:not(.notheme), .item:not(.notheme):not(.track) * {color:' + app_config.dataCompany.costApkIfc + ' !important;}\n\r';
            //TOOLBAR: COLOR
            if (app_config.dataCompany.costApkTbic) _css += '.barraIconos * {color:' + app_config.dataCompany.costApkTbic + ' !important;}\n\r';
            //HEADER: COLOR FONDO,  LETRA E ICON
            if (app_config.dataCompany.costApkHbg) _css += 'ion-header-bar:not(.notheme), .header-item>.nav-bar-title:not(.notheme) {background-color:' + app_config.dataCompany.costApkHbg + ' !important;}\n\r';
            if (app_config.dataCompany.costApkHfc) _css += 'ion-header-bar:not(.notheme) *, ion-header-bar > button:not(.notheme) {color:' + app_config.dataCompany.costApkHfc + ' !important;}\n\r';
            //TABS: COLOR FONDO,  LETRA E ICON
            if (app_config.dataCompany.costApkTbc) _css += 'ion-tabs .tab-item:not(.notheme) {background-color:' + app_config.dataCompany.costApkTbc + ' !important;}\n\r';
            if (app_config.dataCompany.costApkTfc) _css += 'ion-tabs .tab-item:not(.notheme) {color:' + app_config.dataCompany.costApkTfc + ' !important;}\n\r';
            //BUTTONS: COLOR FONDO,  LETRA E ICON
            if (app_config.dataCompany.costApkBbc) _css += 'ion-content button.button:not(.notheme) {background-color:' + app_config.dataCompany.costApkBbc + ' !important;}\n\r';
            if (app_config.dataCompany.costApkBfc) _css += 'ion-content button.button:not(.notheme) {color:' + app_config.dataCompany.costApkBfc + ' !important;}\n\r';
            //BACKGROUND: COLOR FONDO Y LETRA
            if (app_config.dataCompany.costApkCbg) _css += '.bar-subfooter, .bar-subheader, ion-view ion-content:not(.notheme), ion-footer-bar.bar, ion-side-menu, .item[menu-close] {background-color:' + app_config.dataCompany.costApkCbg + ' !important;}\n\r';
            if (app_config.dataCompany.costApkCfc) _css += 'ion-content:not(.notheme) * , .item[menu-close] {color:' + app_config.dataCompany.costApkCfc + ' !important;}\n\r';
            _self.mystyles = $sce.trustAsHtml(_css);
        }, 1);
    }
);
//
_controllers.controller('InitPageCtrl',
    function($scope, $ionicSlideBoxDelegate, $timeout, company_mgr, reward_mgr, app_config, session, Auth) {
        var _self = this;
        _self.company = app_config.dataCompany;

        _self.isIphone = ionic.Platform.isIOS() || ionic.Platform.isIPad();

        if (session.loyalty.card) {
            JsBarcode("#barcode", session.loyalty.card, {
                format: "EAN",
                lineColor: (app_config.dataCompany.costApkBcc || '#000'),
                height: 30,
                displayValue: true,
                fontSize: 20
            });
        }
        //CONFIGURACION DEFAULT
        $scope.ratingsObject = {
            iconOn: 'ion-ios-star', //Optional
            iconOff: 'ion-ios-star-outline', //Optional
            iconOnColor: 'rgb(200, 200, 100)', //Optional
            iconOffColor: 'rgb(200, 100, 100)', //Optional
            rating: session.loyalty.balance || 1, //Optional
            minRating: 1, //Optional
            readOnly: true, //Optional
            callback: null
        };
        $timeout(function() {
            $ionicSlideBoxDelegate.update();
        }, 100);
        _self.isLogged = Auth.isLogued;
        _self.rewards = {
            'list': [],
            'conf': {}
        };
        _self.rewards.conf = reward_mgr.conf;
        reward_mgr.get_conf(app_config.company);
        reward_mgr.query(app_config.company).then(function(result) {
            var _reverse = reward_mgr.list.slice().reverse(); //REVERSE
            _self.rewards.list = _reverse;
        });
        _self.openSN = function(sn) {
            var _url = '#';
            switch (sn) {
                case 'fb':
                    if (_self.company.fb) _url = _self.company.fb;
                    break;
                case 'ig':
                    if (_self.company.ig) _url = 'https://www.instagram.com/' + _self.company.ig + '/';
                    break;
                case 'tw':
                    if (_self.company.tw) _url = 'https://twitter.com/' + _self.company.tw;
                    break;
            }
            if (_url != '#') window.open(_url, '_blank', 'location=no');
        };
        _self.showlvl = function(lvl) {
            return !isNaN(parseFloat(_self.rewards.conf.points)) && isFinite(_self.rewards.conf.points) ? _self.rewards.conf.points * lvl : 0;
        };
    }
);
_controllers.controller('menuCtrl',
    function($scope, $state, Auth, app_config) {
        var _self = this;
        _self.isLogged = Auth.isLogued;
        _self.authorize = Auth.authorize;
        console.log(_self.isLogged());
        _self.goBO = function() {
            window.localStorage['BO_company'] = app_config.dataCompany.ID;
            $state.go('admin.modules', {}); //second parameter is for $stateParams
        };
    });
//
_controllers.controller('locCtrl',
    function($scope, app_config) {
        var _self = this;
        _self.ios = ionic.Platform.isIOS();
        _self.company = {};
        _self.wmap = window.outerWidth;
        _self.hmap = Math.round((_self.wmap / 16) * 9);
        _self.company = app_config.dataCompany;
    });
//
_controllers.controller('scanCtrl',
    function($scope, $ionicPlatform, $ionicPopup, $cordovaBarcodeScanner) {
        var _self = this;
        _self.card = '';
        _self.scanIT = function() {
            $ionicPlatform.ready(function() {
                $cordovaBarcodeScanner.scan().then(
                    function(result) {
                        if (!result.cancelled) {
                            _self.card = result.text;
                        } else {
                            $ionicPopup.alert({
                                title: 'Action cancelled',
                                template: 'Cancelled by the user'
                            });
                        }
                    },
                    function(error) {
                        alert("Scanning failed: " + error);
                    }
                );
            });
        };
    });
//
_controllers.controller('loginCtrl',
    function($scope, $ionicLoading, $state, $ionicHistory, Auth) {
        var _self = this;
        _self.m_form = {};
        Auth.logOut();
        _self.form_process = function() {
            Auth.logIn(_self.m_form).then(function(result) {
                if (result.status == 1) {
                    $ionicLoading.show({
                        template: result.message,
                        duration: 2000
                    });
                } else {
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $state.go('tabs.home', {}); //second parameter is for $stateParams
                }
            });
        };
    });
//
_controllers.controller('SingInCtrl',
    function($scope, $ionicLoading, $state, Auth) {
        var _self = this;
        _self.m_form = {};
        //
        _self.form_process = function() {
            Auth.singIn(_self.m_form).then(function(response) {
                $ionicLoading.show({
                    template: response.message,
                    duration: 2000
                });
                if (response.status === 0) { //TODO BIEN
                    $state.go('homepage.login', {}); //second parameter is for $stateParams
                }
            });
        };
    });
//
_controllers.controller('rewardCtrl',
    function($scope, $ionicSlideBoxDelegate, $timeout, company_mgr, reward_mgr, app_config, session, Auth) {
        var _self = this;
        _self.company = app_config.dataCompany;
        _self.ios = ionic.Platform.isIOS();
        _self.rewards = {
            'list': [],
            'conf': {}
        };
        _self.rewards.conf = reward_mgr.conf;
        reward_mgr.get_conf(app_config.company);
        reward_mgr.query(app_config.company).then(function(result) {
            var _reverse = reward_mgr.list.slice().reverse(); //REVERSE
            _self.rewards.list = _reverse;
        });
        _self.showlvl = function(lvl) {
            return !isNaN(parseFloat(_self.rewards.conf.points)) && isFinite(_self.rewards.conf.points) ? _self.rewards.conf.points * lvl : 0;
        };
    });

_controllers.controller('AddimgCtrl', ['$scope', 'Upload', function($scope, Upload) {
    var _self = this;
    _self.sizesImg=$scope.sizesImg.width;

    _self.cancel = function() {
        $scope.aux_modal.el.remove();
        $scope.aux_modal.defer.reject(angular.copy(null));
    };
    _self.continue = function() {
        $scope.aux_modal.defer.resolve($scope.aux_modal.img.src);
        $scope.aux_modal.el.remove();

    };
    /*
        $scope.resetModalImg = function() {
            $scope.modalImg.remove();
        };/*
        $scope.upload = function(dataUrl, name) {
            Upload.upload({
                url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
                data: {
                    file: Upload.dataUrltoBlob(dataUrl, name)
                },
            }).then(function(response) {
                $timeout(function() {
                    $scope.result = response.data;
                });
            }, function(response) {
                if (response.status > 0) $scope.errorMsg = response.status +
                    ': ' + response.data;
            }, function(evt) {
                $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
            });
        }*/
}]);
