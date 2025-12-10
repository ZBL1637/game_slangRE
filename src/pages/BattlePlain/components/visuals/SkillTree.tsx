import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { SlangNode } from '../../types';
import './SkillTree.scss';

interface SkillTreeProps {
  data: SlangNode;
}

export const SkillTree: React.FC<SkillTreeProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<SlangNode | null>(null);

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current) return;

    const width = 800;
    const height = 800;
    const radius = width / 2;

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .style("font", "12px sans-serif")
      .style("user-select", "none");

    svg.selectAll("*").remove();

    const tree = d3.cluster<SlangNode>().size([2 * Math.PI, radius - 100]);

    const root = d3.hierarchy<SlangNode>(data).sort((a, b) => d3.ascending(a.data.name, b.data.name));
    tree(root);

    const linkGenerator = d3.linkRadial<d3.HierarchyPointNode<SlangNode>, d3.HierarchyPointNode<SlangNode>>()
      .angle(d => d.x)
      .radius(d => d.y);

    // Links
    svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#475569") // Slate-600
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
      .selectAll("path")
      .data(root.links())
      .join("path")
      .attr("d", d => linkGenerator(d)!);

    // Nodes
    const node = svg.append("g")
      .selectAll("g")
      .data(root.descendants())
      .join("g")
      .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`);

    node.append("circle")
      .attr("fill", d => d.children ? "#00b894" : "#b2bec3") // Primary Green / Text Muted
      .attr("r", d => d.children ? 4 : 3)
      .attr("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this).attr("r", 6).attr("fill", "#fdcb6e"); // Accent Gold
        if(d.data.description) {
            setSelectedNode(d.data);
        }
      })
      .on("mouseout", function(event, d) {
        d3.select(this).attr("r", d.children ? 4 : 3).attr("fill", d.children ? "#00b894" : "#b2bec3");
      });

    node.append("text")
      .attr("dy", "0.31em")
      .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
      .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
      .attr("transform", d => d.x >= Math.PI ? "rotate(180)" : null)
      .text(d => d.data.name)
      .attr("fill", d => d.depth === 0 ? "#fff" : d.depth === 1 ? "#55efc4" : "#dfe6e9") // White / Light Green / Text Main
      .attr("font-weight", "bold")
      .style("font-size", d => d.depth === 0 ? "24px" : d.depth === 1 ? "18px" : "16px")
      .clone(true).lower()
      .attr("stroke", "#1a1b26") // Bg Dark
      .attr("stroke-width", 3);

  }, [data]);

  return (
    <div className="skill-tree-container" ref={wrapperRef}>
      <div className="svg-wrapper">
        <svg ref={svgRef} className="w-full h-full"></svg>
      </div>
      
      {/* Tooltip Card */}
      <div className="tooltip-card">
        {selectedNode ? (
          <>
            <h3>{selectedNode.name}</h3>
            <p>{selectedNode.description}</p>
          </>
        ) : (
          <p className="placeholder">鼠标悬停/点击节点查看术语详解</p>
        )}
      </div>
    </div>
  );
};
