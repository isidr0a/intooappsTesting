_services.factory('users_mgr',function($q, AjaxService){

	var app_usrs =	{},
		prms_api ={
			'queryAll':{'method':'listing.user', 'app_ns': 'reifax.service.reward'},
		};
	
	app_usrs.list = [];
	
	app_usrs.query	=	function(company, _role){
		 var deferred = $q.defer(),
		 	_qry	=	angular.copy(prms_api.queryAll);

		 if(company){
			 _qry.company	=	company;
			 _qry.role = _role;
		 }
		 
		 AjaxService.run_ajax(_qry).then(function(result){
			 if(result.data.status==0 && result.data.users.length>0) app_usrs.list = result.data.users;
			 deferred.resolve(app_usrs.list);
		});
		 
	return deferred.promise; 
	};
	//
return app_usrs;
	
});