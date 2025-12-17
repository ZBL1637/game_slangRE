import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { SlangNode } from '../../types';

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

    const root = d3.hierarchy<SlangNode>(data);
    tree(root);

    const linkGenerator = d3.linkRadial<d3.HierarchyPointNode<SlangNode>, d3.HierarchyPointNode<SlangNode>>()
      .angle(d => d.x)
      .radius(d => d.y);

    // Links
    svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#475569")
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
      .attr("fill", d => d.children ? "#0ea5e9" : "#a8a29e")
      .attr("r", d => d.children ? 4 : 3)
      .attr("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this).attr("r", 6).attr("fill", "#22d3ee");
        if(d.data.description) {
            setSelectedNode(d.data);
        }
      })
      .on("mouseout", function(event, d) {
        d3.select(this).attr("r", d.children ? 4 : 3).attr("fill", d.children ? "#0ea5e9" : "#a8a29e");
        // Don't clear immediately to allow reading
      });

    node.append("text")
      .attr("dy", "0.31em")
      .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
      .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
      .attr("transform", d => d.x >= Math.PI ? "rotate(180)" : null)
      .text(d => d.data.name)
      .attr("fill", d => d.depth === 0 ? "#fff" : d.depth === 1 ? "#38bdf8" : "#94a3b8")
      .attr("font-weight", d => d.depth === 0 ? "bold" : "normal")
      .style("font-size", d => d.depth === 0 ? "16px" : d.depth === 1 ? "14px" : "12px")
      .clone(true).lower()
      .attr("stroke", "#0f172a")
      .attr("stroke-width", 3);

  }, [data]);

  return (
    <div className="flex flex-col items-center relative" ref={wrapperRef}>
      <div className="w-full max-w-[600px] aspect-square overflow-hidden bg-slate-900/50 rounded-full border border-slate-700 shadow-2xl shadow-cyan-900/20">
        <svg ref={svgRef} className="w-full h-full"></svg>
      </div>
      
      {/* Tooltip Card */}
      <div className="h-24 mt-4 w-full max-w-md bg-slate-800/80 backdrop-blur-sm border border-slate-600 p-4 rounded-lg text-center transition-all duration-300">
        {selectedNode ? (
          <>
            <h3 className="text-cyan-400 font-bold text-lg mb-1">{selectedNode.name}</h3>
            <p className="text-slate-200 text-sm">{selectedNode.description}</p>
          </>
        ) : (
          <p className="text-slate-500 italic mt-6">鼠标悬停/点击节点查看术语详解</p>
        )}
      </div>
    </div>
  );
};