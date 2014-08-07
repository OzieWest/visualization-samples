var pageIndex;
(function (pageIndex) {
    var Controller = (function () {
        function Controller() {
            this.message = {
                source: 'Data Driven Documents is a JavaScript library for manipulating documents based on data',
                words: []
            };

            this.splitMessage();
        }
        Controller.prototype.createNode = function (name) {
            return {
                name: name,
                value: 1,
                type: 'black',
                level: 'red',
                children: []
            };
        };

        Controller.prototype.rebuildTree = function () {
            var that = this;
            this.root = that.createNode('root');
            if (this.message.source) {
                _.each(this.message.words, function (word) {
                    _.each(word, function (letter, index) {
                        if (index == 0)
                            that.currentNode = that.root;
                        that.checkNode(letter);
                    });
                });
            }
        };

        Controller.prototype.checkNode = function (letter) {
            var that = this;
            _.each(this.currentNode.children, function (node) {
                if (letter == node.name) {
                    node.value += 1;
                    that.currentNode = node;
                    return;
                }
            });

            var newNode = this.createNode(letter);
            this.currentNode.children.push(newNode);
            this.currentNode = newNode;
        };

        Controller.prototype.splitMessage = function () {
            this.message.words = this.message.source.toLowerCase().replace(/[^A-Za-zА-Яа-яё\s]+/g, "").replace(/\s+/, " ").split(' ');

            this.rebuildTree();
            this.svgTree(this.root);
        };

        /* D3 ------------------------------------------------ */
        Controller.prototype.svgTree = function (root) {
            var nodeSize = function (param) {
                return param * 4;
            };

            var margin, width, height, tree, diagonal, svg;

            margin = { top: 20, right: 120, bottom: 20, left: 120 }, width = 900 - margin.right - margin.left, height = 600 - margin.top - margin.bottom;

            d3.select("svg").remove();

            tree = d3.layout.tree().size([height, width]);

            svg = d3.selectAll("div.svg").append("svg").attr("style", "width: 100%; height: 600px;").append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            diagonal = d3.svg.diagonal().projection(function (d) {
                return [d.y, d.x];
            });

            var i = 0, nodes = tree.nodes(root).reverse(), links = tree.links(nodes);

            nodes.forEach(function (d) {
                d.y = d.depth * 60;
            });

            var node = svg.selectAll("g.node").data(nodes, function (d) {
                return d.id || (d.id = ++i);
            });

            var nodeEnter = node.enter().append("g").attr("class", "node").attr("transform", function (d) {
                return "translate(" + d.y + "," + d.x + ")";
            });

            nodeEnter.append("circle").attr("r", function (d) {
                return nodeSize(d.value);
            }).style("fill", "#fff");

            nodeEnter.append("text").attr("y", function (d) {
                return -1 * (nodeSize(d.value) + 10);
            }).attr("dy", ".40em").attr("text-anchor", function (d) {
                return d.children || d._children ? "end" : "start";
            }).text(function (d) {
                return d.name.toUpperCase();
            }).style("fill-opacity", 1);

            var link = svg.selectAll("path.link").data(links, function (d) {
                return d.target.id;
            });

            link.enter().insert("path", "g").attr("class", "link").attr("d", diagonal);
        };
        return Controller;
    })();
    pageIndex.Controller = Controller;
})(pageIndex || (pageIndex = {}));
//# sourceMappingURL=index.js.map
