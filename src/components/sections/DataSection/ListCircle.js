import { useEffect, useRef } from "react";
import rough from "roughjs";
import { scaleSqrt } from "d3-scale";
import { ROUGHJS_COLORS } from "@/constants/colors/colors";
const ListCircle = ({value, valueOfInstitution, maxValue}) => {

    const svg = useRef(null)

    useEffect(() => {
        const diameterScale = scaleSqrt([0, maxValue], [5, 112]);
        const size = diameterScale(valueOfInstitution)

        const cDiameterScale = scaleSqrt([0, valueOfInstitution], [1, size]);
        const cSize = cDiameterScale(value)
      
        const rc = rough.svg(svg.current)
        let node = rc.circle(112/2, 112/2, size,{
            fill: ROUGHJS_COLORS.fill,
            fillWeight: 1,
            strokeWidth: 1,
            stroke: ROUGHJS_COLORS.fill
        });
        let cNode = rc.circle(112/2, 112/2, cSize,{
            fill: ROUGHJS_COLORS.acc,
            fillWeight: 2.5,
            strokeWidth: 1,
            // stroke: "yellow"
        });
        svg.current.appendChild(node)
        svg.current.appendChild(cNode)
      

    },[])

    return (
        <div>
            <svg ref={svg}>

            </svg>
        </div>
    )
}

export default ListCircle;