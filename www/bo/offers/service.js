_services.factory('offer_mgr',function($q, AjaxService){

	var offer	=	{},
		prms_api	={
			'queryAll':{'method':'listing.offers', 'app_ns': 'reifax.service.reward'},
			'newItem':{'method':'new.offer', 'app_ns': 'reifax.service.reward'},
			'uptItem':{'method':'save.offer', 'app_ns': 'reifax.service.reward'},
			'deleteItem':{'method':'remove.offer', 'iditem':null, 'app_ns': 'reifax.service.reward'},
			'getItem':{'method':'get.offer', 'id_item':null, 'app_ns': 'reifax.service.reward'},
		};
	
	offer.list	=	[];
	
	offer.query	=	function(company){
		 var deferred = $q.defer(),
		 	_qry	=	angular.copy(prms_api.queryAll);
		 
		 if(!company){
				return deferred.promise;
		 }
		 _qry.company	=	company;
		 
		 AjaxService.run_ajax(_qry).then(function(result){
			 offer.list = result.data.data;
			 deferred.resolve(offer.list);
		});
		 
	return deferred.promise; 
	};
	//
	offer.addItem	=	function(item, has_image){
		var _qry	=	angular.copy(prms_api.newItem),
		 	deferred = $q.defer();
		
		 angular.extend(_qry, item);
		 
		if(has_image){//SE CAMBIO LA IMAGEN 
			deferred	=	AjaxService.send_form_1pic(_qry, item.data_img);
		}else{
			deferred	=	AjaxService.run_ajax(_qry);
		}
		
		deferred.then(function(result){
			var _data	=	( result.response  )? JSON.parse(result.response):result.data;
			item.post_id	=	_data.newID;
			offer.list.unshift(item);
		})
		
	};
	//
	offer.getItem	=	function(el_item){
		var deferred = $q.defer();
		
		prms_api.getItem.id_item	=	el_item;
		AjaxService.run_ajax(prms_api.getItem).then(function(result){
			deferred.resolve(result.data.data);
		});
		return deferred.promise;
	};
	//
	offer.uptItem	=	function(item, has_image){
		 var _qry	=	angular.copy(prms_api.uptItem);
		 
		 angular.extend(_qry, item);

		if(has_image){//SE CAMBIO LA IMAGEN 
			AjaxService.send_form_1pic(_qry, item.data_img);
		}else{
			AjaxService.run_ajax(_qry);
		}

	};
	//
	offer.remove_item	=	function(el_item){
		
		prms_api.deleteItem.iditem	=	el_item.post_id;
		AjaxService.run_ajax(prms_api.deleteItem).then(function(result){
			offer.list.splice(offer.list.indexOf(el_item), 1);
		});
	};
	
return offer;
	
});