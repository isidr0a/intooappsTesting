_controllers.controller('CategoriesIndexCtrl',
    function($scope, $ionicModal, $ionicPopup, $ionicListDelegate, category_mgr) {
        var _company = window.localStorage['BO_company'] || false;

        /*
         * LISTING
         */
        $scope.data = {
            showDelete: true
        };
        $scope.categories = [];
        /*
         * FORMULARIO
         */
        $scope.form_item = null;

        category_mgr.query(_company).then(function(result) { //LEER LISTADO DE CATEGORIAS
            $scope.categories = result;
        });

        $scope.edit_it = function(el_item, idx) { //ABRIR FORM PARA EDITAR UNA CATEGORIA

            category_mgr.get_item(el_item).then(function(result) {
                $scope.form_item = angular.copy(result);
                $scope.form_item._idx = idx; ///para actualizalo en la lista
                $scope.openModal();
            });
            $ionicListDelegate.closeOptionButtons();
        };

        $scope.showConfirmDelete = function(el_item) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Remove category',
                template: 'Are you sure you want to remove "' + el_item.item_name + '" Category?'
            }).then(function(remove) {
                if (remove) {
                    category_mgr.remove_item(el_item);
                }
                $ionicListDelegate.closeOptionButtons();
            });
        };

        /*
         *MODAL
         */
        $scope.modal = {};

        $scope.openModal = function() {
            if (_company) { //SIN COMPANIA NO SE HACE NADA
                $ionicModal.fromTemplateUrl('bo/menu/form.html', {
                        scope: $scope,
                        animation: 'slide-in-up'
                    })
                    .then(function(modal) {
                        $scope.modal = modal;
                        $scope.modal.show();
                    });
            }
        }

        $scope.closeModal = function() {
            $scope.resetModal();
            $scope.modal.remove();
        }

        $scope.resetModal = function() {
            $scope.form_item = angular.copy(null);
        };



    });
/*
 *
 *
 */



_controllers.controller('CategoryFormCtrl',

	function($scope, ctrlPickImagecrop, category_mgr,$ionicPopup){
		var _self	=	this,
			_company = window.localStorage['BO_company'],
			image_touched	=	false;

		_self.m_form	=	{};
		_self.m_form.company = _company;
        _self.m_form.list_sizes =	[];
        _self.m_form.list_subitems =	[];

		if($scope.form_item!=null){
			_self.m_form	=	$scope.form_item;
		}

        _self.new_size_name	=	'';
        _self.new_subitem	=	'';
		_self.win_title	=	'';
		//
		_self.getPhoto = function(max_images) {
			var _self	=	this;

			ctrlPickImagecrop.sel_Image($scope, 140, ((typeof _self.m_form.data_img === 'undefined' || _self.m_form.data_img === null )? true : false )).then(function(imageURI) {
				_self.m_form.data_img=imageURI;
				image_touched	=	true;
			});
		};

        //
        _self.add_size = function() {
            if (_self.new_size_name.trim().length > 0) {
                var _newItem = {
                    'sizeid': null,
                    'sizename': _self.new_size_name
                };
                _self.m_form.list_sizes.push(_newItem);
                _self.new_size_name = ''
            }
        };

        //
        _self.add_subitem = function() {
            if (_self.new_subitem.trim().length > 0) {
                var _newItem = {
                    'idSubi': null,
                    'subiName': _self.new_subitem
                };
                _self.m_form.list_subitems.push(_newItem);
                _self.new_subitem = ''
            }
        };


		//
		$scope.data={};
		_self.edit_size = function(item){
			$scope.data.name = item.sizename;
			
			$ionicPopup.show({
			template: '<input type="text" ng-value="item.sizename" ng-model="data.name">',
			title: 'Edit',
			subTitle: item.sizename,
			scope: $scope,
			buttons: [
			  { text: 'Cancel' },
			  {
				text: '<b>Save</b>',
				type: 'button-positive',
				onTap: function(e) {
					if (!$scope.data.name) {
						//don't allow the user to close unless he enters wifi password
						e.preventDefault();
					} else {
						item.sizename = $scope.data.name;
						
						return $scope.data.name;
					
						// _self.m_form.list_sizes =	[];
						/*console.log($scope.data.name);
						console.log(item.sizeid);
						if(item.sizeid){
							var _editItem = {
							'sizeid': item.sizeid,
							'sizename': $scope.data.name
							};
							_self.m_form.list_sizes.push(_editItem);
						}
						return $scope.data.name;*/
						
					}
				}
			  }
			]
		  });
		};
		//
		$scope.datasub={};
		$scope.edit_subitem_name='';
		_self.edit_subitem = function(item){
			console.log(item);
			//$scope.edit_subitem_name = item.subiName;
			$scope.datasub.name = item.subiName;
			
			$ionicPopup.show({
			template: '<input type="text" ng-value="item.subiName" ng-model="datasub.name">',
			title: 'Edit',
			subTitle: item.subiName,
			scope: $scope,
			buttons: [
			  { text: 'Cancel' },
			  {
				text: '<b>Save</b>',
				type: 'button-positive',
				onTap: function(e) {
					if (!$scope.datasub.name) {
						//don't allow the user to close unless he enters wifi password
						e.preventDefault();
						console.log(e.preventDefault());
					}else {
						item.subiName = $scope.datasub.name;
						
						return $scope.datasub.name;
					}
				}
			  }
			]
		  });
		};
		//
		_self.remove_size = function(item, index) {
			$ionicPopup.confirm({
				title: 'Delete Item',
				template: 'Are you sure you want to remove this item? <br/>THIS CANNOT BE UNDONE'
			}).then(function(res) {
				if(res) {
				   var _list	=	_self.m_form.list_sizes;
					_list.splice( _list.indexOf(item), 1 );
				}
		   });

		};
        //
		_self.remove_subitem = function(item, index) {

			$ionicPopup.confirm({
				title: 'Delete SubItem',
				template: 'Are you sure you want to remove this Subitem? <br/>THIS CANNOT BE UNDONE'
			}).then(function(res) {
				if(res) {
				   var _list	=	_self.m_form.list_subitems;
					_list.splice( _list.indexOf(item), 1 );
				}
		   });

		};
		//
		_self.form_process	=	function(){
			var _promise,
				_idx_updt	=	(_self.m_form.item_id)?_self.m_form._idx:null;

			if(image_touched){
				/*
				 * Cordova FileTransfer no permite campos de array
				 * hack para enviar la lista de tama#os como array junto a la imagen
				 */
				for(var i=0, len=_self.m_form.list_sizes.length; i<len; i++){//crear nuevo array
					_self.m_form[ 'list_sizes['+i+']' ]	=	_self.m_form.list_sizes[i];
				}
				delete _self.m_form.list_sizes;//no sera necesario, borrar

                for(var i=0, len=_self.m_form.list_subitems.length; i<len; i++){//crear nuevo array
					_self.m_form[ 'list_subitems['+i+']' ]	=	_self.m_form.list_subitems[i];
				}
				delete _self.m_form.list_subitems;//no sera necesario, borrar
			}

			if(_idx_updt!=null){
				category_mgr.upt_item(_self.m_form, image_touched);
			}else{
				category_mgr.add_item(_self.m_form, image_touched);
			}
			$scope.closeModal();
		}
});



