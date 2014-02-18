var graph = {
	w: function () {
		return $('div[svgfriend]').parent().width(); },
	h: 1500,
	init: function (uid, data, dist, raduis) {

		function isExist(uid) {
			var r = _.filter(graph.nodes, function (n) {
				if (n.uid == uid) return n;
			});

			if (r.length != 0) return true;
			else return false;
		}

		var graph = { links: [], nodes: [], };

		var target = { uid: uid, name: 'target', group: 1 };
		graph.nodes.push(target);

		var group = 1;
		_.each(data, function (e) {
			group++;
			var p = { uid: e.uid, name: e.name, group: group };
			if (!isExist(p.uid)) graph.nodes.push(p);
			_.each(e.friends, function (f) {
				var node = { uid: f.uid, name: f.last_name + ' ' + f.first_name, group: group };
				if (!isExist(node.uid)) graph.nodes.push(node);
				graph.links.push({ source: p.uid, target: node.uid, value: 1, group: group});
			});
		});

		var color = d3.scale.category20();

		var force = d3.layout.force()
			.linkDistance(dist)
			.linkStrength(5)
			.size([this.w(), this.h]);

		var svg = d3.select('div[svgfriend]').append("svg")
			.attr("width", this.w())
			.attr("height", this.h);

		localforage.setItem('graph', graph);
		this.create(graph, color, force, svg, raduis);
	},
	create: function (graph, color, force, svg, raduis) {
		var nodes = graph.nodes.slice(),
			links = [],
			bilinks = [];

		graph.links.forEach(function (link) {
			var s = _.filter(nodes, function (e) { if (e.uid == link.source) return e; })[0],
				t = _.filter(nodes, function (e) { if (e.uid == link.target) return e; })[0],
				i = {}; // intermediate node
			nodes.push(i);
			links.push({ source: s, target: i }, { source: i, target: t });
			bilinks.push([s, i, t]);
		});

		force
			.nodes(nodes)
			.links(links)
			.start();

		var link = svg.selectAll(".link")
			.data(bilinks)
			.enter().append("path")
			.attr("class", "link")
			.style("stroke", function(d) { return color(d.group); });

		var node = svg.selectAll(".node")
			.data(graph.nodes)
			.enter().append("circle")
			.attr("class", "node")
			.attr("r", raduis)
			.style("fill", function(d) { return color(d.group); });

		node.append("title").text(function (d) { return d.name; });

		force.on("tick", function () {
			node.attr("transform", function (d) {
				return "translate(" + d.x + "," + d.y + ")";
			});
			
			link.attr("d", function (d) {
				return "M" + d[0].x + "," + d[0].y
					+ "S" + d[1].x + "," + d[1].y
					+ " " + d[2].x + "," + d[2].y;
			});;
		});
	}
};

