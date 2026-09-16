import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useTheme } from '@mui/material';

const StoryTree = ({ data }) => {
  const svgRef = useRef();
  const theme = useTheme();

  const sampleData = {
    name: "Начало истории",
    children: [
      {
        name: "Глава 1",
        children: [
          { name: "Вариант 1.1", votes: 5 },
          { name: "Вариант 1.2", votes: 3 }
        ]
      },
      {
        name: "Глава 2",
        children: [
          { name: "Вариант 2.1", votes: 7 },
          { name: "Вариант 2.2", votes: 2 }
        ]
      }
    ]
  };

  useEffect(() => {
    if (!svgRef.current) return;

    d3.select(svgRef.current).selectAll("*").remove();

    const width = 800;
    const height = 600;
    const margin = { top: 20, right: 90, bottom: 30, left: 90 };

    const svg = d3.select(svgRef.current)
        .attr('width', width)
        .attr('height', height)
        .style('background', theme.palette.background.paper);

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const hierarchy = d3.hierarchy(data || sampleData);

    const treeLayout = d3.tree()
        .size([height - margin.top - margin.bottom, width - margin.left - margin.right]);

    const treeData = treeLayout(hierarchy);

    g.selectAll('.link')
        .data(treeData.links())
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x))
        .style('fill', 'none')
        .style('stroke', 'rgba(124, 58, 237, 0.4)')
        .style('stroke-width', '2px');

    const nodes = g.selectAll('.node')
        .data(treeData.descendants())
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.y},${d.x})`);

    nodes.append('circle')
        .attr('r', 10)
        .style('fill', theme.palette.background.paper)
        .style('stroke', '#7C3AED')
        .style('stroke-width', '2px')
        .style('cursor', 'pointer')
        .on('mouseover', function() {
          d3.select(this)
              .transition()
              .duration(300)
              .style('fill', 'rgba(91, 33, 182, 0.3)');
        })
        .on('mouseout', function() {
          d3.select(this)
              .transition()
              .duration(300)
              .style('fill', theme.palette.background.paper);
        });

    nodes.append('text')
        .attr('dy', '.35em')
        .attr('x', d => d.children ? -13 : 13)
        .style('text-anchor', d => d.children ? 'end' : 'start')
        .text(d => d.data.name)
        .style('font-family', 'Roboto, sans-serif')
        .style('font-size', '12px')
        .style('fill', theme.palette.text.primary)
        .style('cursor', 'pointer');

    nodes.filter(d => d.data.votes)
        .append('text')
        .attr('dy', '1.5em')
        .attr('x', 13)
        .style('text-anchor', 'start')
        .text(d => `Голоса: ${d.data.votes}`)
        .style('font-size', '10px')
        .style('fill', theme.palette.text.secondary);

  }, [data, theme]);

  return (
      <div className="story-tree-container" style={{
        overflow: 'auto',
        background: theme.palette.background.paper,
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '100%',
        height: '100%'
      }}>
        <svg ref={svgRef} style={{ width: '100%', height: '100%' }}></svg>
      </div>
  );
};

export default StoryTree;