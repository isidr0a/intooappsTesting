_controllers.controller('apptCtrl', 
	function($scope, $ionicPopup, $ionicListDelegate, ctrlPickImage, appt_cnf_mgr){
		var _self =	this,
			_company = window.localStorage['BO_company'] || false,
			image_touched =	false;
		
		_self.m_form =	{};
		_self.m_form.intervals	=	1;
		_self.m_form.max_appt	=	1;				
		
		//------_self.m_form.days	=	[{day:'S', free:false}, {day:'M', free:false}, {day:'T', free:false}, {day:'W', free:false}, {day:'T', free:false}, {day:'F', free:false}, {day:'S', free:false}];
		
		_self.edit_mode		=	false;
		_self.server_form	=	{};
		
		_self.servers		=	[];
		
		appt_cnf_mgr.get_servers(_company).then(function(result){
			_self.servers	=	result;
		});
		appt_cnf_mgr.query(_company).then(function(result){
			_self.m_form	=	result;
		});
		//
		_self.set_day	=	function(day){
			_self.m_form.days[day].free= ( 1 - _self.m_form.days[day].free ) ;
		}
		//
		_self.save_data = function(){
			
			/*_self.m_form['days[]']=[];
			angular.forEach(_self.m_form.days, function(value, key) {
				  this.push(value);
			}, _self.m_form['days[]']);*/
			
			appt_cnf_mgr.upt_data(_self.m_form);
		}

	    //
		_self.addOne = function(){
			if(_self.edit_mode){
				//--appt_cnf_mgr.updt_item(_self.lvl_form, image_touched);
			}else{
				_self.server_form.company = _company;
				appt_cnf_mgr.add_server(_self.server_form, image_touched).then(function(result){
					if(result.status==0){
						_self.servers.push({id:result.id, fullname: _self.server_form.fullname, 'data_img': _self.server_form.data_img });
					}
					_self.server_form =	{};
				});
			}
			
			image_touched = false;
			_self.edit_mode = false;
		};
		//
		_self.showConfirmDelete = function(item) {
			$ionicPopup.confirm({
				title: 'Remove',
				template: 'Are you sure you want to remove this item?'
			}).then(function(remove) {
				if(remove) {
					appt_cnf_mgr.del_server(item.id, _company);
					_self.servers.splice(_self.servers.indexOf(item), 1);
				}
				$ionicListDelegate.closeOptionButtons();
			});
		};
		//
		_self.getPhoto = function(max_images) {
			ctrlPickImage.sel_Image(max_images).then(function(imageURI) {
				_self.server_form.data_img = imageURI;
				image_touched = true;
			});
		};
		
});

	/*
	 * 
	 */
_controllers.controller('apptWtCtrl', 
	function($scope, $ionicPopup, ionicTimePicker, ctrlPickImage, appt_cnf_mgr, app_config){
		var _self =	this,
			_company = window.localStorage['BO_company'] || false;
		
		_self.days	=	app_config.weekdays;
		_self.m_form =	{};
		_self.list	=	[];
		
		appt_cnf_mgr.listWt(_company).then(function(result){
			_self.list	=	result.data.list;
		});
		

		//
		_self.save_data = function(){
		}
		//========================== TIME PICKERS =======================
	    _self.openTimePicker_1 = function(){
	    	 var TPick = {
	    		      callback: function (val) {  //Mandatory
						var _date_mili = (val*1000);
						_self.m_form.work_from = moment.utc( _date_mili ).format("HH:mm");
	    		      },
					  inputTime: 28800   //Optional
	    		    };
	         ionicTimePicker.openTimePicker(TPick);
	    };
	    _self.openTimePicker_2 = function(){
	    	 var TPick = {
	    		      callback: function (val) {  //Mandatory
						var _date_mili = (val*1000);
	    		    	  _self.m_form.work_till =	moment.utc( _date_mili ).format("HH:mm");
	    		      },
					  inputTime: 57600   //Optional
	    		    };
	         ionicTimePicker.openTimePicker(TPick);
	    };
	    //
		_self.addOne = function(){

			_self.m_form.company = _company;
			
			appt_cnf_mgr.add_wt(_self.m_form).then(function(result){
				if(result.data.status==0){
					_self.m_form._id = result.data.id
					_self.list.push(_self.m_form);
				}
				_self.m_form = {};
			});
			
		};
		//
		_self.showConfirmDelete = function(item) {
			$ionicPopup.confirm({
				title: 'Remove',
				template: 'Are you sure you want to remove this item?'
			}).then(function(remove) {
				if(remove) {
					appt_cnf_mgr.del_wt(item._id, _company);
					console.log(item);
					_self.list.splice(_self.list.indexOf(item), 1);
				}
			});
		};

		
});