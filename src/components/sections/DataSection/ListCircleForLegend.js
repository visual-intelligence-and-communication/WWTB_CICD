import { useEffect, useRef } from "react";
import rough from "roughjs";
import { scaleSqrt } from "d3-scale";
import { ROUGHJS_COLORS } from "@/constants/colors/colors";
import * as d3 from "d3";

const ListCircleForLegend = ({value, valueOfInstitution, maxValue}) => {

    const svg = useRef(null)
    const legendDistance = 80
    useEffect(() => {
        const diameterScale = scaleSqrt([0, maxValue], [5, 112]);
        const size = diameterScale(valueOfInstitution)

        const cDiameterScale = scaleSqrt([0, valueOfInstitution], [1, size]);
        const cSize = cDiameterScale(value)
      
        const rc = rough.svg(svg.current)
        let node = rc.circle(112/2, 112/2 + ((112/2) - (size/2)), size,{
            fill: ROUGHJS_COLORS.fill3,
            fillWeight: 1,
            strokeWidth: 1,
            stroke: ROUGHJS_COLORS.fill,
            roughness: 0.8
        });
        let lNode = rc.line(112/2 + size/2, 112/2 + ((112/2) - (size/2)), 112/2 + legendDistance, 112/2 + ((112/2) - (size/2)),{
            fillLineDashOffset: 10,
            roughness: 0.1,
            strokeWidth:0.4
        });
        // let text = 
      
        svg.current.appendChild(node)
        svg.current.appendChild(lNode)
        d3.select(svg.current)
        .append("text")
        .attr("x", 112/2 + legendDistance + 5)
        .attr("y",112/2 + ((112/2) - (size/2)))
        .attr('alignment-baseline', 'middle')
        .style("font-size", 11)
        .text(Math.floor(valueOfInstitution).toLocaleString())

    },[])

    return (
        <div className="absolute">
            <svg ref={svg}>

            </svg>
        </div>
    )
}

export default ListCircleForLegend;