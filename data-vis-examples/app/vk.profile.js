(function (G, angular, Viva, _) {
	'use strict';

	function getParameterByName(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
		return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	};

	function highlightRelatedNodes(nodeId, isOn) {
		bd.graph.forEachLinkedNode(nodeId, function (node, link) {
			var l = graphics.getLinkUI(link.id);
			if (l) {
				l.attr('stroke', isOn ? 'red' : 'gray');
			}
		});
	};

	var bd = { friends: [], bigdata: [], graph: {} };
	var owid = getParameterByName('id');
	
	function pageController(t, vk) {
		var ctrl = this,
			callTimer = 0;

		var repo = {
			data: [],
			friends: []
		};

		ctrl.ownerid = owid;
		ctrl.load = 0;
		ctrl.lock = false;
		ctrl.created = false;

		function getListIntersection(data, id) {
			var idArray = [];
			var counter = 0;
			for (var i = 0; i < data.length; i++) {
				var current = _.compact(_.map(data[i].friends, function (f) {
					if (f.uid !== id)
						return f.uid;
				}));
				for (var j = counter; j < data.length; j++) {
					if (i !== j) {
						var result = _.find(current, function (e) {
							if (e == data[j].uid) return e;
						});

						if (typeof result != 'undefined') {
							idArray.push(result);
							idArray.push(data[i].uid);
						}
					}
				}
				counter++;
			}
			return _.uniq(idArray);
		};

		ctrl.getFriends = function (id) {
			if (!_.isEmpty(id)) {
				vk.friendsGet(id, 'last_name,photo').then(function (r) {
					repo.friends = angular.copy(r);

					addToGraph(repo.friends, 'target');

					bd.friends = angular.copy(r);
				});
			}
		};

		ctrl.calcWith = function () {
			return ctrl.load / repo.friends.length * 100;
		};

		ctrl.loadData = function () {
			if (!ctrl.lock) {
				var data = _.map(repo.friends, function (r) { return { uid: r.uid, name: r.last_name + ' ' + r.first_name }; });
				_.each(data, function (f) {
					callTimer += 1000;
					t(function () {
						vk.friendsGet(f.uid, 'last_name,photo').then(function (r) {
							ctrl.load++;
							if (typeof r != 'undefined' && r.length != 0) {
								repo.data.push({ uid: f.uid, name: f.name, friends: r });
								bd.bigdata.push({ uid: f.uid, name: f.name, friends: r });
							}
						});
					}, callTimer);
				});
			}
			ctrl.lock = true;
		};

		ctrl.createGraph = function () {
			ctrl.created = true;
			var data = angular.copy(repo.data);

			var idArray = getListIntersection(data, ctrl.ownerid);
			_.each(data, function (e) {
				e.friends = _.compact(_.map(e.friends, function (f) {
					if (_.contains(idArray, f.uid))
						return f;
				}));
			});

			console.log(data);

			_.each(data, function (e) {
				_.each(e.friends, function (f) {
					bd.graph.addNode(f.uid, { img: f.photo, name: f.last_name + ' ' + f.first_name });
					bd.graph.addLink(e.uid, f.uid);
				});
			});
		};

		function addToGraph(data, owner) {
			_.each(data, function (e) {
				bd.graph.addNode(e.uid, { img: e.photo, name: e.last_name + ' ' + e.first_name });
				bd.graph.addLink(owner, e.uid);
			});
		};

		ctrl.getFriends(ctrl.ownerid);
	};
	pageController.$inject = ['$timeout', 'vkService'];

	angular
		.module('core')
		.controller('pageController', pageController);

	// INIT
	angular
		.bootstrap(document, ['core']);

	if (owid.length != 0) {
		bd.graph = Viva.Graph.graph();

		var graphics = Viva.Graph.View.svgGraphics();

		graphics.node(function (node) {
			var ui =
				Viva
					.Graph
					.svg('image')
					.attr('width', 24)
					.attr('height', 24)
					.link(node.data.img);

			ui.append('title').text(node.data.name);

			$(ui).hover(function () {
				highlightRelatedNodes(node.id, true);
			}, function () {
				highlightRelatedNodes(node.id, false);
			});

			return ui;
		});

		graphics.placeNode(function (nodeUI, pos) {
			nodeUI.attr('x', pos.x - 12).attr('y', pos.y - 12);
		});

		bd.graph.addNode('target', { img: 'styles/target.png', name: 'target' });

		Viva.Graph.View.renderer(bd.graph, {
			graphics: graphics,
			container: document.getElementById('vivaContainer')
		}).run();
	}

})(this, angular, Viva, _);