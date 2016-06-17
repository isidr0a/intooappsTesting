_controllers.controller('MenusIndexCtrl',
	function($scope, $ionicModal, $ionicPopup, $ionicListDelegate, AjaxService, category_mgr, app_config, ShoppingCartService) {

			$scope.categories  = [];
			$scope.price       = [];
			$scope.shownGroup  = null;
			$scope.typeMenu    = bootUp.mnuType;
			$scope.countBadge  = ShoppingCartService.cont();

			/*
			* QUERY
			*/
			
			console.log(app_config);
			category_mgr.Fullquery(app_config.company).then(function(result){//LEER LISTADO DE CATEGORIAS
				$scope.categories = result;
				console.log($scope.categories);
			});


			/*
			* ACCORDION
			*/
			$scope.toggleGroup = function(group) {
				if ($scope.isGroupShown(group)) {
				  $scope.shownGroup = null;
				} else {
				  $scope.shownGroup = group;
				}

			};
			$scope.isGroupShown = function(group) {
				//return $scope.shownGroup === group;
				return bootUp.mnuExpand==1 ||  $scope.shownGroup === group;
			};

			$scope.sizePri = function (size) {
				console.log(size);
				$scope.sizeId = size.id;
			}

	});

_controllers.controller('ItemsListingClientCtrl',
		function($scope, $stateParams, ShoppingCartService, $ionicLoading, $ionicModal, $ionicPopup, $ionicListDelegate, $ionicActionSheet, AjaxService, category_mgr) {

			$scope.titleOrders			=	$stateParams.item_id;
			$scope.countBadge  			= 	ShoppingCartService.cont();
			$scope.subitemsizeprice		=	[];
			$scope.newTotal     		=   '';
			//$scope.favorite     		=   0;
			$scope.item					=   {item:{},options:[],toopings:[]};
			$scope.new_order    		=
			{
				qty 		: 1,
				item 		: {id:'',name:'',desc:'',pric:'',img:'',favo:''},
				price		: null,
				additional	: '',
				name		: [],
				toopings    : [],
				options     : []
			};

			$scope.selTopp = function(topp){
				console.log(topp);
				if(topp.market){
					$scope.new_order.toopings.push(topp)
					//$scope.new_order.name.push(name)
				}else{
					$scope.new_order.toopings.splice($scope.new_order.toopings.indexOf(topp),1);			
					//$scope.new_order.name.splice($scope.new_order.name.indexOf(name),1);	
				}
			}
			
			$scope.selTopp2 = function(topp){
				console.log(topp);
				if(topp.market){
					$scope.new_order.toopings.push(topp)
					//$scope.new_order.name.push(name)
				}else{
					$scope.new_order.toopings.splice($scope.new_order.toopings.indexOf(topp),1);			
					//$scope.new_order.name.splice($scope.new_order.name.indexOf(name),1);	
				}
			}
			
			$scope.selOpt = function(opt){
				console.log(opt);
				if(opt.market)
					$scope.new_order.options.push(opt)
				else
					$scope.new_order.options.splice($scope.new_order.options.indexOf(opt),1);
			}

			
			$scope.selprice =function(item){
				console.log(item);
				$scope.new_order.toopings = [];
				item.mark=true;
				$scope.new_order.toopings.push(item);
			}

			var _prms	={
				'method':'read.item',
		  		'item_id': $stateParams.itemId,
		  		'app_ns': 'reifax.service.reward'
		  	};

			AjaxService.run_ajax(_prms).then(function(result){
				$scope.item.item    =	result.data.data;
				$scope.new_order.item.id   =$scope.item.item.item_id;
				$scope.new_order.item.name =$scope.item.item.item_name;
				$scope.new_order.item.desc =$scope.item.item.item_description;
				$scope.new_order.item.img  =$scope.item.item.data_img;
				$scope.new_order.item.pric =$scope.item.item.price;
				$scope.new_order.item.favo =$scope.item.item.favorite;
			});

			var _prms3	={
				'method':'list.subitems',
		  		'item_parent': $stateParams.parent,
				'item_id': $stateParams.itemId,
                's': 'c',
		  		'app_ns': 'reifax.service.reward'
		  	};
			AjaxService.run_ajax(_prms3).then(function(result){

				angular.forEach(result.data.data,function(item,index){
                    //$scope.item.options  =	result.data.data;
					console.log(item);
					$scope.item.options.push(item);
					$scope.new_order.name.push(item.item_name);
					
					
					angular.forEach(item.childs,function (res,ind){
						res.checked=true;

						if(res.price.length==0 && res.default_price==0){
							$scope.new_order.options.push(res);
						}
					});
					
				});

			});


			$scope.increaseItemCount = function(qty) {
				console.log(qty);
				$scope.new_order.qty++;
			};
			$scope.decreaseItemCount = function(qty) {
				if ($scope.new_order.qty > 1) {
				  $scope.new_order.qty--;
				}
			};

			$scope.addToCart = function(new_order) {
				console.log(new_order);
				//confirmation item add to cart
				if ((new_order.price==null) && (new_order.toopings.length==0) && (new_order.options.length==0)){
					if(new_order.name.length==0)
						var name = 'Size'
					else
						var name= new_order.name
						
					var confirmPopup = $ionicPopup.alert({
						title: 'Add to cart',
						template: 'You must select a '+name+''
					});
					
				}else if((new_order.price==null) && (new_order.toopings.length==0)){
					var confirmPopup = $ionicPopup.confirm({
					title: 'Add to cart',
					template: 'Are you sure you want to Item Cart ?'
					}).then(function(add) {
						if(add) {
							ShoppingCartService.cont();
							$scope.countBadge  	= 	ShoppingCartService.cont()+1;
							ShoppingCartService.add(new_order);
						}
						$ionicListDelegate.closeOptionButtons();
					});
				}else if((new_order.price!=null) && (new_order.toopings.length>0)){
					var confirmPopup = $ionicPopup.confirm({
					title: 'Add to cart',
					template: 'Are you sure you want to Item Cart ?'
					}).then(function(add) {
						if(add) {
							ShoppingCartService.cont();
							$scope.countBadge  	= 	ShoppingCartService.cont()+1;
							ShoppingCartService.add(new_order);
						}
						$ionicListDelegate.closeOptionButtons();
					});
				}
				

			};
			$scope.setFavoriteFood = function(new_order) {

				console.log(new_order.item.favo);

				$scope.favorite = new_order.item.favo;

				$scope.favorite++;

				console.log($scope.favorite);
				var _prms	={
					'method':'upt.favorite',
					'item_id': $stateParams.itemId,
					'favorite': $scope.favorite,
					'app_ns': 'reifax.service.reward'
				};
				AjaxService.run_ajax(_prms).then(function(result){
					$scope.favorite  =	result.data.data;
				});

			};



	});

