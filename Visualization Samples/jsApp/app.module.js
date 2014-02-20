'use sctrict';

var mainModule = angular.module('vis.module', [
	'ngSanitize',
	'ui.bootstrap',
	'ui-rangeSlider',
	'vis.service',
	'vis.directives'
]);

angular.module('vis.directives', [])
	.directive('myChart', function () {
		return {
			scope: {
				data: '=',
				color: '=',
				w: '=',
				h: '=',
				renderer: '='
			},
			template: '<div></div>',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
				scope.$watchCollection('[data, renderer]', function (newVal, oldVal) {
					if (!newVal[0]) {
						return;
					}
					element[0].innerHTML = '';

					var graph = new Rickshaw.Graph({
						element: element[0],
						width: scope.w,
						height: scope.h,
						series: scope.data,
						renderer: scope.renderer
					});
					
					var xAxis = new Rickshaw.Graph.Axis.X({ graph: graph});
					xAxis.render();

					var yAxis = new Rickshaw.Graph.Axis.Y({ graph: graph });
					yAxis.render();
					
					graph.render();
					
					var a = new Rickshaw.Graph.HoverDetail({
						graph: graph,
						formatter: function (series, x, y) {
							var date = '<span class="date">' + new Date(x * 1000).toUTCString() + '</span>';
							var swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';
							var content = swatch + series.name + ": " + parseInt(y) + '<br>' + date;
							return content;
						}
					});
				});
			}
		};
	});


mainModule.value('show', toastr);
