/*   
Layout Component
*/

import { useEffect, useState } from "react";
import BottomNav from "../navs/BottomNav";
import React from "react";
import { DeviceFrameset } from "../../../node_modules/react-device-frameset";
import "react-device-frameset/styles/marvel-devices.min.css";
import Head from "next/head";

const HeadComponent = () => {
  return (
    <Head>
      <title>We want them back</title>
      {/* <meta name="description" content="testesttest"  />
            <meta property="og:type" content="website" />
            <meta property="og:title" content="We want them back" />
            <meta property="og:description" content="testesttest"  />
            <meta property="og:url" content="https://wewantthemback.berlin" />
            <meta property="og:image" content="../../../public/images/wewantthemback-logo.png" /> */}
    </Head>
  );
};

const DesktopFrame = ({ children }) => {
  return (
    <div className="bg-black h-screen w-screen flex justify-center items-center overflow-hidden">
      <DeviceFrameset device="iPhone 8" color="silver" landscape={false}>
        {children}
      </DeviceFrameset>
    </div>
  );
};


const Layout = ({ children, layout = "bottom", size = false }) => {
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

  switch (layout) {
    case "fullSize":
      return (
        <>
          <HeadComponent />
          {!getDetectingMDevice ? (
            <DesktopFrame>
                <div className={`${size ? "layout-container-full-desktop" : "layout-container-desktop"} no-scrollbar overflow-hidden`}>
                  <div className={size ? "px-0" : "px-4"}>{children}</div>
                  <BottomNav mode={true} desktopFullSize={true} />
                </div>
            </DesktopFrame>
          ) : (
            <div className="bg-black h-fit w-screen flex justify-center items-center overflow-hidden">
              <div className={`${size ? "layout-container-full-map" : "layout-container"} no-scrollbar overflow-hidden`}>
                <div>{children}</div>
                <BottomNav />
              </div>
            </div>
          )}
        </>
      );
    case "bottomAndTop":
      return (
        <>
           <HeadComponent />
          {!getDetectingMDevice ? (
            <DesktopFrame>
                <div className={`layout-container-desktop no-scrollbar`}>
                  <div className="flex flex-col relative">{children}</div>
                  <BottomNav mode={true} />
                </div>
            </DesktopFrame>
          ) : (
            <div className="bg-black">
              <div className={`layout-list-container no-scrollbar `}>
                <div>{children}</div>
                <BottomNav />
              </div>
            </div>
          )}
        </>
      );
    default:
      return (
        <>
           <HeadComponent />
          {!getDetectingMDevice ? (
            <DesktopFrame>
                <div className={`${size ? "layout-container-full-desktop" : "layout-container-desktop"} no-scrollbar`}>
                  <div className={size ? "px-0" : "px-4"}>{children}</div>
                  <BottomNav mode={true} />
                </div>
            </DesktopFrame>
          ) : (
            <div className="bg-black h-screen w-screen flex justify-center items-center overflow-hidden ">
              <div className={`${size ? "layout-container-full" : "layout-container"} no-scrollbar`}>
                <div>{children}</div>
                <BottomNav />
              </div>
            </div>
          )}
        </>
      );
  }
};

export default Layout;