_controllers.controller('CartClientCtrl',
	function($scope, $stateParams, $ionicModal, $ionicPopup, $ionicListDelegate, $ionicActionSheet, AjaxService, ShoppingCartService) {


		$scope.cart = ShoppingCartService;


		$scope.increaseItemCount = function(item) {
			item.qty++;
		};
		$scope.decreaseItemCount = function(item) {
			if (item.qty > 1)
				item.qty--;
			else
				item.qty = 1;
		};


		$scope.showDeleteOrder = function(item) {

			var confirmPopup = $ionicPopup.confirm({
				title: 'Remove Item',
				template: 'Are you sure you want to Item Cart ?'
			 }).then(function(remove) {
			   if(remove) {
				   ShoppingCartService.deleteCart(item);

			   }
			   $ionicListDelegate.closeOptionButtons();

			 });
		};

		$scope.sumCalc = function() {
			var sum = 0;
			var mark =false;
			var market =false;
			var totalTop=0;
			var totalTop2=0;
			var total=0;
			var total1=0;
			var total2=0;
			var total3=0;
			var sizeprice=0;
			
			angular.forEach($scope.cart.listCart(), function(item, index) {
				console.log(item);
				angular.forEach(item.toopings, function(ite, ind){
					
					totalTop   = ite.sutpAmount;
					market     = ite.market;
					mark       = ite.mark;
					
					if((item.toopings.length>0)  && (item.item.pric==0) && (market==true) && (item.options.length==0)){ 
						sizeprice +=   ite.sutpAmount;
						//console.log(sizeprice);
					}
					
				});
				
				if((item.toopings.length>0)  && (item.item.pric==0) && (market==true) && (item.options.length==0)){ 
					//console.log('aqui1');
					sum     = (item.price.sizeprice * item.qty) +sizeprice;
					total1 += sum;
					console.log(total1);
					
				}else if((item.toopings.length==0) && (item.options.length==0) && (item.item.pric!=0)){
					//console.log('aqui2');
					sum = (item.item.pric * item.qty);
					total2 += sum;
					console.log(total2);
				}else if((item.toopings.length>0) && (item.item.pric==0) && (mark==true)){
					//console.log('aqui3');
					sum = (item.price.sizeprice * item.qty);
					total3+= sum;
					console.log(total3);
				}
				
				
				total =total1+total2+total3;
				
			});
			return total;
		};
		
		$scope.suma = function(items) {
			var sumar  = 0;
			var sumar2 = 0;
			var sum    = 0;
			var sum2    = 0;
			var total  = 0;
			var total1 = 0;
			var totalTop = 0;
			var mark =false;
			var market =false;
			//console.log(items);	
			
			angular.forEach(items, function(item, index) {
				
				/*angular.forEach(item.toopings, function(ite, ind){
					totalTop  += ite.sutpAmount;
					market     = ite.market;
					mark       = ite.mark;
				});*/
				
				/*if((item.toopings.length>0)  && (item.item.pric==0) &&(market==true)){ 
					sum   = (item.price.sizeprice * item.qty)+ totalTop;
					total1+= sum;
					console.log(total1);
				}else if((item.toopings.length>0)  && (item.item.pric==0) &&(mark==true)){
					sum   = (item.price.sizeprice * item.qty);
					total1+= sum;
					console.log(total1);
				}*/
				if(item.mark==true){
					sum   = (item.sizeprice);
				}
				if(item.market==true){
					sum2   += (item.sutpAmount);
					//total1 += sum2+sum;
					//console.log(sum2);
				}
				
				
				sumar=sum+sum2;
			});
			return sumar;
		};
		
		
		
		
			
		

	});

_controllers.controller('CheckoutClientCtrl',
	function($scope, $stateParams, $ionicModal, $ionicPopup, $ionicListDelegate, $ionicActionSheet, AjaxService, ShoppingCartService) {


	});
_controllers.controller('DeliveryClientCtrl',
	function($scope, $stateParams, $ionicModal, $ionicPopup, $ionicListDelegate, $ionicActionSheet, AjaxService, ShoppingCartService) {


	});
