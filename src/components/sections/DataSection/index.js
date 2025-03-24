import Title from "../../Title";
import SearchMenu from "./SearchMenu";
import { useEffect, useRef, useState } from "react";
import UseCheckCurrentSection from "@/hooks/useCheckCurrentSection";


const DataSection = ({ id, data, kirbyData }) => {
  const sectionRef= useRef(null)
  UseCheckCurrentSection({name: "data-section", sectionRef});
  const [getDetectingMDevice, setDetectingMDevice] = useState(true);
  // detecting mobile device
  useEffect(() => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      // true for mobile device
      
      setDetectingMDevice(true);
    } else {
      // false for not mobile device
      
      setDetectingMDevice(false);
    }
  }, []);
  return (
    <div ref={sectionRef} id={id} className={`${getDetectingMDevice ? "section-container" : "section-container-desktop"}`}>
      <Title text={kirbyData.result.content.sectiontitle} size="h2" />
      <div className="mb-4">{kirbyData.result.content.sectionblurb}</div>
     
      <SearchMenu data={data} />
    </div>
  );
};

export default DataSection;
