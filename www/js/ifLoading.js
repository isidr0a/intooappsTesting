'use strict';

angular.module('httpLoading', [])
    .directive('ifLoading', function($http) {
		return {
		  restrict: 'A',
		  link: function($scope, $elem) {
			$scope.isLoading = isLoading;

			$scope.$watch($scope.isLoading, toggleElement);

			function toggleElement(loading) {
			  if (loading) {
				$elem.removeClass('hide').addClass('show');
			  } else {
				$elem.removeClass('show').addClass('hide');
			  }
			}

			function isLoading() {
			  return $http.pendingRequests.length > 0;
			}
		  }
		};
	});