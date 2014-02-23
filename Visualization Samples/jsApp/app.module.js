'use sctrict';

var mainModule = angular.module('vis.module', [
	'ngSanitize',
	'ui.bootstrap',
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
				renderer: '=',
				post: '='
			},
			template: '<div></div>',
			restrict: 'A',
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
					
					var xAxis = new Rickshaw.Graph.Axis.X({ graph: graph });
					xAxis.render();

					var yAxis = new Rickshaw.Graph.Axis.Y({ graph: graph });
					yAxis.render();
					
					graph.render();

					element[0].innerHTML += '<div id="legend"></div>';
		
					var legend = document.querySelector('#legend');
					var Hover = Rickshaw.Class.create(Rickshaw.Graph.HoverDetail, {
						render: function (args) {
							legend.innerHTML = '';
							
							args.detail.sort(function (a, b) { return a.order - b.order; }).forEach(function (d) {
								var block = document.createElement('div');
								
								var label = document.createElement('span');
								label.className = 'label';
								label.innerHTML = d.name + ": " + d.value.y;
								label.style.backgroundColor = d.series.color;

								block.appendChild(label);
								legend.appendChild(block);

								var dot = document.createElement('div');
								dot.className = 'dot';
						
								if (scope.renderer == 'bar' || scope.renderer == 'area')
									dot.style.top = graph.y(d.value.y0 + d.value.y) + 'px';
								else
									dot.style.top = graph.y(d.value.y) + 'px';
								
								dot.style.borderColor = 'white';

								this.element.appendChild(dot);

								dot.className = 'dot active';

								this.show();

							}, this);

							var u = args.points[0].value.url;
							var purl = document.createElement('span');
							purl.className = 'label lable-inverse';
							purl.innerHTML = '<a href="' + u + '" target="_blank">' + u + '</a>';
							legend.appendChild(purl);
						}
					});

					var hover = new Hover({ graph: graph });
				});
			}
		};
	});
