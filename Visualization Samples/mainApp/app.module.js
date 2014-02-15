'use sctrict';

var mainModule = angular.module('vis.module', [
	'ui.bootstrap',
	'ui-rangeSlider',
	'vis.service'
]);

mainModule.value('show', toastr);