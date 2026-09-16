import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useTheme } from '@mui/material';

const StoryNavigationTree = ({ currentStoryId, treeData, onStorySelect }) => {
  const svgRef = useRef();
  const containerRef = useRef();
  const theme = useTheme();

  useEffect(() => {
    if (!svgRef.current || !treeData || !containerRef.current) return;

    d3.select(svgRef.current).selectAll("*").remove();

    const containerRect = containerRef.current.getBoundingClientRect();
    const width = Math.max(350, containerRect.width);
    const height = Math.max(500, containerRect.height);
    const margin = { top: 40, right: 20, bottom: 40, left: 20 };

    const svg = d3.select(svgRef.current)
        .attr('width', width)
        .attr('height', height);

    const g = svg.append('g');

    const root = d3.hierarchy(treeData);

    const treeHeight = root.height * 100 + 100;
    const treeWidth = width - margin.left - margin.right;

    const treeLayout = d3.tree()
        .size([treeWidth, treeHeight])
        .separation((a, b) => (a.parent === b.parent ? 1 : 1.2));

    const treeNodes = treeLayout(root);

    const linkGenerator = d3.linkVertical()
        .x(d => d.x)
        .y(d => d.y);

    g.selectAll('.link')
        .data(treeNodes.links())
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', linkGenerator)
        .style('fill', 'none')
        .style('stroke', 'rgba(124, 58, 237, 0.4)')
        .style('stroke-width', '2px');

    const nodes = g.selectAll('.node')
        .data(treeNodes.descendants())
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x},${d.y})`);

    nodes.append('rect')
        .attr('width', 160)
        .attr('height', 60)
        .attr('x', -80)
        .attr('y', -30)
        .attr('rx', 8)
        .style('fill', d => {
          if (d.data.isCurrent) return 'rgba(91, 33, 182, 0.4)';
          return theme.palette.background.paper;
        })
        .style('stroke', d => {
          if (d.data.isCurrent) return '#A78BFA';
          return '#7C3AED';
        })
        .style('stroke-width', d => d.data.isCurrent ? '3px' : '2px')
        .style('cursor', d => d.data.id !== currentStoryId ? 'pointer' : 'default')
        .on('click', function(event, d) {
          if (d.data.id !== currentStoryId && onStorySelect) {
            onStorySelect(d.data.id);
          }
        })
        .on('mouseover', function(event, d) {
          if (d.data.id !== currentStoryId) {
            d3.select(this)
                .transition()
                .duration(200)
                .style('fill', 'rgba(91, 33, 182, 0.2)');
          }
        })
        .on('mouseout', function(event, d) {
          if (d.data.id !== currentStoryId) {
            d3.select(this)
                .transition()
                .duration(200)
                .style('fill', theme.palette.background.paper);
          }
        });

    nodes.append('text')
        .attr('dy', '-0.5em')
        .attr('text-anchor', 'middle')
        .text(d => {
          const title = d.data.title || 'История';
          return title.length > 20 ? title.substring(0, 20) + '...' : title;
        })
        .style('font-family', 'Roboto, sans-serif')
        .style('font-size', '13px')
        .style('font-weight', d => d.data.isCurrent ? 'bold' : 'normal')
        .style('fill', d => d.data.isCurrent ? '#A78BFA' : theme.palette.text.primary)
        .style('pointer-events', 'none');

    nodes.append('text')
        .attr('dy', '1.5em')
        .attr('text-anchor', 'middle')
        .text(d => `#${d.data.id}`)
        .style('font-size', '10px')
        .style('fill', theme.palette.text.secondary)
        .style('pointer-events', 'none');

    nodes.filter(d => d.data.relationType)
        .append('text')
        .attr('dy', '-45px')
        .attr('text-anchor', 'middle')
        .text(d => {
          if (d.data.relationType === 'parent') return '← Предыдущая';
          if (d.data.relationType === 'continuation') return '→ Продолжение';
          return '';
        })
        .style('font-size', '11px')
        .style('fill', theme.palette.text.secondary)
        .style('font-style', 'italic');

    const bounds = g.node().getBBox();
    const fullWidth = bounds.width;
    const fullHeight = bounds.height;
    const midX = bounds.x + fullWidth / 2;
    const midY = bounds.y + fullHeight / 2;

    const scale = Math.min(
        (width - margin.left - margin.right) / fullWidth,
        (height - margin.top - margin.bottom) / fullHeight,
        1
    ) * 0.9;

    g.attr('transform',
        `translate(${width / 2 - midX * scale}, ${margin.top - bounds.y * scale}) scale(${scale})`
    );

    const zoom = d3.zoom()
        .scaleExtent([0.5, 2])
        .on('zoom', (event) => {
          g.attr('transform', event.transform);
        });

    svg.call(zoom);

    const currentNode = treeNodes.descendants().find(d => d.data.isCurrent);
    if (currentNode) {
      const initialTransform = d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(scale)
          .translate(-currentNode.x, -currentNode.y + 100);

      svg.transition()
          .duration(750)
          .call(zoom.transform, initialTransform);
    }

  }, [currentStoryId, treeData, onStorySelect, theme]);

  return (
      <div
          ref={containerRef}
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            background: theme.palette.background.default,
            borderRadius: '8px'
          }}
      >
        <svg
            ref={svgRef}
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              cursor: 'grab'
            }}
        />
        <div style={{
          position: 'absolute',
          bottom: 10,
          left: 10,
          fontSize: '11px',
          color: theme.palette.text.secondary
        }}>
          Используйте колесо мыши для масштабирования
        </div>
      </div>
  );
};

export default StoryNavigationTree;