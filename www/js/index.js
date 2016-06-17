var $q = angular.injector(['ng']).get('$q'),
	$http = angular.injector(['ng']).get('$http');
//testing
var bootUp = {
	api: null,
	companyID: null,//DEFINE LA COMPANIA CON LA QUE EL APK FINAL TRABAJARA
	company: null,
	ciaInfo:{},
	account:{card:null, lvl:1, balance:1},
	ajax: {
		parseResponse:function(e){var t;try{t=JSON.parse(e.responseText)}catch(n){t=e.responseText}return[t,e]},
    	getQueryString:function(e){return Object.keys(e).map(function(t){return encodeURIComponent(t)+"="+encodeURIComponent(e[t])}).join("&")},
    	isObject:function(e){return"[object Object]"===Object.prototype.toString.call(e)},
    	objectToQueryString:function(e){return this.isObject(e)?this.getQueryString(e):e},
    	post:function(url,params,async){var def=$q.defer(),xhr = new XMLHttpRequest(),data=params,contentType = 'application/x-www-form-urlencoded';xhr.open( 'POST', url || '', async );xhr.setRequestHeader( 'Content-Type', contentType );xhr.addEventListener( 'readystatechange', function(){var xhr = this,_parse,_data=null,DONE = 4;if( xhr.readyState === DONE ){if( xhr.status >= 200 && xhr.status < 300 ){_parse = bootUp.ajax.parseResponse( xhr );_data = (_parse[0].data)?_parse[0]:null;}def.resolve(_data);}}, false );xhr.send( bootUp.ajax.objectToQueryString( data ) );return def.promise;}
	},
	getAccount:function(){
		var _def = $q.defer(),
			_prms = {method:'create.account', company:null, app_ns:'reifax.service.reward'};
			_account = JSON.parse(window.localStorage.getItem('loyalty')) || {};

		if(_account.card) {
			_def.resolve();
		}else{
			_prms.company = this.companyID;
			this.ajax.post(this.api, _prms, true).then(function(result){
				 bootUp.account.card = result.data;
				 window.localStorage['loyalty'] = JSON.stringify(bootUp.account);
				_def.resolve();
			});
		}
		return _def.promise;
	},
	getMasters:function(){
		var _def = $q.defer(),
			_prms = {method:'get.masters', app_ns:'reifax.service.reward'};

			_prms.company = this.companyID;
			this.ajax.post(this.api, _prms, true).then(function(result){
				 bootUp.masters = result.data;
				_def.resolve();
			});
	return _def.promise;
	},
	masters:null,
	loadTabs:function(tabs){
		var _tabs = [],
			has_icons = false;

		//LEER TABS
		angular.forEach(tabs, function(value, key){
			if(value.moduActive==1){
				if(value.moduName=='Menu'){
					bootUp.mnuExpand = value.moduDisplayExpand;
					bootUp.mnuType   = value.moduDisplayType;
				}
				_tabs.push('<ion-tab title="' + ( value.moduAlias ? value.moduAlias : value.moduName ) + '" href="'+value.moduHref+'" ');

				if(value.moduIcon && value.moduDisplayIcon==1) {
					_tabs.push('icon="'+value.moduIcon+' istab" ');
					has_icons=true;
				}

				_tabs.push('> <ion-nav-view name="'+value.moduNavview+'"></ion-nav-view>'+
						  '</ion-tab>');
			}
		});
		bootUp.tabsTpl =
			'<ion-view title="Home">'+
				'<ion-tabs ' + (has_icons?'class="tabs-icon-top"':'' ) + ' >'+
					_tabs.join('')+
				  '</ion-tab>'+
				'</ion-tabs>'+
		 '</ion-view>';
		//
	},
	tabsTpl:'',
	mnuExpand: 0,
	mnuType: 0,
	loadAll:function(){
		var _def = $q.defer(),
			_prms = {
				method:'get.everything',
				app_ns:'reifax.service.reward'
			};
			_prms.company = this.companyID;
			this.ajax.post(this.api, _prms, true).then(function(result){
				if(result.success) {
					bootUp.loadTabs(result.data.tabs);
					bootUp.ciaInfo = result.data.company;
					bootUp.ciaInfo.carrousel.sort(function(a,b){
						//ORDENAR ASC
						return a.order-b.order;
					});
					_def.resolve();
				 }
			});
		return _def.promise;
	},
	run:function(){
		if(window.localStorage.getItem('fromBO')){
			var _BO = JSON.parse(window.localStorage.getItem('fromBO'));
			this.company = _BO.company;
			this.companyID = _BO.companyID;
			window.localStorage.removeItem('fromBO');
		}
		$q.all([this.getAccount(),this.getMasters(), this.loadAll()]).then(function(){
			app_main.constant('app_config', {
				appName: 'Rewards',
				appVersion: 1.0,
				companyID: bootUp.companyID,//DEFINE LA COMPANIA CON LA QUE EL APK FINAL TRABAJARA
				company: bootUp.ciaInfo.idComp,
				dataCompany: bootUp.ciaInfo,
				ROLES: bootUp.masters.roles,
				SOCIALS:bootUp.masters.socials,
				CONTACTS:bootUp.masters.contacts,
				COMPSTATUS:bootUp.masters.compStatus,
				apiUrl: bootUp.api ,
				weekdays:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
			});
			angular.element(document).ready(function() {
			    angular.bootstrap(document, ['ionic_rewards']);
			});
		});
	}
};

$http({
  method: 'GET',
  url: 'js/config.json'
}).then(function(result){
  bootUp.api = result.data.api;
  bootUp.companyID = result.data.companyID;
  bootUp.company = result.data.company;
  bootUp.run();
});
