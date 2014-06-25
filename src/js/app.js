'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
	'ui.router'
	, 'ui.bootstrap'
	, 'myApp.filters'
	, 'myApp.services'
	, 'myApp.directives'
	, 'myApp.controllers'
]).config(function($stateProvider, $urlRouterProvider, $locationProvider)
{
	$locationProvider.html5Mode(true);

	//
	// For any unmatched url, redirect to /state1
	$urlRouterProvider.otherwise("/state1");
	//
	// Now set up the states
	$stateProvider.state('state1', {
			url: "/state1",
			templateUrl: "partials/partial1.html"
		}).state('state2', {
			url: "/state2",
			templateUrl: "partials/partial2.html"
		})
});
