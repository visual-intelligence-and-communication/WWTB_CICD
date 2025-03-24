import { useEffect, useState } from "react";
import ListCircle from "./ListCircle";
import { useRouter } from "next/router";
import Highlight from "@/components/common/inline/Highlight";
import ListCircleForLegend from "./ListCircleForLegend";
import ListCircleForLegend2 from "./ListCircleForLegend2";
import Image from "next/image";
import mapI from "/public/icons/map.svg";
const { default: Layout } = require("@/components/layouts/Layout");

const ListView = ({ originName, getName, data, originalCount, setListView, kirbyData }) => {
  const router = useRouter();
  const [openLegend, setOpenLegend] = useState(false);
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
  const onPushNewSearch = () => {
    router.push(`/#data-section`);
  };

  const onPush = ({ slug, originSlug }) => {
    // router.push(`/search/institution/${slug}?slug=${originSlug}`)
    router.push({
      pathname: `/search/institution/${slug}`,
      query: {
        target: originSlug,
      },
    });
  };

  useEffect(() => {}, []);
  return (
    <Layout layout="bottomAndTop" size={false}>
      
      <div className={`w-full h-[calc(100dvh-4rem) py-4 ${!getDetectingMDevice ? "px-4 h-full min-h-[667px] overflow-hidden" : ""}`}>
        <div className="">
          <div className="mb-2 font-bold">
            {`${kirbyData.result.content.querysummarybeforecontinent} ${originName.charAt(0).toUpperCase() + String(originName).slice(1)}, `}
            {/* <Highlight>{`${getName.charAt(0).toUpperCase() + getName.slice(1)}.`}</Highlight> */}
            <span className="bg-yellow-400 px-1">{`${getName.charAt(0).toUpperCase() + String(getName).slice(1)}.`}</span>
            <span onClick={onPushNewSearch} className="cursor-pointer bg-black py-[0.8px] px-2 text-white w-fit ml-2 font-normal">
              New Search
            </span>
            {/* <span onClick={() => setListView(false)} className="cursor-pointer bg-black py-[0.8px] px-2 text-white w-fit ml-2 font-normal">
                Map
              </span> */}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {data.map((value) => {
            return (
              <div key={value.id} className="flex justify-between items-center gap-4 w-full">
                <div className={`w-28 h-28 max-w-[7rem] min-w-[7rem] flex overflow-hidden`}>
                  {/* <div className="h-full aspect-square bg-red-500"></div> */}
                  <ListCircle value={value.currentCount} valueOfInstitution={value.institution.currentCount} maxValue={originalCount} />
                </div>
                <div onClick={() => onPush({ slug: value.institution.slug, originSlug: value[originName].slug })} className="flex-1 text-sm border border-black px-3 py-1 rounded-full cursor-pointer active:text-white active:bg-black select-none">
                  {String(value.institution.label).slice(0, 40)}...
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className={`${getDetectingMDevice ? "listview-footer-container" : "listview-footer-container-desktop"}`}>
        <span onClick={() => setListView(false)} className="flex justify-center items-center cursor-pointer bg-black py-[0.8px] text-white font-normal rounded-full w-[32px] h-[32px]">
          <Image width={24} height={24} src={mapI} alt="about" />
        </span>
        <span onClick={() => setOpenLegend(true)} className="btn-xs">
          <div>Map Legend</div>
        </span>
      </div>
      {openLegend && (
        <div className={`${getDetectingMDevice ? "fixed bottom-[4rem] left-1/2 -translate-x-1/2 w-full max-w-screen-sm h-fit bg-white border-t border-black z-50 px-4 py-2" : "sticky bottom-[4rem] left-0 w-full max-w-screen-sm h-fit bg-white border-t border-black z-50 px-4 py-2"}`}>
          <div className="flex justify-between items-center mb-4">
            <div className="font-bold">Map Legend</div>
            <div onClick={() => setOpenLegend(false)} className=" bg-black text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </div>
          </div>

          <div className="relative w-full h-28 min-h-[7rem] flex overflow-hidden mb-4">
            {[3, 9].map((v, index) => {
              return <ListCircleForLegend2 key={index} value={0} valueOfInstitution={originalCount / v} maxValue={originalCount} outside={index === 0 ? true : false} />;
            })}
          </div>
          <div className="relative w-full h-28 min-h-[7rem] flex overflow-hidden">
            {[1, 2, 9].map((v, index) => {
              return <ListCircleForLegend key={index} value={0} valueOfInstitution={originalCount / v} maxValue={originalCount} />;
            })}
          </div>
        </div>
      )}

    </Layout>
  );
};

export default ListView;
