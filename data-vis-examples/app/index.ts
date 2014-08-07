module pageIndex {

    export interface IMessage {
        source: string;
        words: Array<string>;
    }

    export interface INode {
        name: string;
        value: number;
        type: string;
        level: string
        children: Array<INode>;
    }

    export class Controller {
        root: INode;
        currentNode: INode;
        message: IMessage;

        constructor() {
            this.message = {
                source: 'Data Driven Documents is a JavaScript library for manipulating documents based on data',
                words: []
            }

            this.splitMessage();
        }

        createNode(name: string): INode {
            return {
                name: name,
                value: 1,
                type: 'black',
                level: 'red',
                children: []
            };
        }

        rebuildTree(): void {
            var that = this;
            this.root = that.createNode('root');
            if (this.message.source) {
                _.each(this.message.words, (word: string) => {
                    _.each(word, (letter: string, index: number) => {
                        if (index == 0)
                            that.currentNode = that.root;
                        that.checkNode(letter);
                    });
                });
            }
        }

        checkNode(letter: string): void {
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
        }

        splitMessage(): void {
            this.message.words =
            this.message.source
                .toLowerCase()
                .replace(/[^A-Za-zА-Яа-яё\s]+/g, "")
                .replace(/\s+/, " ")
                .split(' ');

            this.rebuildTree();
            this.svgTree(this.root);
        }

        /* D3 ------------------------------------------------ */
        svgTree(root): void {
            var nodeSize = (param: number): number => { return param * 4; };

            var margin, width, height, tree, diagonal, svg;

            margin = { top: 20, right: 120, bottom: 20, left: 120 },
            width = 900 - margin.right - margin.left,
            height = 600 - margin.top - margin.bottom;

            d3.select("svg").remove();

            tree = d3.layout.tree().size([height, width]);

            svg = d3
                .selectAll("div.svg")
                .append("svg")
                .attr("style", "width: 100%; height: 600px;")
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            diagonal = d3
                .svg
                .diagonal()
                .projection((d) => { return [d.y, d.x]; });

            var i = 0,
                nodes = tree.nodes(root).reverse(),
                links = tree.links(nodes);

            nodes.forEach((d) => { d.y = d.depth * 60; });

            var node = svg
                .selectAll("g.node")
                .data(nodes, (d) => { return d.id || (d.id = ++i); });

            var nodeEnter = node
                .enter()
                .append("g")
                .attr("class", "node")
                .attr("transform", (d) => { return "translate(" + d.y + "," + d.x + ")"; });

            nodeEnter
                .append("circle")
                .attr("r", (d) => { return nodeSize(d.value); })
                .style("fill", "#fff");

            nodeEnter
                .append("text")
                .attr("y", (d) => { return -1 * (nodeSize(d.value) + 10); })
                .attr("dy", ".40em")
                .attr("text-anchor", (d) => { return d.children || d._children ? "end" : "start"; })
                .text((d) => { return d.name.toUpperCase(); })
                .style("fill-opacity", 1);

            var link = svg
                .selectAll("path.link")
                .data(links, (d) => { return d.target.id; });

            link
                .enter()
                .insert("path", "g")
                .attr("class", "link")
                .attr("d", diagonal);
        }
    }
}