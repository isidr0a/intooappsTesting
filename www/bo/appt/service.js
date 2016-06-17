_services.factory('appt_cnf_mgr',function($q, AjaxService){

	var appt_cnf	=	{},
		prms_api	={
			'queryAll':{'method':'get.appt.setup', 'company':null, 'app_ns': 'reifax.service.reward'},
			'update':{'method':'set.appt.setup', 'app_ns': 'reifax.service.reward'},
			'servers':{'method':'listing.servers', 'company':null, 'app_ns': 'reifax.service.reward'},
			'serverAdd':{'method':'new.server', 'app_ns': 'reifax.service.reward'},
			'serverDel':{'method':'remove.server', 'company':null, 'server':null, 'app_ns': 'reifax.service.reward'},
			'serverUpdt':{'method':'update.server', 'app_ns': 'reifax.service.reward'},
			'wtQuery':{'method':'query.wt', 'app_ns': 'reifax.service.reward'},
			'wtAdd':{'method':'new.wt', 'app_ns': 'reifax.service.reward'},
			'wtDel':{'method':'remove.wt', 'app_ns': 'reifax.service.reward'},
		};
	
	appt_cnf.data	=	{};
	
	appt_cnf.query	=	function(ci){
		 var deferred = $q.defer(),
		 	_qry	=	angular.copy(prms_api.queryAll);

		 if(!ci){
				return false;
		 }

		 _qry.company	=	ci;
		 
		 AjaxService.run_ajax(_qry).then(function(result){
			 if(result.data.status==0 && result.data.data.company){
				 appt_cnf.data	=	result.data.data;
			 }
			 deferred.resolve(appt_cnf.data);
		});
		 
	return deferred.promise; 
	};
	//
	appt_cnf.upt_data	=	function(data){
		var _qry	=	angular.copy(prms_api.update);
		
		angular.extend(_qry, data);
		AjaxService.run_ajax(_qry);
	};
	//
	appt_cnf.add_server	=	function(data, has_image){
		var _promise,
			deferred = $q.defer(),
			_qry	=	angular.copy(prms_api.serverAdd);
		
		angular.extend(_qry, data);
		if(has_image){ 
			_promise = AjaxService.send_form_1pic(_qry, _qry.data_img);
		}else{ 
			_promise = AjaxService.run_ajax(_qry);
		}
		_promise.then(function(result){
			var _data	=	( result.response  )? JSON.parse(result.response):result.data;
			deferred.resolve(_data);
		});
	return deferred.promise;
	};
	//
	appt_cnf.del_server	=	function(srv_id, company){
		var _qry	=	angular.copy(prms_api.serverDel);

		 if(!srv_id && !company){
				return false;
		 }
		_qry.server	=	srv_id; 
		_qry.company	=	company;

		AjaxService.run_ajax(_qry);
	};
	//
	appt_cnf.get_servers	=	function(ci){
		var deferred = $q.defer(),
		 	_qry	=	angular.copy(prms_api.servers);

		 if(!ci){
				return false;
		 }
		 _qry.company	=	ci;
		 AjaxService.run_ajax(_qry).then(function(result){
			 deferred.resolve(result.data.data);
		});
		 
	return deferred.promise; 
	};

	//
			appt_cnf.listWt	=	function(company){
				 var _qry	=	angular.copy(prms_api.wtQuery);

				 if(!company){
						return false;
				 }
				 _qry.company	=	company;
				 
			return AjaxService.run_ajax(_qry);
 
			};
			//
	appt_cnf.add_wt	=	function(data){
		var _qry	=	angular.copy(prms_api.wtAdd);
		
		angular.extend(_qry, data);
	return AjaxService.run_ajax(_qry);
	};
	//
	appt_cnf.del_wt	=	function(time_id, company){
		var _qry	=	angular.copy(prms_api.wtDel);

		 if(!time_id && !company){
				return false;
		 }
		_qry.item_id	=	time_id; 
		_qry.company	=	company;
		AjaxService.run_ajax(_qry);
	};

		
	
return appt_cnf;
	
});