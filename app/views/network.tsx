import { useD3 } from "~/utils/hooks";
import * as d3Dag from 'd3-dag';
import * as d3Origin from 'd3';
import _ from 'lodash';

const d3 = { ...d3Dag, ...d3Origin };

const nodeRadius = 20;
const data = [
  ['0|in', '1|conv3x3'],
  ['0|in', '2|conv3x3'],
  ['0|in', '3|conv3x3'],
  ['1|conv3x3', '4|conv3x3'],
  ['1|conv3x3', '5|conv3x3'],
  ['2|conv3x3', '4|conv3x3'],
  ['3|conv3x3', '6|out'],
  ['4|conv3x3', '6|out'],
  ['5|conv3x3', '6|out'],
];

const NetworkView = (): JSX.Element => {
  const [dagRef, { nodes }] = useD3(svg => {
    // Fetch data and render
    const dag = d3.dagConnect()(data);
    const { width, height } = d3.sugiyama()
      .decross(d3.decrossOpt())
      .nodeSize(node => [(node ? 3.6 : 0.25) * nodeRadius, 3 * nodeRadius])
      (dag);

    // Handles rendering
    svg.attr('viewBox', _.join([0, 0, width, height], ' '));

    const defs = svg.append('defs');
    const steps = dag.size();
    const interp = d3.interpolateRainbow;
    const colorMap = new Map();

    let i = 0;
    for (const node of dag.idescendants()) {
      colorMap.set(node.data.id, interp((i++) / steps));
    }

    // How to draw edges
    const line = d3.line()
      .curve(d3.curveCatmullRom)
      .x(d => d[0])
      .y(d => d[1]);

    // Plot edges
    svg.append('g')
      .selectAll('path')
      .data(dag.links())
      .enter()
      .append('path')
      .attr('d', ({ points }) => line(points))
      .attr('fill', 'none')
      .attr('stroke-width', 3)
      .attr("stroke", ({ source, target }) => {
        // encodeURIComponents for spaces, hope id doesn't have a `--` in it
        const gradId = encodeURIComponent(`${source.data.id}--${target.data.id}`);
        const grad = defs.append("linearGradient")
          .attr("id", gradId)
          .attr("gradientUnits", "userSpaceOnUse")
          .attr("x1", source.x as number)
          .attr("x2", target.x as number)
          .attr("y1", source.y as number)
          .attr("y2", target.y as number);
        grad.append("stop")
          .attr("offset", "0%")
          .attr("stop-color", colorMap.get(source.data.id));
        grad.append("stop")
          .attr("offset", "100%")
          .attr("stop-color", colorMap.get(target.data.id));
        return `url(#${gradId})`;
      });

    // Select nodes
    const nodes = svg.append("g")
      .selectAll("g")
      .data(dag.descendants())
      .enter()
      .append("g")
      .attr("transform", ({ x, y }) => `translate(${x}, ${y})`);

    // Plot node circles
    nodes.append("circle")
      .attr("r", nodeRadius)
      .attr("fill", n => colorMap.get(n.data.id));

    // Add text to nodes
    nodes.append("text")
      .text(d => d.data.id)
      .attr("font-weight", "bold")
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("fill", "white");

    return { nodes };
  }, []);

  return (
    <svg
      ref={dagRef}
      style={{
        height: 1000,
        width: "100%",
        marginRight: "0px",
        marginLeft: "0px",
      }}
    />
  );
};

export default NetworkView;