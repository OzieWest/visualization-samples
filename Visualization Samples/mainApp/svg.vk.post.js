'use sctrict';

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
		}

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

			var svg = d3.select('div[svgposts]').append("svg")
				.attr("width", w)
				.attr("height", h)
				.attr("name", 'posts');

			var force = d3.layout.force()
				.charge(-dist)
				.size([w, h])
				.nodes(nodes)
				.on("tick", tick)
				.start();

			function tick(e) {
				svg.selectAll("circle")
					.attr("cx", function (d) { return d.x; })
					.attr("cy", function (d) { return d.y; })
					.on("click", addDot)
					.on("mouseover", function (d, i) {
						d3.select(this)
							.attr({
								fill: 'green !important'
							})
							.style({
								cursor: 'pointer'
							});
						
						svg.append("text")
							.attr({
								id: 't' + d.postid,
								x: function () { return d.x; },
								y: function () { return d.y - (d.val() + dotscale + 10); }
							})
							.text(function() {
								return d.val();
							});
					})
					.on("mouseout", function (d, i) {
						d3.select('#t' + d.postid).remove();
					});
			}

			function getValueByType(_node) {
				return _node[_scope.profile.posttype].count;
			}

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

				window.open(_dot.url, '_blank');
			}

			/* Добавление новой точки */
			function addNode(d) {
				var node = {
					x: w / 2 + 2 * Math.random() - 1,
					y: h / 2 + 2 * Math.random() - 1,
					val: function() { return getValueByType(d); },
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
			}

			var ind = 0;
			var interval = setInterval(function () {

				nodes.push(addNode(data()[ind++]));

				if (nodes.length > data().length - 1) clearInterval(interval);

				force.start();
			}, 3);
		}
	}
}