import Title from "@/components/Title";
import { LandingSectionIntro } from "./LandingSectionIntro";
import { scaleSqrt } from "d3-scale";
import Highlight from "@/components/common/inline/Highlight";
import { useEffect, useRef, useState } from "react";
import LandingCircle from "./LandingCircle";
import UseCheckCurrentSection from "@/hooks/useCheckCurrentSection";




const LandingSection = ({ id, cities, institutionCount, updatedAt, currentCount, originalCount, repatriatedCount, kirbyData }) => {
  const sectionRef = useRef(null);
  UseCheckCurrentSection({ name: "", sectionRef });
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
    <div ref={sectionRef} id={id} className={`${getDetectingMDevice ? "section-container" : "section-container-desktop"} `}>
      <Title text={kirbyData.result.content.sectiontitle} size="h1" />
      <LandingSectionIntro cities={cities} institutionCount={institutionCount} updatedAt={updatedAt} kText1={kirbyData.result.content.introtextafterupdatedate} kText2={kirbyData.result.content.introtextafterinstitutioncount} kText3={kirbyData.result.content.introtextafterinstitutionlist} />
      <LandingSectionVisualization
        currentCount={currentCount}
        originalCount={originalCount}
        repatriatedCount={repatriatedCount}
        texttotalhumanremainsbeforecount={kirbyData.result.content.texttotalhumanremainsbeforecount}
        texttotalhumanremainsaftercount={kirbyData.result.content.texttotalhumanremainsaftercount}
        textrepatriatedlhumanremainsbeforecount={kirbyData.result.content.textrepatriatedlhumanremainsbeforecount}
        textrepatriatedhumanremainsaftercount={kirbyData.result.content.textrepatriatedhumanremainsaftercount}
      />
    </div>
  );
};

const LandingSectionVisualization = ({ currentCount, repatriatedCount, texttotalhumanremainsaftercount, texttotalhumanremainsbeforecount, textrepatriatedlhumanremainsbeforecount, textrepatriatedhumanremainsaftercount }) => {
  const [getBigCircleSize, setBigCircleSize] = useState(0);
  const [getSmallCircleSize, setSmallCircleSize] = useState(0);
  const wrapper = useRef(null);
  const bigCircle = useRef(null);
  const smallCircle = useRef(null);

  useEffect(() => {
    const diameterScale = scaleSqrt([0, currentCount], [10, wrapper.current.clientWidth]);
    setBigCircleSize(diameterScale(currentCount));
    setSmallCircleSize(diameterScale(repatriatedCount));
  }, [bigCircle, smallCircle, wrapper]);

  return (
    <div ref={wrapper} className="flex flex-col items-center gap-4 ">
      <div className="flex flex-col items-center gap-1">
        {getBigCircleSize && <LandingCircle size={getBigCircleSize} />}
        <p>{currentCount}</p>
      </div>

      <p className="w-full">
        {texttotalhumanremainsbeforecount} <Highlight>{currentCount}</Highlight> {texttotalhumanremainsaftercount}
      </p>

      <div className="flex flex-col items-center gap-1">
        {getSmallCircleSize && <LandingCircle size={getSmallCircleSize} />}
        <p>{repatriatedCount}</p>
      </div>

      <p className="w-full">
        {textrepatriatedlhumanremainsbeforecount} <Highlight>{repatriatedCount}</Highlight> {repatriatedCount > 1 ? "are" : "is"} {textrepatriatedhumanremainsaftercount}
      </p>
    </div>
  );
};

export default LandingSection;
