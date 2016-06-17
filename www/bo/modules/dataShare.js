_services.factory('modules_mgr',function($q, AjaxService){

	var modules	=	{},
		prms_api	={
			'queryAll':{'method':'get.modules', 'company':null, 'app_ns': 'reifax.service.reward'},
			'uptItem':{'method':'set.module', 'app_ns': 'reifax.service.reward'},
			'setOrder':{'method':'set.module.order', 'items':null, 'app_ns': 'reifax.service.reward'},
		};
	
	modules.list	=	[];
	
	var look_up	=	function(source, field, search){
		for (var i = 0, len = source.length; i < len; i++) {
			if (source[i][field] == search) return source[i];
		}
	};
	
	modules.query	=	function(company){
		 var deferred = $q.defer(),
		 	_qry	=	angular.copy(prms_api.queryAll);

		 if(!company){
				return deferred.promise;
		 }

		 _qry.company	=	company;
		 
		 AjaxService.run_ajax(_qry).then(function(result){
			 modules.list	=	result.data.data;
			 deferred.resolve(modules.list);
		});
		 
	return deferred.promise; 
	};
	//
	modules.upt_item	=	function(item){
		 var _qry	=	angular.copy(prms_api.uptItem);
		 
		 angular.extend(_qry, item);
		 AjaxService.run_ajax(_qry);
	};
	//
	modules.order	=	function(items){
		 var _qry	=	angular.copy(prms_api.setOrder);

		 _qry['items']	=	items;

		 AjaxService.run_ajax(_qry);
	};
	
return modules;
	
});