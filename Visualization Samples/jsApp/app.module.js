'use sctrict';

var mainModule = angular.module('vis.module', [
	'ngSanitize',
	'ui.bootstrap',
	'ui-rangeSlider',
	'vis.service'
]);

mainModule.value('show', toastr);