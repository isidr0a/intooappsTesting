_controllers.controller('UsrsCtrl',  
	function($scope, users_mgr, session, app_config, Auth){
		var _self	=	this,
			_user = session.getSession(),
			_role = Auth.getRoleByName(_user.role),
			_company = window.localStorage['BO_company'] || false;
		
		//
		_self.list		= [];
		//
		users_mgr.query(app_config.companyID, _role.role_id).then(function(){//
			_self.list	=	users_mgr.list;
		});
		
		_self.print_rolename = function(roleid){
			return Auth.getRoleById(roleid).role_name;
		}
});