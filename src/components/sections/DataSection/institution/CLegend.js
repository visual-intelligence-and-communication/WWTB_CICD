import { useEffect, useRef } from "react";
import rough from "roughjs";
import * as d3 from "d3";
import { ROUGHJS_COLORS } from "@/constants/colors/colors";
const CLegend = () => {
  const svgRef = useRef(null);
 
  const legendData = [
    {
        name: "Country",
        color: ROUGHJS_COLORS.acc2,
    },
    {
        name: "Region",
        color: ROUGHJS_COLORS.acc3,
    },
    {
        name: "Ancestry",
        color: ROUGHJS_COLORS.acc4,
    },
    // {
    //     name: "selected",
    //     color: ROUGHJS_COLORS.acc,
    // },
  ]
  useEffect(() => {
   
   
    const svg = d3.select(svgRef.current);
    const size = {
        width: svgRef.current.clientWidth,
        height: svgRef.current.clientHeight
    }
    
    const rc = rough.svg(svg.node());
    const gap = (size.width * 0.7)/(legendData.length - 1)
    const mo = (size.width - (gap * (legendData.length - 1)))/2

    // circle
    svg
    .append("g")
    .selectAll("g")
    .data(legendData)
    .join("g")
    .attr("transform", function(d,i){
        
        return `translate(${(gap * (i)) + mo}, ${size.height/2})`
    })
    .append(function(d,i){
        const style = {
            stroke: ROUGHJS_COLORS.fill,
            strokeWidth: 0.3,
            fillWeight: 0.2,
            fill: legendData[i].color,
            roughness: 0.2
            // fillStyle: "solid",
        }
        return rc.circle(0,0, 20, style);
    })
    // text
    svg
    .append("g")
    .selectAll("g")
    .data(legendData)
    .join("g")
    .attr("transform", function(d,i){
        
        return `translate(${(gap * (i)) + mo}, ${size.height/2 + 24})`
    })
    .append("text")
    .style("font-size", "12px")
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .style("user-select", "none")
    .text(function(d,i){
        return d.name
    }

    )
   
    

  },[])


  return (
    <>
      <svg ref={svgRef} className="w-full h-20">
        
      </svg>
    </>
  );
};

export default CLegend;
