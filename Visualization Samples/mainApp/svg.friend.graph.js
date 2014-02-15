var graph = {
	w: function () { return $('div[svgfriend]').parent().width(); },
	h: 500,
	init: function (one, two, dist, raduis) {
		var graph = { links: [], nodes: [], };

		var target = { uid: one.id, name: 'target', group: 1 };
		graph.nodes.push(target);
		_.each(one.f, function (e) {
			graph.nodes.push({ uid: e.uid, name: e.last_name + ' ' + e.first_name, group: 2 });
			graph.links.push({ source: target.uid, target: e.uid, value: 1 });
		});
		
		var enemy = { uid: two.id, name: 'enemy', group: 3 };
		var m = _.filter(graph.nodes, function (n) { if (n.uid == enemy.uid) return n; }).length;
		if (m == 0) graph.nodes.push(enemy);
		
		_.each(two.f, function (e) {
			var m = _.filter(graph.nodes, function (n) { if (n.uid == e.uid) return n; }).length;
			if (m == 0) graph.nodes.push({ uid: e.uid, name: e.last_name + ' ' + e.first_name, group: 4 });
			graph.links.push({ source: enemy.uid, target: e.uid, value: 1 });
		});

		var color = d3.scale.category20();

		var force = d3.layout.force()
			.linkDistance(dist)
			.linkStrength(5)
			.size([this.w(), this.h]);

		var svg = d3.select('div[svgfriend]').append("svg")
			.attr("width", this.w())
			.attr("height", this.h);

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
			.attr("class", "link");

		var node = svg.selectAll(".node")
			.data(graph.nodes)
			.enter().append("circle")
			.attr("class", "node")
			.attr("r", raduis)
			.style("fill", function (d) { return color(d.group); })
			.call(force.drag);

		node.append("title")
			.text(function (d) { return d.name; });

		force.on("tick", function () {
			link.attr("d", function (d) {
				return "M" + d[0].x + "," + d[0].y
					+ "S" + d[1].x + "," + d[1].y
					+ " " + d[2].x + "," + d[2].y;
			});
			node.attr("transform", function (d) {
				return "translate(" + d.x + "," + d.y + ")";
			});
		});
	}
};