/*
 *
 */
_controllers.controller('ItemsListingCtrl',

		function($scope, $stateParams, $ionicModal, $ionicPopup, $ionicListDelegate, AjaxService, ctrlPickImage, category_mgr) {

			//$scope.title	=	$stateParams.item_name;
			$scope.title = category_mgr.index_Of($stateParams.itemId).item_name;
			$scope.items	=	[];
			$scope.subitems =   [];

			$scope.default_form={
				'item_name':'',
				'item_description':'',
				'price':0,
				'data_img':null,
				'childs':[],
				'company': window.localStorage['BO_company'] || null,
				'parentid':	$stateParams.itemId,
				'method':null,
				'app_ns': 'reifax.service.reward'
			};
			$scope.form_item	=	{};
			$scope.sizes_prices	=	[];
			$scope.subitem_item	=	[];
			$scope.subitem_items	=	[];
			angular.copy($scope.default_form, $scope.form_item);

			var _prms	={
				'method':'list.items',
		  		'item_parent': $stateParams.itemId,
		  		'app_ns': 'reifax.service.reward'
		  	};
			AjaxService.run_ajax(_prms).then(function(result){
			  $scope.items	=	result.data.data;
			});



			//console.log($scope.subitem_item);

			$scope.edit_it=function(el_item, idx){
				var _prms	={
					'method':'read.item',
					'item_id': el_item.item_id,
					'app_ns': 'reifax.service.reward'
				};
				AjaxService.run_ajax(_prms).then(function(result){
				   $scope.form_item	=	result.data.data;
				   $scope.form_item._idx	=	idx;
				   $scope.sizes_prices	=	result.data.data.childs;
				   $scope.openModal();
				});

				$ionicListDelegate.closeOptionButtons();

			};
			   // confirm dialog Delete
			$scope.showConfirmDelete = function(el_item) {

				     var confirmPopup = $ionicPopup.confirm({
				       title: 'Remove category',
				       template: 'Are you sure you want to remove "'+ el_item.item_name +'" Category?'
				     }).then(function(remove) {
				       if(remove) {

							var _prms	={	'method':'remove.item',
											'iditem':el_item.item_id,
											'app_ns': 'reifax.service.reward'};

							AjaxService.run_ajax(_prms).then(function(result){
								$scope.items.splice($scope.items.indexOf(el_item), 1);
								category_mgr.index_Of( $stateParams.itemId ).item_count--;
							});

				       }
				       $ionicListDelegate.closeOptionButtons();

				     });
			};

			/*
			 *MODAL
			*/
			$scope.modal = {};
			$ionicModal.fromTemplateUrl('bo/menu/form_item.html', {
			      scope: $scope,
			      animation: 'slide-in-up'
			    }).then(function(modal) {
			      $scope.modal = modal;
			    });

			  $scope.openModal = function(action){
				  if(action=='new'){///LEER LOS TAMANOS DISPONIBLES PARA UN NUEVO ITEM
					  var _prms	={
							  'method':'list.category.sizes',
							  'item_parent': $stateParams.itemId,
							  'app_ns': 'reifax.service.reward'
					  };
					  AjaxService.run_ajax(_prms).then(function(result){
						  $scope.sizes_prices	=	result.data.data;
					  });

					  /*jesi*/
						var _prms2	=	{
							'method':'list.subitems',
							'item_parent': $stateParams.itemId,
							's': 'bi',
							'app_ns': 'reifax.service.reward'
						};
						AjaxService.run_ajax(_prms2).then(function(result){
							$scope.form_item.subitem = result.data.data;
						});

				  }
				  $scope.modal.show();
			  }

			  $scope.closeModal = function(){
				  $scope.resetModal();
				  $scope.modal.hide();
			  }

			  $scope.$on('$destroy', function() {
			        $scope.modal.remove();
			    });

			  $scope.resetModal = function(){
				  angular.copy($scope.default_form, $scope.form_item);
				  $scope.title	=	$stateParams.item_name;
				  $scope.sizes_prices	=	[];
			  };
			/*
			 *FORM FUNCTIONS
			*/
			$scope.getPhoto = function(max_images) {
				var _self	=	this;

				ctrlPickImagecrop.sel_Image($scope, 140,  ((typeof $scope.form_item.data_img === 'undefined' || $scope.form_item.data_img === null )? true : false )).then(function(imageURI) {
					$scope.form_item.data_img=imageURI;
					_self.frm_edit_item.data_img.$setDirty();
				});
			};

			$scope.setOptExt = function(subitem){
				console.log(subitem);
				if(subitem.option){
					$scope.subitem_item.push(subitem);
				}else{
					$scope.subitem_item.splice($scope.subitem_item.indexOf(subitem),1);
				}
			}

			$scope.checkItem = function (id) {
				//console.log(id);
				//return $scope.condiments[id-1].checked = true;
			};

			$scope.setActInac = function(subitem){
				console.log(subitem);
				if(subitem.active){
					$scope.subitem_items.push(subitem)
				}else{
					$scope.subitem_items.push(subitem)
				}
				//$scope.subitem_item.splice($scope.subitem_item.indexOf(subitem),1);

			}

			$scope.processForm=function(picture_changed){
				  if(this.frm_edit_item.$dirty){//FORMULARIO HA CAMBIADO
					  var _promise,
					  		_idx_updt	=	($scope.form_item.item_id)?$scope.form_item._idx:null;


					  if(  _idx_updt!=null ){
						  $scope.form_item.method='upt.item';
					  }else{
						  $scope.form_item.method='add.item';
					  }

					  if($scope.sizes_prices.length)
						$scope.form_item['sizes_prices' ]=$scope.sizes_prices;

					  if($scope.subitem_item.length)
						$scope.form_item['subitem_items' ]=$scope.subitem_items;


					  if(picture_changed){//SE CAMBIO LA IMAGEN
							_promise = AjaxService.send_form_1pic($scope.form_item, $scope.form_item.data_img);
					  }else{
							_promise = AjaxService.run_ajax($scope.form_item);
					  }

					  _promise.then(function(result){
							var _data	=	( result.response  )? JSON.parse(result.response):result.data;
							console.log( JSON.stringify(_data) );
						   if( _data.status==0 ){
							   if(_idx_updt!=null){
								   $scope.items[ _idx_updt ] =_data.data;
							   }else{
								   $scope.items.push(_data.data);
								   category_mgr.index_Of( $stateParams.itemId ).item_count++;
							   }

						   }
					  });
					 this.frm_edit_item.$setPristine();

				  }

				  $scope.closeModal();

			};


    });
