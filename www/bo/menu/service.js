_services.factory('category_mgr',['$q','AjaxService',function($q, AjaxService){
	var categories	=	{},
		prms_api	={
				'queryAll':{'method':'list.main.categories','app_ns': 'reifax.service.reward'},
				'queryAllFull':{'method':'list.main.categoriesFull','app_ns': 'reifax.service.reward'},
				'deleteItem':{'method':'remove.item','iditem':null,'app_ns': 'reifax.service.reward'},
				'getItem':{'method':'read.parent','item_id': null,'app_ns': 'reifax.service.reward'},
				'addItem':{'method':'add.parentitem','app_ns': 'reifax.service.reward'},
				'uptItem':{'method':'upt.parentitem','app_ns': 'reifax.service.reward'}
		};
	categories.list	=	[];
	
	var look_up	=	function(source, field, search){
		for (var i = 0, len = source.length; i < len; i++) {
			if (source[i][field] == search) return source[i];
		}
	};
	
	categories.query	=	function(company){
		 var deferred = $q.defer(),
		 	_qry	=	angular.copy(prms_api.queryAll);
		 
		 if(!company){
				return deferred.promise;
		 }
		 _qry.company	=	company;
		 
		 AjaxService.run_ajax(_qry).then(function(result){
			categories.list	=	angular.copy(result.data.data);
			deferred.resolve(categories.list);
		});
		
		return deferred.promise;
	};
	
	categories.Fullquery = function(company){
		 var deferred = $q.defer(),
		  _qry = angular.copy(prms_api.queryAllFull);
		 
		 if(!company){
		  return deferred.promise;
		 }
		 _qry.company = company;
		 
		 AjaxService.run_ajax(_qry).then(function(result){
		 categories.list = angular.copy(result.data.data);
		 deferred.resolve(categories.list);
		});
		
		return deferred.promise;
	};
			
	categories.add_item		=	function(item, image_touched){
		var _promise;
		
		angular.extend(prms_api.addItem, item);
		
		if(image_touched){//SE CAMBIO LA IMAGEN 
			_promise = AjaxService.send_form_1pic(prms_api.addItem, item.data_img);
		}else{
			_promise = AjaxService.run_ajax(prms_api.addItem);
		}
		_promise.then(function(result){
			var _data	=	( result.response  )? JSON.parse(result.response):result.data;
			categories.list.push(_data.data);
		});
	};

	categories.upt_item	=	function(item, image_touched){
		var _promise;

		angular.extend(prms_api.uptItem, item);
		
		if(image_touched){//SE CAMBIO LA IMAGEN 
			_promise = AjaxService.send_form_1pic(prms_api.uptItem, item.data_img);
		}else{
			_promise = AjaxService.run_ajax(prms_api.uptItem);
		}
		_promise.then(function(result){
			var _data	=	( result.response  )? JSON.parse(result.response):result.data;
			categories.list[ item._idx ].item_name	=	_data.data.item_name;
			categories.list[ item._idx ].data_img	=	_data.data.data_img;
			categories.list[ item._idx ].childs		=	_data.data.childs;
		});
	};
	
	categories.get_item	=	function(el_item){
		var deferred = $q.defer();
		
		prms_api.getItem.item_id	=	el_item.item_id;
		AjaxService.run_ajax(prms_api.getItem).then(function(result){
			deferred.resolve(result.data.data);
		});
		return deferred.promise;
	};
	categories.remove_item	=	function(el_item){
		var _self	=	this;
		
		prms_api.deleteItem.iditem	=	el_item.item_id;
		AjaxService.run_ajax(prms_api.deleteItem).then(function(result){
			_self.list.splice(_self.list.indexOf(el_item), 1);
		});
	};
	
	categories.index_Of	=	function(iditem){
		return look_up( categories.list, 'item_id', iditem );
	}

	categories.index_OfSubitems	=	function(iditem, target){
		return look_up( target, 'idSubi', iditem );
	}
	
return categories;
	
}]);
/*
 * 
 */
_services.factory('cooking_mgr',function($q, AjaxService){

	var cooking	=	{},
		prms_api	={
				'queryAll':{'method':'list.cooking', 'item_parent':null, 'app_ns': 'reifax.service.reward'},
				'save_it':{'method':'save.cooking', 'app_ns': 'reifax.service.reward'},
				'getItem':{'method':'read.cooking', 'id_item':null, 'app_ns': 'reifax.service.reward'},
				'delItem':{'method':'remove.cooking', 'id_item':null, 'app_ns': 'reifax.service.reward'},
		};
	
	cooking.list	=	[];
	
	var look_up	=	function(source, field, search){
		for (var i = 0, len = source.length; i < len; i++) {
			if (source[i][field] == search) return source[i];
		}
	};
	
	cooking.query	=	function(from_id){
		 var deferred = $q.defer(),
		 	_qry	=	angular.copy(prms_api.queryAll);

		 if(!from_id){
				return false;
		 }

		 _qry.item_parent	=	from_id;
		 
		 AjaxService.run_ajax(_qry).then(function(result){
			 cooking.list	=	result.data.data;
			 deferred.resolve(cooking.list);
		});
		 
	return deferred.promise;
		 
	};
	//
	cooking.add_item	=	function(item){
		angular.extend(prms_api.save_it, item);
		
		AjaxService.run_ajax(prms_api.save_it).then(function(result){
			if(item._idx!=null){
			   cooking.list[ item._idx ]	=	result.data.data;//ACTUALIZA LISTA
			}else{
			   cooking.list.unshift(result.data.data);///INSERTA AL INICIO COMO EL MAS RECIENTE
			}
		});
	};
	//
	cooking.get_item	=	function(el_item){
		var deferred = $q.defer();
		
		prms_api.getItem.id_item	=	el_item.item_id;
		AjaxService.run_ajax(prms_api.getItem).then(function(result){
			deferred.resolve(result.data.data);
		});
		return deferred.promise;
	};
	//
	cooking.remove_item	=	function(el_item){
		
		 var deferred = $q.defer();
		
		prms_api.delItem.id_item	=	el_item;
		AjaxService.run_ajax(prms_api.delItem).then(function(result){
			if(result.data.status==0){
				for(var i = cooking.list.length - 1; i >= 0; i--){
				    if(cooking.list[i].item_id == el_item){
				    	cooking.list.splice(i,1);
				    	break;
				    }
				}
				 deferred.resolve();
			}	
		});
		
	return deferred.promise;
	};
	//
	//
	cooking.index_Of	=	function(field,value){
		return look_up( cooking.list, field, value );
	}
	
return cooking;
	
});

_services.factory('ShoppingCartService',function($q, AjaxService){
	
	var shoppingCart = [];
	(function(){
		if (window.localStorage.getItem('cartItems')!=null)
			shoppingCart=JSON.parse(window.localStorage['cartItems']);
	})();
	
	function _escribir(){
		window.localStorage['cartItems']=JSON.stringify(shoppingCart);
	}
	
	var service = {
		cont : function(){
			return (shoppingCart.length);
		},
		
		// The interface you want to expose
		add : function (item) {	
			shoppingCart.push(item);
			_escribir();
				
		},
		
		listCart:function(){
		     return shoppingCart;
		},
		
		
		update: function () {},
		
		deleteCart: function (item) {
			
			shoppingCart.splice(item, 1); 
			_escribir();
			
			
		},
		
	 };

  return service;


});