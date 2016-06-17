_controllers.controller('OffersIndexCtrl',  
	function($scope, $ionicPopup, $ionicListDelegate, $ionicModal, offer_mgr, app_config){
		
		$scope.offer = [];
	
		//
		offer_mgr.query(app_config.company).then(function(result){//LEER LISTADO DE LAS OFERTAS
			$scope.offer	=	result;
		});
		
		
});