import Story from "./Story";
import Title from "../../Title";
import { useEffect, useRef, useState } from "react";

import UseCheckCurrentSection from "@/hooks/useCheckCurrentSection";
import {  useSetRecoilState } from "recoil";
import { storiesData } from "@/components/states";

const StoriesSection = ({ id, kirbyData }) => {
  const sectionRef = useRef(null);
  const setStoriesData = useSetRecoilState(storiesData)
  UseCheckCurrentSection({ name: "stories-section", sectionRef });
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
    setStoriesData(kirbyData.result.stories)

  }, []);
  return (
    <div ref={sectionRef} id={id} className={`${getDetectingMDevice ? "section-container" : "section-container-desktop"}`}>
      <Title text={kirbyData.result.content.sectiontitle} size="h2" />
      <div className="flex w-full overflow-x-scroll gap-5">
        {kirbyData.result.stories.map((value, index) => {
          return <Story key={index} id={index} data={value} />;
        })}
      </div>
    </div>
  );
};

export default StoriesSection;

// export async function getStaticProps({ params: { slug } }) {
//   try {

//     return {
//       props: { slug: "ddd"},
//     };
//   } catch (error) {
//     console.error(error);
//   }
// }

// export async function getStaticPaths(i18nContext) {
//   try {
//     const institutions = ["dain", "dd", "vis", "robin"]

//     const paths = institutions
//       .map((value) => ({
//         params: { slug: value}
//       }))

//     return {
//       paths,
//       fallback: false,
//     };
//   } catch (error) {
//     console.error(error);
//   }
// }
