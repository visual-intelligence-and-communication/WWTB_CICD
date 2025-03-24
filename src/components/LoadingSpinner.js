import Head from "next/head";
import { DeviceFrameset } from "react-device-frameset";
import { useState, useEffect } from "react";
import Title from "@/components/Title";
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

const LoadingSpinner = ({ size = false }) => {
  const [getDetectingMDevice, setDetectingMDevice] = useState(true);

  // detecting mobile device
  useEffect(() => {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      // true for mobile device
      setDetectingMDevice(true);
    } else {
      // false for not mobile device
      setDetectingMDevice(false);
    }
  }, []);
  return (
    <>
      <HeadComponent />
      {!getDetectingMDevice ? (
        <DesktopFrame>
          <div
            className={`${
              size
                ? "layout-container-full-desktop"
                : "layout-container-desktop"
            } no-scrollbar overflow-hidden flex flex-col items-center justify-center`}
          >
            <Title text="We want them back" size="h2" />
            {/* Loading Message */}
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Loading Data...
              </h2>
              <p className="text-sm text-gray-600">
                We are retrieving information about ancestral remains.
                <br />
                This may take a few moments.
              </p>
            </div>
          </div>
        </DesktopFrame>
      ) : (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
          {/* Spinner Animation */}
          <div className="w-16 h-16 mb-4">
            <div className="w-full h-full rounded-full border-4 border-gray-200 border-t-primary animate-spin"></div>
          </div>

          {/* Loading Message */}
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Loading Data...
            </h2>
            <p className="text-sm text-gray-600">
              We are retrieving information about ancestral remains.
              <br />
              This may take a few moments.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default LoadingSpinner;
