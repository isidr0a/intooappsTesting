_services.factory('reward_mgr',function($q, AjaxService){

	var reward	=	{},
		prms_api	={
			'queryAll':{'method':'listing.reward', 'app_ns': 'reifax.service.reward'},
			'save_it':{'method':'new.reward', 'app_ns': 'reifax.service.reward'},
			'updateIt':{'method':'updt.reward', 'app_ns': 'reifax.service.reward'},
			'deleteIt':{'method':'remove.reward', 'iditem':null, 'app_ns': 'reifax.service.reward'},
			'uptConf':{'method':'set.reward', 'app_ns': 'reifax.service.reward'},
			'getConf':{'method':'get.reward', 'app_ns': 'reifax.service.reward'},
			'setOrder':{'method':'set.reward.order', 'items':null, 'app_ns': 'reifax.service.reward'},
		};
	
	reward.list	=	[];
	
	reward.conf	=	{'company':null, 'points': 5, '_icon':'ion-star'};
	
	//
	reward.get_conf	=	function(company){
		 var _qry	=	angular.copy(prms_api.getConf);
		 
		 if(!company){
				return false;
		 }

		 _qry.company	=	company;
		 
		 AjaxService.run_ajax(_qry).then(function(result){
				reward.conf.points	=	result.data.data.points;
				reward.conf._icon	=	result.data.data._icon;
				reward.conf.company	=	result.data.data.company;
		});
	};
	//
	reward.upt_conf	=	function(data){
		 var _qry	=	angular.copy(prms_api.uptConf);
		 
		 angular.extend(_qry, data);
		 AjaxService.run_ajax(_qry);
	};
	
	
	//
	reward.add_item	=	function(item, has_image){
		var _qry	=	angular.copy(prms_api.save_it),
			deferred = $q.defer();
		
		angular.extend(_qry, item);
		
		if(has_image){//SE CAMBIO LA IMAGEN 
			deferred = AjaxService.send_form_1pic(_qry, item.data_img);
		}else{
			deferred = AjaxService.run_ajax(_qry);
		}
		deferred.then(function(result){
			var _data	=	( result.response  )? JSON.parse(result.response):result.data;
			item.id	=	_data.newID;
			reward.list.push(item);
		})
	};
	//
	reward.updt_item	=	function(item, has_image){
		var _qry	=	angular.copy(prms_api.updateIt);
		
		angular.extend(_qry, item);
		
		if(has_image){//SE CAMBIO LA IMAGEN 
			AjaxService.send_form_1pic(_qry, item.data_img);
		}else{
			AjaxService.run_ajax(_qry);
		}

	};
	//
	reward.query	=	function(company){
		 var deferred = $q.defer(),
		 	_qry	=	angular.copy(prms_api.queryAll);

		 if(!company){
				return deferred.promise;
		 }

		 _qry.company	=	company;
		 
		 AjaxService.run_ajax(_qry).then(function(result){
			 reward.list	=	result.data.data;
			 deferred.resolve();
		});
		 
	return deferred.promise; 
	};
	//
	reward.remove_item	=	function(el_item){
		var _self	=	this;

		prms_api.deleteIt.iditem	=	el_item.id;
		AjaxService.run_ajax(prms_api.deleteIt).then(function(result){
			_self.list.splice(_self.list.indexOf(el_item), 1);
		});
	};
	//
	reward.order	=	function(items){
		 var _qry	=	angular.copy(prms_api.setOrder);

		 _qry['items']	=	items;
		 _qry.company = reward.conf.company;

		 AjaxService.run_ajax(_qry);
	};
	
return reward;
	
});