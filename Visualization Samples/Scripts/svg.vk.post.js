function confetti(_owner, _data, _type, _dotconfig) {
	var dotscale = parseInt(_dotconfig.scale);
	var dist = parseInt(_dotconfig.dist);
	
	var w = 700,
		h = 500,
		nodes = [],
		dots = [];

	d3.select("svg").remove();

	var svg = d3.select("svgmain").append("svg")
		.attr("width", w)
		.attr("height", h);

	var force = d3.layout.force()
		.charge(- dist)
		.size([w, h])
		.nodes(nodes)
		.on("tick", tick)
		.start();

	function tick(e) {
		svg.selectAll("circle")
			.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; })
			.on("click", function (d) {
				dots.push(d);
				console.log(d, dots);
			});
	}
	
	function add(d) {
		var node = {
			x: w / 2 + 2 * Math.random() - 1,
			y: h / 2 + 2 * Math.random() - 1,
			likes: d.likes.count,
			comments: d.comments.count,
			reposts: d.reposts.count,
			type: d.post_type,
			url: 'http://vk.com/id' + _owner + '?w=wall' + d.from_id.toString() + '_' + d.id.toString(),
		};

		var cc = svg.append("svg:circle")
			.data([node])
			.transition()
			.duration(2000)
			.ease(Math.sqrt)
			.style("fill", function (e) { return e.type == 'post' ? "#62BFD1" : '#C97635'; })
			.attr("xlink:href", function (e) { return e.url; });

		if (_type == 'likes') cc.attr("r", function (e) { return e.likes + dotscale; });
		if (_type == 'comments') cc.attr("r", function (e) { return e.comments + dotscale; });
		if (_type == 'reposts') cc.attr("r", function (e) { return e.reposts + dotscale; });

		return node;
	}
	
	var ind = 0;
	var interval = setInterval(function () {
		var node = add(_data[ind++]);

		nodes.push(node);

		if (nodes.length > _data.length - 1) {
			clearInterval(interval);
		};
		
		force.start();
	}, 3);

	return dots;
}