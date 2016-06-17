_controllers.controller('ModulesCtrl',  
	function($scope, $ionicActionSheet, $ionicModal, $stateParams, modules_mgr){
		var _self	=	this,
			_company = window.localStorage['BO_company'] || false;
		
		$scope._item	=	{};
		_self.modList = [];
		_self.reorder	=	false;
		
		modules_mgr.query(_company).then(function(result){//
			_self.modList	=	result;
		});
		
		_self.moveItem = function(item, fromIndex, toIndex) {
			_self.modList.splice(fromIndex, 1);
			_self.modList.splice(toIndex, 0, item);
		};
		
		_self.done_RO = function() {
			var new_order	=	[];
			
			angular.forEach(_self.modList, function(value, key) {
				  this.push({'id': value.id, 'order': key });
			}, new_order);
			
			modules_mgr.order(new_order);

			_self.reorder=!_self.reorder;
		};
		
		 // Triggered on a button click, or some other target
		_self.show_AS = function(item) {

		   // Show the action sheet
		   $ionicActionSheet.show({
		     buttons: [
		       { text: '<b>Re-order</b>' },
		       { text: 'Edit' }
		     ],
		     titleText: 'Modify menu',
		     cancelText: 'Cancel',
		     cancel: function() {
		          // add cancel code..
		        },
		     buttonClicked: function(index) {
		    	 if(index==0){
		    		 _self.reorder=!_self.reorder;
		    	 }
		    	 if(index==1){
		    		 $scope._item	=	item;
		    		 $scope.openModal(item);
		    	 }
		       return true;
		     }
		   });
		}
		
		/*
		 *MODAL 
		*/
		$scope.modal = {};
		    
		$scope.openModal = function(item){
			$ionicModal.fromTemplateUrl('bo/modules/form.html', {scope:$scope, animation: 'slide-in-up'})
			.then(function(modal) {
			    $scope.modal = modal;
			    $scope.modal.show();
			});
		}
			  
		$scope.closeModal = function(){
			$scope.modal.remove();
			$scope._item	=	{};
		}
		
});
/*
 * 
 */
_controllers.controller('moduleFormCtrl', 
	function($scope, modules_mgr){
		var _self	=	this;

		_self.m_form	=	$scope._item;
		_self.win_title	=	_self.m_form._title;
		
		//
		_self.form_process	=	function(){
			modules_mgr.upt_item( _self.m_form );
			$scope.closeModal();
		}
		
	});