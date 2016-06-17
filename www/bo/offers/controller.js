_controllers.controller('OffersCtrl',
    function($scope, $ionicPopup, $ionicListDelegate, $ionicModal, $stateParams, offer_mgr) {
        var _self = this,
            _company = window.localStorage['BO_company'] || false;

        $scope._item = null;
        _self.items = [];

        //
        offer_mgr.query(_company).then(function(result) {
            _self.items = result;
        });
        // confirm dialog Delete
        _self.showConfirmDelete = function(el_item) {
            $ionicPopup.confirm({
                title: 'Remove',
                template: 'Are you sure you want to remove this item?'
            }).then(function(remove) {
                if (remove) {
                    offer_mgr.remove_item(el_item);
                }
                $ionicListDelegate.closeOptionButtons();
            });
        };
        //
        _self.edit = function(item) {
            $scope._item = item;
            $scope.openModal();
            $ionicListDelegate.closeOptionButtons();
        };
        //
        _self.new_offer = function() {
            $scope.openModal();
        };
        /*
         *MODAL
         */
        $scope.modal = {};

        $scope.openModal = function(item) {
            if (_company) {
                $ionicModal.fromTemplateUrl('bo/offers/form.html', {
                        scope: $scope,
                        animation: 'slide-in-up'
                    })
                    .then(function(modal) {
                        $scope.modal = modal;
                        $scope.modal.show();
                    });
            }
        };
        $scope.closeModal = function() {
            $scope.modal.remove();
            $scope._item = null;
        }

    });
/*
 *
 */
_controllers.controller('offerFormCtrl',
    function($scope, ionicDatePicker, ctrlPickImagecrop, offer_mgr) {
        var _self = this,
            _company = window.localStorage['BO_company'],
            editing = ($scope._item ? true : false),
            image_touched = false;

        _self.m_form = {};
        _self.m_form.company = _company;

        _self._fdt = '';

        if (editing) {
            _self.m_form = $scope._item;
            _self._fdt = _self.m_form.post_expired ? moment.utc(_self.m_form.post_expired).format("YYYY-MM-DD") : '';
        }
        //
        _self.form_process = function() {
                if (editing) {
                    offer_mgr.uptItem(_self.m_form, image_touched);
                } else {
                    offer_mgr.addItem(_self.m_form, image_touched);
                }

                $scope.closeModal();
            }
            //
        _self.getPhoto = function(max_images) {
            var _self = this;

            ctrlPickImagecrop.sel_Image($scope, 140, ((typeof _self.m_form.data_img === 'undefined' || _self.m_form.data_img === null) ? true : false)).then(function(imageURI) {
                _self.m_form.data_img = imageURI;
                image_touched = true;
            });
        };
        //============== DATE PICKERS =======================
        _self.openDatePicker = function() {
            var _show_date = _self.m_form.post_expired ? (new Date(_self.m_form.post_expired)) : (new Date());
            var dtPick = {
                callback: function(val) { //Mandatory
                    var _ftmDt = moment.utc(val);

                    _ftmDt.add({
                        hours: 23,
                        minutes: 59
                    }); // QUE FINALICE A MEDIA NOCHE
                    _self._fdt = moment.parseZone(_ftmDt.valueOf()).format("YYYY-MM-DD");
                    _self.m_form.post_expired = moment.parseZone(_ftmDt.valueOf()).format("YYYY-MM-DD HH:mm");

                },
                inputDate: _show_date
            };
            ionicDatePicker.openDatePicker(dtPick);
        };
    });
