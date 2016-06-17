_controllers.controller('RewardsCtrl',
    function($scope, $ionicPopup, reward_mgr, ctrlPickImagecrop) {
        var _self = this,
            _company = window.localStorage['BO_company'] || false;
        _moved = false,
            image_touched = false;

        _self.edit_mode = false;
        _self.reorder = false;
        _self.m_form = reward_mgr.conf;

        _self.lvl_form = {};

        _self.items = [];

        reward_mgr.get_conf(_company);
        reward_mgr.query(_company).then(function() {
            _self.items = reward_mgr.list;
        });

        //
        _self.addOne = function() {
            if (_self.edit_mode) {
                reward_mgr.updt_item(_self.lvl_form, image_touched);
            } else {
                var _max = (_self.items.length + 1);
                _self.lvl_form.order = _max;
                _self.lvl_form.company = _company;
                reward_mgr.add_item(_self.lvl_form, image_touched);
                //--_self.items.push({text: _self.lvl_form.post_content, 'img': _self.lvl_form.data_img, 'item_order': _max });
            }
            _self.lvl_form = {};
            _self.edit_mode = false;
        };
        //
        _self.editItem = function(item) {
            _self.lvl_form = item;
            _self.edit_mode = true;
        };
        //
        _self.ptsChg = function() {
            reward_mgr.upt_conf(_self.m_form);
        };
        // confirm dialog Delete
        _self.showConfirmDelete = function(el_item) {
            $ionicPopup.confirm({
                title: 'Remove',
                template: 'Are you sure you want to remove this item?'
            }).then(function(remove) {
                if (remove) {
                    reward_mgr.remove_item(el_item);
                }
            });
        };
        //
        _self.showlvl = function(lvl) {
                return !isNaN(parseFloat(_self.m_form.points)) && isFinite(_self.m_form.points) ? _self.m_form.points * lvl : 0;
            }
            //
        _self.getPhoto = function(max_images) {
            var _self = this;

            ctrlPickImagecrop.sel_Image($scope, 140, ((typeof _self.lvl_form.data_img === 'undefined' || _self.lvl_form.data_img === null )? true : false )).then(function(imageURI) {
                _self.lvl_form.data_img = imageURI;
                image_touched = true;
            });
        };
        //
        _self.doneRO = function() {
                if (_moved) {
                    /*
                     * salvar nuevo orden
                     */
                    var new_order = [];

                    angular.forEach(_self.items, function(value, key) {
                        this.push({
                            'id': value.id,
                            'order': key
                        });
                    }, new_order);

                    reward_mgr.order(new_order);
                }

                _self.reorder = !_self.reorder;
                _moved = false;
            }
            //
        _self.moveItem = function(item, fromIndex, toIndex) {
            _self.items.splice(fromIndex, 1);
            _self.items.splice(toIndex, 0, item);
            _moved = true;
        };

    });
