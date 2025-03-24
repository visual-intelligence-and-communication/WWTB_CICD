import { currentMenuItemArrayIdAtom } from "@/components/states";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import ListView from "./ListView";
import Layout from "@/components/layouts/Layout";
import MenuItem from "./MenuItem";
import LeafletMap from "@/components/map";
import gsap from "gsap";
import { points, center, point, distance } from "@turf/turf";

export default function SearchLayout({ data: dataI, dataGristIntro, kirbyData }) {
  const router = useRouter();
  const [originName, setOriginName] = useState("");
  const [getName, setName] = useState("");
  const [ready, setReady] = useState(false);
  const [startAni, setStartAni] = useState(false);
  const [listView, setListView] = useState(false);
  const menuContainerRef = useRef(null);
  const currentMenuItemArrayIdAtomf = useRecoilValue(currentMenuItemArrayIdAtom);
  const [getDistance, setDistance] = useState("");

  const [getAniCache, setAniCache] = useState(false)
  // const setSelectedMenuItemAtom = useSetRecoilState(clikedMenuItemIdAtom);
  const data = dataI.filter((value) => value.institution.label !== "");
 
  const svgRef = useRef(null);
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

  useEffect(() => {
    if (ready) {
      if (menuContainerRef.current) {
        if (currentMenuItemArrayIdAtomf >= 0) {
          menuContainerRef.current.scrollLeft = currentMenuItemArrayIdAtomf * 138;
        }
      }
    }
  }, [ready, menuContainerRef, currentMenuItemArrayIdAtomf]);
  useEffect(() => {
    const regex = /\/search\/origin\/(.+)/;
    const newPathName = router.asPath.match(regex)[1].split("/");
    setOriginName(newPathName[0]);
    setName(data[0][newPathName[0]].label);
    const distance = getDistanceHandler();
    setDistance(`${Math.floor(distance)}km`);
  }, []);

  const onPushNewSearch = () => {
    router.push(`/#data-section`);
  };

  useEffect(() => {
    if (startAni) {
      gsap.to("#startAni", { duration: 3, css: { opacity: 0 } });
    }
  }, [startAni]);

  useEffect(() => {
    if (ready && !listView) {
      gsap.to("#data-section-menuNav", { duration: 1, css: { opacity: 1 } });
    }
  }, [ready, listView]);

  // clear timeout
  let readyTimeOut;
  useEffect(() => {
    let startAniTimeout;
    let readyTimeout;

    const handleBackButtonClick = () => {
      
    };

    if (!startAni) {
      startAniTimeout = setTimeout(() => {
        setStartAni(true);
      }, 2000);
      readyTimeout = setTimeout(() => {
        setReady(true);
      }, 7000);
      setTimeout(() => {
        setAniCache(true)
      },10000) 
    }

    window.addEventListener("popstate", handleBackButtonClick);

    return () => {
      // Clear timeouts when the component unmounts
      clearTimeout(startAniTimeout);
      clearTimeout(readyTimeout);
      clearTimeout(readyTimeOut);

      // Remove event listener when the component unmounts
      window.removeEventListener("popstate", handleBackButtonClick);
    };
  }, []);

  // const onClickStarterHandler = () => {
  //   // 
  //   setStartAni(true);
  //   setTimeout(() => {
  //     setReady(true);
  //   }, 7000);
  // };
  const onClickStarterHandler = useCallback(() => {
    setStartAni(true);
    readyTimeOut = setTimeout(() => {
      setReady(true);
    }, 7000);
  }, []);

  const getCenter = () => {
    const allLatLng = data.map((value) => {
      return [value.institution.latitude, value.institution.longitude];
    });
    const features = points(allLatLng);
    const centert = center(features);
    return centert;
  };
  const getDistanceHandler = () => {
    const regex = /\/search\/origin\/(.+)/;
    const newPathName = router.asPath.match(regex)[1].split("/");
    const centerData = getCenter();
    const from = point(centerData.geometry.coordinates);
    const to = point([data[0][newPathName[0]].latitude, data[0][newPathName[0]].longitude]);
    const distancet = distance(from, to, { units: "kilometers" });

    return distancet;
  };

  useEffect(() => {
    // const calculateAndDraw = () => {
    //   if (svgRef.current) {
    //     const { width, height } = svgRef.current.getBoundingClientRect();
    //     const rc = rough.svg(svgRef.current);
    //     const bgRoughBox = rc.circle(width / 2, width / 2, width - 10, {
    //       fill: ROUGHJS_COLORS.acc,
    //       fillStyle: "solid",
    //       stroke: "black",
    //     });
    //     svgRef.current.innerHTML = ""; // Clear previous drawings
    //     svgRef.current.appendChild(bgRoughBox);
    //   }
    // };

    // calculateAndDraw();
  }, []);

  if (listView) {
    return <ListView originName={originName} getName={getName} data={data} originalCount={dataGristIntro.originalCount} setListView={setListView} kirbyData={kirbyData} />;
  }

  return (
    <Layout layout="fullSize" size={true}>
      {data.length > 0 ? (
        <div className={getDetectingMDevice ? "w-full h-[calc(100dvh-4rem)] relative" : "w-full h-[calc(100dvh-4rem)] overflow-hidden"}>
          <div className="absolute z-50 top-0 left-0 p-4">
            <div className="mb-2 font-bold">
              {`${kirbyData.result.content.querysummarybeforecontinent} ${String(originName).charAt(0).toUpperCase() + String(originName).slice(1)}, `}
              {/* <Highlight>{`${getName.charAt(0).toUpperCase() + getName.slice(1)}.`}</Highlight> */}
              <span className="bg-yellow-400 px-1">{`${String(getName).charAt(0).toUpperCase() + String(getName).slice(1)}.`}</span>
              <span onClick={onPushNewSearch} className="cursor-pointer bg-black py-[0.8px] px-2 text-white w-fit ml-2 font-normal">
                New Search
              </span>
            </div>
          </div>
          {ready && (
            <>
              <div id="data-section-menuNav" className={`${getDetectingMDevice ? "absolute bottom-4 px-4 w-full overflow-hidden left-0 z-50 flex items-center gap-2" : "absolute bottom-20 px-4 w-full overflow-hidden left-0 z-50 flex items-center gap-2" } ${getAniCache ? "opacity-100" : "opacity-0"}`}>
                <div onClick={() => setListView(true)} className="min-h-[32px] aspect-square bg-black text-white flex justify-center items-center rounded-full cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                </div>
                <div ref={menuContainerRef} className="flex items-center flex-grow overflow-x-scroll">
                  <div className="flex gap-2">
                    {data.map((value, id) => {
                      return <MenuItem key={value.id} id={id} value={value} />;
                    })}
                    <div className="min-h-[32px] w-[130px]"></div>
                  </div>
                </div>
              </div>
            </>
          )}
          {!ready && (
            <>
              <div className={`${getDetectingMDevice ? "absolute z-40 top-0 left-0 w-screen h-[calc(100vh-4rem)] bg-black opacity-5" : "absolute z-40 top-0 left-0 w-full h-full"}`}></div>
              <div
                id="startAni"
                onClick={onClickStarterHandler}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 select-none w-3/4 aspect-square bg-yellow-400 rounded-full flex justify-center items-center transition-all ${startAni ? "cursor-auto" : "cursor-pointer"} ${ready ? "opacity-0" : "opacity-100"}`}
              >
                <div className="text-center">
                  {`${kirbyData.result.content.distancetext}`} {originName} : <span className="font-bold">{getDistance}</span>
                </div>
                {/* <svg ref={svgRef} className="absolute w-full h-full top-0 left-0 mix-blend-multiply rounded-full"></svg> */}
              </div>
            </>
          )}
          <span>
            {/* <span onClick={() => setSelectedMenuItemAtom(-1)}> */}
            {originName && <LeafletMap data={data} ready={ready} start={startAni} maxValue={dataGristIntro.originalCount} originName={originName} />}
          </span>
        </div>
      ) : (
        <div>no data</div>
      )}
    </Layout>
  );
}
