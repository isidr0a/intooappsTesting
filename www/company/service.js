_services.factory('company_mgr', function($q, AjaxService) {
    var company = {},
        prms_api = {
            'queryAll': {
                'method': 'get.company',
                'app_ns': 'reifax.service.reward'
            },
            'add': {
                'method': 'add.company',
                'app_ns': 'reifax.service.reward'
            },
            'deactivate': {
                'method': 'deactivate.company',
                'company': null,
                'app_ns': 'reifax.service.reward'
            },
            'update': {
                'method': 'set.company',
                'app_ns': 'reifax.service.reward'
            },
            'clone': {
                'method': 'clone.company',
                'app_ns': 'reifax.service.reward'
            },
            'carrousel': {
                'method': 'carrousel',
                'carrousel': null,
                'app_ns': 'reifax.service.reward'
            },
            'carrouselRemove': {
                'method': 'remove.carrousel',
                'app_ns': 'reifax.service.reward'
            },
            'batch_imgs': {
                'method': 'save.photo',
                'app_ns': 'reifax.service.reward'
            },
        };
    company.list = [];
    company.current = {};
    company.my = function(id) {
        var _qry = angular.copy(prms_api.queryAll);
        _qry.newID = id;
        return $q.when(AjaxService.run_ajax(_qry))
            .then(function(result) {
                if (result.data.success) {
                    company.current = result.data.data;
                    company.current.carrousel.sort(function(a, b) { //ORDENAR ASC
                        return a.order - b.order;
                    });
                }
            });
    };
    company.query = function(ci) {
        var deferred = $q.defer(),
            _qry = angular.copy(prms_api.queryAll);
        if (ci) {
            _qry.ID = ci;
        }
        AjaxService.run_ajax(_qry).then(function(result) {
            if (result.data.success && result.data.data.length > 0) {
                company.list = result.data.data;
            }
            deferred.resolve(company.list);
        });
        return deferred.promise;
    };
    //
    company.carrouselRemove = function(company, item) {
        var _qry = angular.copy(prms_api.carrouselRemove);
        _qry.company = company;
        _qry.banner = item;
        return AjaxService.run_ajax(_qry);
    };
    //
    company.Carrousel = function(images) {
        var up_imgs = {
            'api': prms_api.batch_imgs,
            'images': images
        };
        return AjaxService.upload_bunch_images(up_imgs).then(function(result) {
            var _qry = angular.copy(prms_api.carrousel),
                data = [];
            if (result.length > 0 || result.response) { //imagenes subidas?
                result = result.length > 0 ? result : [result]; //subio mas de 1 o solo 1
                return result;
            }
        });
    };
    //
    company.upt_data = function(data) {
		var _qry = angular.copy(prms_api.update);
		//SUBIR FORMULARIO
		angular.extend(_qry, data);
		return AjaxService.run_ajax(_qry);
    };
    //
    company.deactivate = function(item) {
        var _qry = angular.copy(prms_api.deactivate);
        _qry.company = item.idComp;
        AjaxService.run_ajax(_qry).then(function(result) {
            company.list.splice(company.list.indexOf(item), 1);
        });
    };
    //
    company.cloneCia = function(item, times) {
        var _qry = angular.copy(prms_api.clone);

        item.compName += ' ' + times;
        _qry.company = item.idComp;
        _qry.cia_name = item.compName;

        return AjaxService.run_ajax(_qry).then(function(result) {
            if (result.data.status === 0) {
                item.isnew = true;
                item.idComp = result.data.ID;
                company.list.splice(0, 0, item);
            }
        });

    };

    return company;

});
