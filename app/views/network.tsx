import { useD3 } from '~/utils/hooks';
import * as d3Dag from 'd3-dag';
import * as d3Origin from 'd3';
import _ from 'lodash';

const d3 = { ...d3Dag, ...d3Origin };

interface NetworkData {
  nodes: string[],
  edges: [number, number][]
}

const nodeWidth = 48;
const nodeHeight = 16;
const data: NetworkData = {
  nodes: ['in', 'conv3x3', 'conv3x3', 'conv3x3', 'conv3x3', 'conv3x3', 'conv3x3', 'out'],
  edges: [
    [0, 1], [0, 2], [0, 3], [1, 4], [1, 5],
    [2, 6], [4, 6], [3, 7], [5, 7], [6 ,7]
  ],
};

const NetworkView = (): JSX.Element => {
  const [dagRef, { nodes }] = useD3(svg => {
    const dag = d3.dagConnect()
      (_.map(data.edges, d => ({ 0: `${d[0]}`, 1: `${d[1]}` })));
    const { width, height } = d3.sugiyama()
      .decross(d3.decrossOpt())
      .nodeSize(() => [1.5 * nodeWidth, 2 * nodeHeight])
      (dag);

    svg.attr('viewBox', _.join([0, 0, width, height], ' '));

    const defs = svg.append('defs');
    const steps = dag.size();
    const color = (id: string) => d3.interpolateRainbow(_.toNumber(id) / steps);
    const line = d3.line()
      .curve(d3.curveMonotoneY)
      .x(d => d[0])
      .y(d => d[1]);

    svg.append('g')
      .selectAll('path')
      .data(dag.links())
      .enter()
      .append('path')
      .attr('d', ({ points }) => line(_.map(points, p => [p.x, p.y])))
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('stroke', ({ source, target }) => {
        const gradId = `${source.data.id}~${target.data.id}`;
        const grad = defs.append('linearGradient')
          .attr('id', gradId)
          .attr('gradientUnits', 'userSpaceOnUse')
          .attr('x1', source.x as number)
          .attr('x2', target.x as number)
          .attr('y1', source.y as number)
          .attr('y2', target.y as number);
        grad.append('stop')
          .attr('offset', '0%')
          .attr('stop-color', color(source.data.id));
        grad.append('stop')
          .attr('offset', '100%')
          .attr('stop-color', color(target.data.id));
        return `url(#${gradId})`;
      });

    const nodes = svg.append('g')
      .selectAll('g')
      .data(dag.descendants())
      .enter()
      .append('g')
      .attr('transform', ({ x, y }) => `translate(${x}, ${y})`);

    nodes.append('rect')
      .attr('stroke-width', 2)
      .attr('width', nodeWidth)
      .attr('height', nodeHeight)
      .attr('rx', 3)
      .attr('ry', 3)
      .attr('fill', '#FFFFFF')
      .attr('stroke', n => color(n.data.id))
      .attr('transform', `translate(-${nodeWidth / 2}, -${nodeHeight / 2})`);

    nodes.append('text')
      .text(d => data.nodes[_.toNumber(d.data.id)])
      .attr('font-size', '0.8rem')
      .attr('font-family', 'Lato')
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('fill', ({ data }) => color(data.id));

    return { nodes };
  }, []);

  return (
    <svg
      ref={dagRef}
      style={{
        height: 1000,
        width: '100%',
        marginRight: '0px',
        marginLeft: '0px',
      }}
    />
  );
};

export default NetworkView;