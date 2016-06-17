_services.factory('Auth', function($q, AjaxService, app_config, session){
	var api_call = {
			'logIn':{'method':'session.login', 'email':null, 'password':null, 'app_ns': 'reifax.service.reward'},
			'singIn':{'method':'session.register', 'email':null, 'password':null, 'app_ns': 'reifax.service.reward'},
	}
	return {
		logIn:function(credentials){
			var _defer = $q.defer();
				api_call.logIn.email = credentials.username;
				api_call.logIn.password = credentials.password;
			
			AjaxService.run_ajax( api_call.logIn ).then(function(result){
				if(result.data.status==0){
					session.setSession(result.data);
				}
				_defer.resolve(result.data);
			});
		return _defer.promise;
		},
		singIn:function(data){
			 var deferred = $q.defer();
			 
			 angular.extend(api_call.singIn, data);
		 	AjaxService.run_ajax(api_call.singIn).then(function(result){
		 		deferred.resolve(result.data);
		 	});
		return deferred.promise;
		},
		logOut:function(){
			session.destroy();
		},
		isLogued:function(){
			return (session.getSession().id>0)?true:false; 
		},
		authorize:function(roles){
			var _user = session.getSession(),
				_uRole = _user.role?_user.role:'',
				exists = (roles)?roles.indexOf(_uRole)!=-1:true;

			return exists;
		},
		getRoleById:function(id){
			var _role = null;
			angular.forEach(app_config.ROLES, function(value, index){
				if(value.role_id==id){
					_role = value;
					return false;
				}
			});
			return _role;
		},
		getRoleByName:function(name){
			var _role = null;
			angular.forEach(app_config.ROLES, function(value, index){
				if(value.role_name==name){
					_role = value;
					return false;
				}
			});
			return _role;
		}
	}		
});