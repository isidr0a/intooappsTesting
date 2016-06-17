_controllers.controller('CiaCtrl',
    function($scope, $ionicPopup, $ionicActionSheet, $state, $window, $timeout, $ionicFilterBar, company_mgr) {
        var _self = this,
            _clones = [];
        //PRIVATE FUNCTIONS
        function edit(item) {
            item.carrousel = item.carrousel || [];
            _self.cia = item; //angular.copy(item);
            _self.cia.contactDelete = [];
            _self.cia.carrousel.sort(function(a, b) { //ORDENAR ASC
                return a.order - b.order;
            });
            $state.go('mgrCia.edit', {
                cia: _self.cia
            })
        }
        // confirm dialog Delete
        function showConfirmDelete(el_item) {
            $ionicPopup.confirm({
                title: 'Deactivate',
                template: 'Are you sure you want to deactivate this company?<br/>THIS CANNOT BE UNDONE'
            }).then(function(remove) {
                if (remove) {
                    company_mgr.deactivate(el_item);
                }
            });
        }
        _self.items = [];
        _self.cia = null;
        company_mgr.query().then(function(result) {
            _self.items = company_mgr.list;
        });
        _self.new_cia = function() {
            $state.go('mgrCia.edit')
        };
        _self.showFilterBar = function() {
            filterBarInstance = $ionicFilterBar.show({
                items: _self.items,
                update: function(filteredItems) {
                    _self.items = filteredItems;
                },
                filterProperties: 'compName'
            });
        };
        // Triggered on a button click, or some other target
        _self.showOptions = function(item) {
            // Show the action sheet
            var hideSheet = $ionicActionSheet.show({
                buttons: [{
                    text: 'Edit'
                }, {
                    text: 'BackOffice'
                }, {
                    text: 'Load company as model'
                }, {
                    text: 'Clone this company '
                }],
                destructiveText: 'Deactivate',
                titleText: 'Modify <strong>' + item.compName + '</strong>',
                cancelText: 'Cancel',
                cancel: function() {
                    // add cancel code..
                },
                buttonClicked: function(index) {
                    switch (index) {
                        case 0:
                            edit(item);
                            break;
                        case 1:
                            window.localStorage['BO_company'] = item.idComp;
                            $state.go('admin.modules', {}); //second parameter is for $stateParams
                            break;
                        case 2:
                            window.localStorage['fromBO'] = JSON.stringify({
                                'company': item.idComp,
                                'companyID': item.compHashkey
                            });
                            $state.go('tabs.home', {});
                            $timeout(function() {
                                $window.location.reload();
                            }, 10);
                            break;
                        case 3:
                            //_clones
                            $ionicPopup.confirm({
                                title: 'Cloning tool',
                                template: 'Are you sure you want to clone this company?<br/><strong>' + item.compName + '</strong>'
                            }).then(function(toclone) {
                                if (toclone) {
                                    var _itemclone = angular.copy(item); //copiar info
                                    if (!_clones[_itemclone.idComp]) _clones[_itemclone.idComp] = 0;
                                    _clones[_itemclone.idComp]++; //incremetar alias
                                    company_mgr.cloneCia(_itemclone, _clones[_itemclone.idComp]); //servicio clonar
                                }
                            });
                            break;
                    }
                    return true;
                },
                destructiveButtonClicked: function() {
                    showConfirmDelete(item);
                    return true;
                }
            });
        };
    });
