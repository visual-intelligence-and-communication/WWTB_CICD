import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { currentToolBox } from "./states";
import * as d3 from "d3";
import rough from "roughjs";
import Image from "next/image";
import contactI from "/public/icons/contact.svg";
import linkI from "/public/icons/link.svg";
import downloadI from "/public/icons/download.svg";
// import contactI from "/public/icons/contactI.svg";
const Tool = ({ type = "contact", title, text = "blabal", data, index }) => {
  const [readMore, setReadMore] = useState(false);
  const [getCurrentToolBox, setCurrentToolBox] = useRecoilState(currentToolBox);
  const container = useRef(null);
  const svgRef = useRef(null);
  useEffect(() => {
    //reset
    if (getCurrentToolBox !== title) {
      setReadMore(false);
    }
  }, [getCurrentToolBox]);

  useEffect(() => {
    if (readMore) {
      setCurrentToolBox(title);
    }
    
    const draw = () => {
     
      const rc = rough.svg(svgRef.current);
      const bgRoughBox = rc.rectangle(0, 0, svgRef.current.clientWidth, svgRef.current.clientHeight, {
        // fill: "yellow",
      });
      svgRef.current.appendChild(bgRoughBox);
    };
    d3.select(`#${type}${index}`).select("g").remove()
    const timeoutId = setTimeout(draw, 100);

    return () => clearTimeout(timeoutId);
  }, [readMore]);

  return (
    <div ref={container} className="flex justify-between items-start border gap-3 p-3 mb-3 relative">
      <svg ref={svgRef} id={`${type}${index}`} className=" w-full h-full absolute top-0 left-0 mix-blend-multiply select-none pointer-events-none"></svg>
      <div>
        {type === "contact" && (  
          <>
          <Image width={30} height={30} src={contactI} alt="search"  />
          </>
        )}
        {type === "download" && (
          <>
          <Image width={30} height={30} src={downloadI} alt="search"  />
          </>
        )}
        {type === "link" && (
          <>
          <Image width={30} height={30} src={linkI} alt="search"  />
          </>
        )}
      </div>
      <div className="w-full flex flex-col justify-center">
        <div onClick={() => setReadMore((prev) => !prev)} className="flex gap-3 items-center justify-between">
          <div className="font-bold">{!readMore ? String(title).slice(0, 20) + "..." : title}</div>
          <div>
            {!readMore ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
            )}
          </div>
        </div>
        {readMore && (
          <div className="mt-3">
            <div className="mb-2">{text}</div>
            <div className="flex">
              {type === "link" && (
                <div className="btn-xs">
                  <a href={data} target="_blank" rel="noreferrer">
                    link
                  </a>
                </div>
              )}
              {type === "download" && (
                <div className="btn-xs">
                  <a href={data} download={data} className="">
                    Download PDF
                  </a>
                </div>
              )}
              {type === "contact" && (
                <div className="btn-xs">
                  <a href={`mailto:${data}`} target="_blank" rel="noreferrer">
                    contact
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tool;
