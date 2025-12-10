import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { NetworkNode, NetworkLink } from '../../types';
import './NetworkGraph.scss';

interface NetworkGraphProps {
  nodes: NetworkNode[];
  links: NetworkLink[];
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({ nodes, links }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800; // Increased width significantly
    const height = 600; // Increased height significantly

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [-50, -50, width + 100, height + 100]) // Zoom out slightly
      .style("max-width", "100%")
      .style("height", "auto");

    svg.selectAll("*").remove();

    // Copy data to avoid mutation issues in React strict mode
    const nodesData = nodes.map(d => ({ ...d }));
    const linksData = links.map(d => ({ ...d }));

    const simulation = d3.forceSimulation(nodesData as any)
      .force("link", d3.forceLink(linksData).id((d: any) => d.id).distance(60)) // Reduced link distance
      .force("charge", d3.forceManyBody().strength(-150)) // Reduced repulsion
      .force("center", d3.forceCenter(width / 2, height / 2)); // Reset center
      // Removed collide force to allow some overlap if needed, but charge handles it

    const link = svg.append("g")
      .attr("stroke", "#636e72") // text-muted equivalent
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(linksData)
      .join("line")
      .attr("stroke-width", (d: any) => Math.sqrt(d.value) * 1.5);

    const node = svg.append("g")
      .attr("stroke", "#2d3436") // bg-panel equivalent
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodesData)
      .join("circle")
      .attr("r", (d: any) => d.radius)
      .attr("fill", (d: any) => {
          if (d.group === 1) return "#ff7675"; // DPS - Red
          if (d.group === 2) return "#74b9ff"; // Tank - Blue
          return "#00b894"; // Healer/Misc - Green
      })
      .call(drag(simulation) as any);

    const labels = svg.append("g")
      .selectAll("text")
      .data(nodesData)
      .join("text")
      .text((d: any) => d.id)
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("fill", "#fff")
      .attr("font-size", "10px")
      .style("pointer-events", "none");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);
      
      labels
        .attr("x", (d: any) => d.x)
        .attr("y", (d: any) => d.y);
    });

    function drag(simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>) {
      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      
      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      
      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      
      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

  }, [nodes, links]);

  return (
    <div className="network-graph-container">
      <div className="svg-wrapper">
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
};