_controllers.controller('CiaEditCtrl',
    function($scope, $ionicPopup, $state, $ionicLoading, $ionicModal, ctrlPickImagecrop, company_mgr, app_config) {
        var _self = this,
            MAX_BANNERS = 4,
            BANNERS = 0,
            banners_moved = false,
            editmode = false,
            curColor = '',
            _Utemplate =
            '<ion-modal-view>' +
            '<ion-header-bar class="bar-positive notheme">' +
            '<div class="button button-clear" ng-click="coEdit.M_close(false);">' +
            'Cancel' +
            '</div>' +
            '<h1 class="title">Pick a color</h1>' +
            '<div class="button button-clear" ng-click="coEdit.M_close(true);">' +
            'Done' +
            '</div>' +
            ' </ion-header-bar>' +
            '<ion-content padding="true" scroll="false">' +
            '<p> <color-picker ng-model="coEdit.colorPicked" color-picker-inline="true" color-picker-format="\'hex\'"></color-picker> </p>  ' +
            '</ion-content>' +
            '</ion-modal-view>';
        //
        _self.show_cotent = 'company';
        _self.colorPicked = '';
        _self.move_carrousel = false;
        _self.m_form = {};
        /*
        	CAPTURAR SI ES MODO EDICION
        */
        if ($state.params.cia) {
            _self.m_form = $state.params.cia;
            BANNERS = _self.m_form.carrousel.length || 0;
            editmode = true;
        } else {
            // Construct Socials networks for new companies
            _self.m_form.social = app_config.SOCIALS;
            // Construct Contact Info for new companies
            _self.m_form.contact = {};
            app_config.CONTACTS.forEach(function(e, i) {
                _self.m_form.contact[e.contDesc.toLowerCase()] = [];
                var temp = angular.copy(e);
                var type = angular.copy(e.types[0]);
                delete temp.types;
                for (var attrname in type) {
                    temp[attrname] = type[attrname];
                }
                _self.m_form.contact[e.contDesc.toLowerCase()].push(temp);
            });
        }
        $scope.lsSN = app_config.SOCIALS;
        $scope.lsCT = app_config.CONTACTS;
        $scope.lsCST = app_config.COMPSTATUS;
        /*
         * CARROUSEL
         */
        _self.move_done = function() {
            _self.move_carrousel = !_self.move_carrousel;
        };
        _self.reorderItem = function(item, fromIndex, toIndex) {
            _self.m_form.carrousel.splice(fromIndex, 1);
            _self.m_form.carrousel.splice(toIndex, 0, item);
            banners_moved = true;
        };
        // confirm dialog Delete
        _self.delCarru = function(banner) {
            $ionicPopup.confirm({
                title: 'Remove',
                template: 'Are you sure you want to remove this item?'
            }).then(function(remove) {
                if (remove) {
                    company_mgr.carrouselRemove(_self.m_form.compHashkey, banner.id).then(function(result) {
                        _self.m_form.carrousel.splice(_self.m_form.carrousel.indexOf(banner), 1);
                        BANNERS--;
                    });

                }
            });
        };
        //
        _self.add_banner = function() {
            if (BANNERS < MAX_BANNERS) {

                ctrlPickImagecrop.sel_Image($scope, 800, true).then(function(imageURI) {
                    imageURI = [imageURI];
                    angular.forEach(imageURI, function(value, index) {
                        this.push({
                            'id': null,
                            'url': value,
                            'order': BANNERS
                        });
                        BANNERS++;
                    }, _self.m_form.carrousel);
                });
                /*
                ctrlPickImagecrop.sel_Image((MAX_BANNERS - BANNERS), [800, 1200]).then(function(imageURI) {
                    imageURI = ((MAX_BANNERS - BANNERS) == 1) ? [imageURI] : imageURI; //CUANDO ES 1, el servicio no devuelve un array
                    angular.forEach(imageURI, function(value, index) {
                        this.push({
                            'id': null,
                            'url': value,
                            'order': BANNERS
                        });
                        BANNERS++;
                    }, _self.m_form.carrousel);
                });*/
            }
        };
        //MODALS DE COLORES
        $scope.Umodal = {};
        _self.M_close = function(picked) {
            if (!picked) _self.colorPicked = '';
            if ($scope.Umodal.remove) $scope.Umodal.remove();
        };
        $scope.open_Upk = function(where) {
            curColor = where;
            $scope.Umodal =
                $ionicModal.fromTemplate(_Utemplate, {
                    scope: $scope,
                    animation: 'slide-in-up'
                });
            $scope.Umodal.show();
        };
        $scope.$on('modal.removed', function(a, b) {
            if (_self.colorPicked != '') _self.m_form[curColor] = _self.colorPicked;
        });
        //
        /*
         * PROCESAR ENVIAR FORM
         */
        _self.form_process = function() {
            var _carrousel = [],
                _data = angular.copy(_self.m_form);
            angular.forEach(_data.carrousel, function(value, index) { //SOLO ENVIAR LAS NUEVAS
                if (value.id === null) { //ITEM CARROUSEL NUEVO, MARCAR PARA SUBIR A AWS
                    value.key = index; //ENVIAR POSICION EN EL ARRAY PARA ACTUALIZAR LUEGO LA URL OBTENIDA DESDE AWS
                    this.push(value);
                }
            }, _carrousel);
            if (!editmode) { // ES UNA NUEVA COMPANIA
                _data.isnew = 1;
            }

            if (_carrousel.length > 0) { //NUEVAS IMAGENES PARA SUBIR?
                $ionicLoading.show({
                    template: 'Uploading images, please wait...'
                });
            }


            //salvar imagenes en AWS, SE ENVIAN SOLAS LAS AGREGADAS NO LAS EXISTENTES
            company_mgr.Carrousel(_carrousel).then(function(imgs) {
                if (_carrousel.length > 0 || banners_moved) { //HAY IMAGENES PARA SUBIR/FUERON MOVIDAS??
                    angular.forEach(imgs, function(jsonItem, ind) { //IMAGENES CON NUEVA URL AWS
                        _data.carrousel[jsonItem.data.key_image] = {
                            url: jsonItem.data.aws_image
                        };
                    });
                    banners_moved = false;
                }
                company_mgr.upt_data(_data).then(function(result) { //SALVAR FORMULARIO VIA POST
                    // console.log(JSON.stringify(result.data));
                    if (_data.isnew) {
                        delete _data.isnew;
                        _data.idComp = result.data.id;
                        company_mgr.list.push(_data);
                    }
                    _self.m_form.carrousel = result.data.carrousel; //FRESCAR ARRAY CARROUSEL
                    $ionicLoading.hide(); //OCULTAR PREVIO
                    _self.m_form.contact = result.data.newContact; //FRESCAR ARRAY CONTACTS
                    $ionicLoading.show({
                        template: 'Company successfully saved',
                        duration: 1500
                    });
                });
            });
        };
    }
);
