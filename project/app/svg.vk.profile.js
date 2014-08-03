var forcedgraph = {
	divname: '',
	w: 0,
	h: 0,
	graph: { nodes: [], edges: [] },
	init: function (w, h, divname, graph) {
		this.w = w;
		this.h = h;
		this.divname = divname;
		if (typeof graph != 'undefined' && graph != null)
			this.graph = graph;

		console.log(this.w, this.h, this.divname, this.graph);
	},
	start: function (dist, raduis) {
		
		console.log(dist, raduis);
		
		var color = d3.scale.category20();

		var force = d3.layout.force()
			.linkDistance(dist)
			.linkStrength(5)
			.size([this.w, this.h]);

		d3.select('svg').remove();

		var svg = d3.select('div[' + this.divname + ']')
			.append("svg")
			.attr("width", this.w)
			.attr("height", this.h);
		
		var nodes = this.graph.nodes.slice(),
			links = [],
			bilinks = [];

		_.each(this.graph.links, function (l) {
			var s = _.filter(nodes, function (e) { if (e.uid == l.source) return e; })[0],
				t = _.filter(nodes, function (e) { if (e.uid == l.target) return e; })[0],
				i = {}; // intermediate node
			nodes.push(i);
			links.push({ source: s, target: i }, { source: i, target: t });
			bilinks.push([s, i, t]);
		});

		force
			.nodes(nodes)
			.links(links)
			.start();

		var link = svg.selectAll(".edge")
			.data(bilinks)
			.enter().append("path")
			.attr("class", "edge")
			.style("stroke", "#E9EDF1");

		var node = svg.selectAll(".node")
			.data(this.graph.nodes)
			.enter().append("circle")
			.attr("r", raduis)
			.attr("class", "node")
			.attr("stroke", "#fff")
			.style("fill", function (d) { return color(d.group); })
			.on("mouseover", mouseover)
			.on("mouseout", mouseout)
			.call(force.drag);

		node.append("title")
			.text(function (d) { return d.name; });

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

		function mouseover() {
			d3.select(this).attr("stroke", "black");
		}

		function mouseout() {
			d3.select(this).attr("stroke", "#fff");
		}
	}
};