/*
 *
 */
_controllers.controller('SubitemsListingCtrl',
    function($scope, $stateParams, $ionicModal, $ionicPopup, $ionicListDelegate, ctrlPickImagecrop, category_mgr, AjaxService) {
        //$scope.title	=	$stateParams.subitems;

        var _padre = category_mgr.index_Of($stateParams.parent);
        $scope.title = category_mgr.index_OfSubitems($stateParams.itemId, _padre.childs).subiName;
        $scope.subitems = [];
        $scope.default_form = {
            'item_name': '',
            'price': 0,
            'data_img': null,
            'itemid': $stateParams.parent,
            'parentid': $stateParams.itemId,
            'sizes_prices': [],
            'method': null,
            'app_ns': 'reifax.service.reward'
        };
        $scope.form_subitem = {};
        $scope.form_subitem = angular.copy($scope.default_form);

        var _prms = {
            'method': 'list.subitems',
            'item_parent': $stateParams.itemId,
            's': 'b',
            'app_ns': 'reifax.service.reward'
        };
        AjaxService.run_ajax(_prms).then(function(result) {
            $scope.subitems = result.data.data;
        });

        $scope.edit_it = function(el_item, idx) {
            console.log(el_item);
            var _prms = {
                'method': 'read.subitem',
                'item_id': el_item.item_id,
                'app_ns': 'reifax.service.reward'
            };
            AjaxService.run_ajax(_prms).then(function(result) {
                $scope.form_subitem = result.data.data;
                $scope.form_subitem._idx = idx;
                $scope.openModal();
            });

            $ionicListDelegate.closeOptionButtons();
        };
        // confirm dialog Delete
        $scope.showConfirmDelete = function(el_item) {

            var confirmPopup = $ionicPopup.confirm({
                title: 'Remove item',
                template: 'Are you sure you want to remove "' + el_item.item_name + '"?'
            }).then(function(remove) {
                if (remove) {
                    var _prms = {
                        'method': 'remove.sub_item',
                        'iditem': el_item.item_id,
                        'app_ns': 'reifax.service.reward'
                    };

                    AjaxService.run_ajax(_prms).then(function(result) {
                        $scope.subitems.splice($scope.subitems.indexOf(el_item), 1);
                        category_mgr.index_Of($stateParams.itemId).subitem_count--;
                    });

                }
                $ionicListDelegate.closeOptionButtons();

            });
        };

        /*
         *MODAL
         */
        $scope.modal = {};
        $ionicModal.fromTemplateUrl('bo/menu/form_subitem.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $scope.openModal = function(action) {
            if (action == 'new') { ///LEER LOS TAMANOS DISPONIBLES PARA UN NUEVO ITEM
                var _prms = {
                    'method': 'list.category.sizes',
                    'item_parent': $stateParams.itemId,
                    'app_ns': 'reifax.service.reward'
                };
                AjaxService.run_ajax(_prms).then(function(result) {
                    $scope.form_subitem.sizes_prices = result.data.data;
                });
            }
            $scope.modal.show();
        }

        $scope.closeModal = function() {
            $scope.resetModal();
            $scope.modal.hide();
        }

        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });

        $scope.resetModal = function() {
            $scope.form_subitem = angular.copy($scope.default_form);
        };

        $scope.getPhoto = function(max_images) {
            var _self = this;
            ctrlPickImagecrop.sel_Image($scope, 140,  ((typeof $scope.form_subitem.data_img === 'undefined' || $scope.form_subitem.data_img === null )? true : false )).then(function(imageURI) {
                $scope.form_subitem.data_img = imageURI;
                _self.frm_edit_subitem.data_img.$setDirty();
            });
        };

        $scope.save_item = function(picture_changed) {
            if (this.frm_edit_subitem.$dirty) { //FORMULARIO HA CAMBIADO
                var _promise,
                    _idx_updt = ($scope.form_subitem.item_id) ? $scope.form_subitem._idx : null;

                if (_idx_updt != null) {
                    $scope.form_subitem.method = 'upt.subitem';
                } else {
                    $scope.form_subitem.method = 'add.subitem';
                }

                $scope.form_subitem.app_ns = 'reifax.service.reward';

                if (picture_changed) { //SE CAMBIO LA IMAGEN
                    _promise = AjaxService.send_form_1pic($scope.form_subitem, $scope.form_subitem.data_img);
                } else {
                    _promise = AjaxService.run_ajax($scope.form_subitem);
                }

                _promise.then(function(result) {
                    var _data = (result.response) ? JSON.parse(result.response) : result.data;
                    if (_data.status == 0) {
                        if (_idx_updt != null) {
                            $scope.subitems[_idx_updt].item_name = _data.data.item_name;
                            $scope.subitems[_idx_updt].data_img = _data.data.data_img;
                        } else {
                            $scope.subitems.push(_data.data);
                        }

                        category_mgr.index_Of($stateParams.parent).subitem_count++;

                    }
                });
                this.frm_edit_subitem.$setPristine();
            }

            $scope.closeModal();

        };
    });
