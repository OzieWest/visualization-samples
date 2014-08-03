(function (G, angular, d3, _) {
	'use strict';

	function getParameterByName(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
		return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	};

	var confetti = {
		init: function (_scope) {
			var userId = _scope.profile.current.user_id;
			var posttype = _scope.profile.posttype;
			var low = _scope.profile.dotconfig.low;
			var high = _scope.profile.dotconfig.high;

			function check(_node) {
				if (_node[posttype].count >= low && _node[posttype].count < high) {
					return _node;
				}
			};

			function tick(e) {
				svg
					.selectAll("circle")
					.attr("cx", function (d) { return d.x; })
					.attr("cy", function (d) { return d.y; })
					.on("click", addDot)
					.on("mouseover", function (d, i) {
						d3
							.select(this)
							.attr({ fill: 'green !important' })
							.style({ cursor: 'pointer' });

						svg
							.append("text")
							.attr({
								id: 't' + d.postid,
								x: function () { return d.x; },
								y: function () { return d.y - (d.val() + dotscale + 10); }
							})
							.text(function () { return d.val(); });
					})
					.on("mouseout", function (d, i) {
						d3.select('#t' + d.postid).remove();
					});
			};

			function getValueByType(_node) {
				return _node[_scope.profile.posttype].count;
			};

			function addDot(_dot) {
				var count = _.filter(_scope.profile.dots, function (e) {
					if (e.postid == _dot.postid) return e;
				}).length;

				if (count == 0) {
					_scope.profile.dots.push({
						url: _dot.url,
						val: _dot.val(),
						type: posttype,
						postid: _dot.postid,
					});

					_scope.$apply();
				}

				G.open(_dot.url, '_blank');
			};

			function addNode(d) {
				var node = {
					x: w / 2 + 2 * Math.random() - 1,
					y: h / 2 + 2 * Math.random() - 1,
					val: function () { return getValueByType(d); },
					type: d.post_type,
					postid: userId + '_' + d.id,
					url: 'http://vk.com/id' + userId + '?w=wall' + userId + '_' + d.id
				};

				svg.append("svg:circle")
					.data([node])
					.transition()
					.duration(2000)
					.ease(Math.sqrt)
					.attr("class", function (e) { return e.type; })
					.attr("xlink:href", function (e) { return e.url; })
					.attr("r", function (e) { return e.val() + dotscale; });

				return node;
			};

			var data = function () {
				return _.filter(_scope.profile.posts, check);
			};

			d3.select("svg[name='posts'] ").remove();

			if (data().length != 0) {
				var dotscale = parseInt(_scope.profile.dotconfig.scale);
				var dist = parseInt(_scope.profile.dotconfig.dist);

				var w = $('div[svgposts]').parent().width(),
					h = 600,
					nodes = [];

				var svg =
						d3
						.select('div[svgposts]')
						.append("svg")
						.attr("width", w)
						.attr("height", h)
						.attr("name", 'posts');

				var force =
						d3
						.layout
						.force()
						.charge(-dist)
						.size([w, h])
						.nodes(nodes)
						.on("tick", tick)
						.start();

				var ind = 0;
				var interval = setInterval(function () {

					nodes.push(addNode(data()[ind++]));

					if (nodes.length > data().length - 1) clearInterval(interval);

					force.start();
				}, 3);
			}
		}
	};

	// Controller --------------------------------------------------------------------------
	function pageController($timeout, vkService) {
		var ctrl = this;

		ctrl.vk_id = getParameterByName('id');
		ctrl.conf = { isBusy: true };

		var profile = {};
		ctrl.postname = { val: 'test' };

		ctrl.posts = [];

		function wallGet() {
			vkService.wallGet(ctrl.v.selected.uid, 0, 100, 1, 1).then(function (r) {
				var d = _.filter(r, function (e) { if (!_.isEmpty(e)) return e; });
				ctrl.posts = angular.copy(d);

				ctrl.allInOneGraph();
				ctrl.conf.isBusy = false;
			});
		};

		function getProfile(id) {
			return vkService.usersGet(id).then(function (u) {
				ctrl.profile = angular.copy(u[0]);
			});
		};

		/* Загружает список постов по ID пользователя */
		ctrl.loadPosts = function () {
			if (!_.isEmpty(ctrl.profile)) {
				ctrl.conf.isBusy = true;
				wallGet();
			}
		};

		/* Удаление постов */
		ctrl.clearPosts = function () { ctrl.posts = []; };

		/* Удаление точек */
		ctrl.clearDots = function () { ctrl.profile.dots = []; };

		/* Возвращает количество постов по типу параметра */
		ctrl.countPost = function (_type) {
			return _.filter(ctrl.posts, function (e) {
				if (e.post_type == _type)
					return e;
			});
		};

		/* FRIENDS */
		ctrl.v = {
			friends: [],
			selected: {}
		};

		ctrl.getFriends = function (id) {
			if (id) {
				ctrl.conf.isBusy = true;

				getProfile(id).then(function (u) {
					vkService.friendsGet(id, 'last_name').then(function (r) {
						ctrl.v.friends = angular.copy(r);

						ctrl.profile.online = 0;
						ctrl.profile.user_id = ctrl.profile.uid;
						ctrl.v.friends.push(ctrl.profile);

						ctrl.conf.isBusy = false;
					});
				});
			}
		};

		ctrl.graph = {
			showLikes: true,
			showComments: true,
			showReposts: true,
			renderers: ['line', 'bar', 'scatterplot', 'area'],
			renderer: 'line',
			color: '#4ab0ce',
			data: [{ data: [{ x: 0, y: 0 }], color: 'blue' }],
			w: function () {
				return $('#ctrlzone').parent().width();
			},
			h: function () { return 500; }
		};

		ctrl.createGraph = function (prop) {
			ctrl.graph.data = [
				{
					color: "#6EA6DA",
					data: getPosts(prop),
					name: prop
				}
			];
		};

		function getPosts(type, ignore) {
			return _.compact(_.map(ctrl.posts, function (e, i) {

				if (typeof ignore != 'undefined' && ignore != null && ignore != 0) {
					if (e[type].count < ignore)
						return null;
				}

				return {
					x: i,
					y: e[type].count,
					url: 'http://vk.com/id' + ctrl.v.selected.uid + '?w=wall' + ctrl.v.selected.uid + '_' + e.id,
					ptype: e.post_type
				};
			}));
		};

		ctrl.allInOneGraph = function () {
			ctrl.graph.data = [];

			if (ctrl.graph.showLikes) {
				ctrl.graph.data.push({
					color: "orange",
					data: getPosts('likes', 0),
					name: 'likes'
				});
			}

			if (ctrl.graph.showComments) {
				ctrl.graph.data.push({
					color: "#4ab0ce",
					data: getPosts('comments', 0),
					name: 'comments'
				});
			}

			if (ctrl.graph.showReposts) {
				ctrl.graph.data.push({
					color: "#91DF97",
					data: getPosts('reposts', 0),
					name: 'reposts'
				});
			}
		};

		/* INIT */
		ctrl.getFriends(ctrl.vk_id);
	};

	angular
		.module('core')
		.controller('pageController', pageController);

	// INIT
	angular
		.bootstrap(document, ['core']);

})(this, angular, d3, _);



