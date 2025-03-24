import { useEffect, useRef } from "react";
import rough from "roughjs";

const Highlight = ({ children }) => {
  // const svg = useRef(null);
  // const boxRef = useRef(null);
  // useEffect(() => {
  //   const calculateAndDraw = () => {
  //     if (svg.current && boxRef.current) {
  //       const { width, height } = boxRef.current.getBoundingClientRect();
  //       const rc = rough.svg(svg.current);
  //       const bgRoughBox = rc.rectangle(0, 0, width, height, {
  //         // fill: "yellow",
  //       });
  //       svg.current.innerHTML = ""; // Clear previous drawings
  //       svg.current.appendChild(bgRoughBox);
  //     }
  //   };

  //   // Delaying calculation to ensure rendering has completed
  //   const timeoutId = setTimeout(calculateAndDraw, 100);

  //   return () => clearTimeout(timeoutId);
  // }, [children]);
  return (
    <span className="relative w-fit h-fit">
      <span className="z-50 px-1 bg-yellow-300">{children}</span>
      {/* <svg ref={svg} className="absolute bg-yellow-300 top-0 left-0 w-full h-full mix-blend-multiply"></svg> */}
    </span>
  );
};

export default Highlight;
