_controllers.controller('ApptIndexCtrl', 
	function($scope, $ionicPopup, $ionicListDelegate, ctrlPickImage, appt_cnf_mgr, app_config){
		var  _self =	this,
		     _company = window.localStorage['BO_company'] || false;
			 
			$scope.appt = [];
		
		appt_cnf_mgr.get_servers(app_config.company).then(function(result){
			$scope.appt	=	result;
		});
		
		
});