import { useEffect, useRef } from "react";
import rough from "roughjs";

const LandingCircle = ({ size }) => {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  useEffect(() => {
    containerRef.current.style.width = `${size}px`;
    containerRef.current.style.height = `${size}px`;
    svgRef.current.style.width = `${size}px`;
    svgRef.current.style.height = `${size}px`;
    const padding = 20
    const rc = rough.svg(svgRef.current);

    const node = rc.circle(size/2, size/2, size - padding,{
        fill: "rgba(0,0,0,0.9)",
        fillStyle: "solid",
        fillWeight: 1,
        strokeWidth: 2,
        stroke: "black"
    });

    svgRef.current.appendChild(node)



  }, []);
  return (
    <>
      <div ref={containerRef} className="rounded-full overflow-hidden">
        <svg ref={svgRef}>

        </svg>
      </div>
    </>
  );
};

export default LandingCircle;
