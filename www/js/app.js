		// Ionic Starter App
		
		// angular.module is a global place for creating, registering and retrieving Angular modules
		// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
		// the 2nd parameter is an array of 'requires'
		// 'ionic_rewards.services' is found in services.js
		// 'ionic_rewards.controllers' is found in controllers.js
		//'ngColorPicker', 
var app_main =	angular.module('ionic_rewards', ['ionic','color.picker', 'jett.ionic.filter.bar','angular.filter', 'ngCordova', 'httpLoading', 'ionic-datepicker', 'ionic-timepicker', 'ionic-ratings', 'ionic_rewards.services', 'ionic_rewards.controllers']);


		app_main.run(function($ionicPlatform, $templateCache, $cordovaSplashscreen, $timeout, $rootScope, Auth, app_config){

			$ionicPlatform.ready(function() {
				// Wait 2secs before hiding splash screen
			    $timeout(function() {
					console.log('[run]');
					document.getElementsByClassName('wait4it')[0].style.display='none';
					
					try{
						$cordovaSplashscreen.hide();
						console.log('splash:hide');
					}catch(err){ 
						console.log('NOT splash');
					}
			    }, 2000);
			});
			
			$templateCache.put('templates/dinamyc_tabs.html', bootUp.tabsTpl);
			
	        $rootScope.$on('$stateChangeStart', function (event, toState) {
	        	if(!Auth.authorize(toState.roles)){
	        		 event.preventDefault();
	        	}
	        });
			
		});

		app_main.config(
			function($stateProvider, $httpProvider, $urlRouterProvider, $ionicConfigProvider, ionicDatePickerProvider, ionicTimePickerProvider, app_config ) {

				var datePickerObj = {
			    	inputDate: new Date(),
			    	monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
			    	from:  new Date(),
			    	dateFormat: 'yyyy-MM-dd',
			    	closeOnSelect: false,
			    	templateType:'modal'
			    };
					  
				var timePickerObj = {
					inputTime: (((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60)),
					format: 24,
					step: 30
				};
			    ionicDatePickerProvider.configDatePicker(datePickerObj);
				ionicTimePickerProvider.configTimePicker(timePickerObj);
				
				$httpProvider.interceptors.push('BearerAuthInterceptor');

				//app_config.ROLES = [{"role_id":1000,"role_name":"super"},{"role_id":1001,"role_name":"sellers"},{"role_id":1002,"role_name":"admin"},{"role_id":1003,"role_name":"employee"},{"role_id":1004,"role_name":"user"}];

			  // Ionic uses AngularUI Router which uses the concept of states
			  // Set up the various states which the app can be in.
			  // Each state's controller can be found in controllers.js
			
			  $stateProvider
			    .state('tabs', {
				  url: '/tab',
				  templateUrl: 'templates/dinamyc_tabs.html'
				 })
			    .state('tabs.home', {
			      url: "/home",
			      views: {
			        'tab-home' :{
			          templateUrl: "templates/main_screen.html",
			          controller: 'InitPageCtrl as home'
			        }
			      }
			    })
			    .state('scanCode', {
			      url: "/scan",
			      cache:false,
		          templateUrl: "templates/scan.html",
		          controller: 'scanCtrl as scan'
			    })
			    .state('map_location', {
			      url: "/location",
			      cache:false,
		          templateUrl: "templates/location.html",
		          controller: 'locCtrl as loc'
			    })
				.state('rewards', {
			      url: "/rewards",
			      cache:false,
		          templateUrl: "templates/rewards.html",
		          controller: 'rewardCtrl as rw'
			    })
			    .state('login', {
			      url: "/login",
			      cache:false,
		          templateUrl: "templates/login.html",
		          controller: 'loginCtrl as login'
			    })
			    .state('register', {
			      url: "/register",
			      cache:false,
		          templateUrl: "templates/register.html",
		          controller: 'SingInCtrl as SingIn'
			    })
			    .state('mgrCia', {
			      url: "/cia",
				  roles:['admin','super','seller','dataentry', 'dev'],
		          templateUrl: "company/listing.html",
		          controller: 'CiaCtrl as coMgt'
			    })
			    .state('mgrCia.edit', {
			      url: "/edit",
				  roles:['admin','super','seller','dataentry', 'dev'],
			      cache:false,
				   params: {
					 cia: null
				   },
				   views: {
			        '@' :{
			          templateUrl: "company/form.html",
			          controller: 'CiaEditCtrl as coEdit'
			       }
			      }
		          /*templateUrl: "company/form.html",
		          controller: 'CiaEditCtrl as coEdit'*/
			    })
			    .state('users', {
			      url: "/users",
		          templateUrl: "users/listing.html",
		          controller: 'UsrsCtrl as usrs'
			    })
			    /* AREA RESTRINGIDA ADMIN/SUPER-USER */
			    .state('admin', {
			    	url: "/admin",
			    	templateUrl: "templates/admin_tabs.html",
			    })
			    .state('admin.modules', {
			      url: "/modules",
			      cache:false,
			      views: {
			        'tab-modules' :{
			          templateUrl: "bo/modules/listing.html",
			          controller: 'ModulesCtrl as mods'
			        }
			      }
			    })
			    .state('admin.menu', {
			      url: "/menu",
			      cache:false,
			      views: {
			        'tab-menu' :{
			          templateUrl: "bo/menu/listing.html",
			          controller: 'CategoriesIndexCtrl'
			        }
			      }
			    })
			    .state('admin.menu.items', {
			      url: '/items/:itemId',
			      views: {
			        'tab-menu@admin': {
			          templateUrl: 'bo/menu/items_listing.html',
			          controller: 'ItemsListingCtrl'
			        }
			      }
			    })
			    .state('admin.menu.sub_items', {
			      url: '/:itemId/:parent',
			      views: {
			        'tab-menu@admin': {
			          templateUrl: 'bo/menu/subitem_listing.html',
			          controller: 'SubitemsListingCtrl'
			        }
			      }
			    })
			    .state('admin.offers', {
			      url: "/offers",
			      cache:false,
			      views: {
			        'tab-offers' :{
			          templateUrl: "bo/offers/listing.html",
			          controller: 'OffersCtrl as ofs'
			        }
			      }
			    })
			    .state('admin.rewards', {
			      url: "/rewards",
			      cache:false,
			      views: {
			        'tab-rewards' :{
			          templateUrl: "bo/rewards/admin_rewards.html",
			          controller: 'RewardsCtrl as rwds'
			        }
			      }
			    })
			    .state('admin.appt', {
			      url: "/appointments",
			      cache:false,
			      views: {
			        'tab-appt' :{
			          templateUrl: "bo/appt//admin_appt.html",
			          controller: 'apptCtrl as appt'
			        }
			      }
			    })
			    .state('admin.wt', {
			      url: "/appt_wt",
			      views: {
			        'tab-appt' :{
			          templateUrl: "bo/appt/admin_appt_wt.html",
			          controller: 'apptWtCtrl as apptWt'
			        }
			      }
			    })
				//CLIENT-CLIENT-CLIENT
				.state('tabs.menu', {
					url: "/menu",
					cache:false,
					views: {
						'tab-cli-menu' :{
							templateUrl: "clients/menu/listing_client_menu.html",
							controller: 'MenusIndexCtrl'
						}
					}
			    })
				.state('tabs.offer', {
			      url: "/offer",
				  cache:false,
			      views: {
						'tab-cli-offer' :{
							templateUrl: "clients/offer/listing_client_offers.html",
							controller: 'OffersIndexCtrl'
						}
			      }
			    })
				.state('tabs.appointment', {
			      url: "/appointment",
				  cache:false,
			      views: {
						'tab-cli-appt' :{
							templateUrl: "clients/appointment/listing_client_appointment.html",
							controller: 'ApptIndexCtrl'
						}
			      }
			    })
				.state('tabs.menu.order', {
			      url: '/order/:itemId/:parent',
				  cache:false,
			      views: {
			        'tab-cli-menu@tabs': {
			          templateUrl: 'clients/menu/items_client_menu.html',
			          controller: 'ItemsListingClientCtrl'
			        }
			      }
			    })
				.state('tabs.menu.cart', {
			      url: '/cart',
				  cache:false,
			      views: {
			        'tab-cli-menu@tabs': {
			          templateUrl: 'clients/menu/form_order_menu.html',
			          controller: 'CartClientCtrl'
			        }
			      }
			    })
				.state('tabs.menu.checkout', {
			      url: '/checkout',
				  cache:false,
			      views: {
			        'tab-cli-menu@tabs': {
			          templateUrl: 'clients/menu/checkout_menu.html',
			          controller: 'CheckoutClientCtrl'
			        }
			      }
			    })
				.state('tabs.menu.delivery', {
			      url: '/delivery',
				  cache:false,
			      views: {
			        'tab-cli-menu@tabs': {
			          templateUrl: 'clients/menu/delivery_menu.html',
			          controller: 'DeliveryClientCtrl'
			        }
			      }
			    })
			    ;
		  
			  // if none of the above states are matched, use this as the fallback
			  //$urlRouterProvider.otherwise('/tab/categories');
			  $urlRouterProvider.otherwise("/tab/home");
			  $ionicConfigProvider.views.maxCache(0);
		
		});
