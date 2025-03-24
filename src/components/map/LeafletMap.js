import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { clikedMenuItemIdAtom, currentMenuItemArrayIdAtom } from "../states";
import useGetIconUrl from "@/hooks/useGetIconUrl";
import { useRouter } from "next/router";

function LocationMarker({ data, pos, start }) {
  const map = useMapEvents({
    click() {
   
    },
  
  });

  useEffect(() => {
    if (start) {
      
      // getCenter()
      const allLatLng = data.map((value) => {
        return [value.institution.latitude, value.institution.longitude];
      });

      var markerGroup = L.featureGroup();
      allLatLng.forEach((value) => {
        const marker = L.marker(value);
        markerGroup.addLayer(marker);
      });

      const bounds = markerGroup.getBounds();

      map.flyToBounds(bounds, { duration: 14});
    }
  }, [start]);
  return null;
}

const ClickMarker = ({ id, value, maxValue, originName }) => {
  const router = useRouter();

  const map = useMapEvents({
    click() {
   
    },

  });
  const [getSelectMenuItem, setSelectMenuItem] = useRecoilState(clikedMenuItemIdAtom);
  const currentMenuItemArrayIdAtomf = useSetRecoilState(currentMenuItemArrayIdAtom);

  const onPush = () => {
    router.push({
      pathname: `/search/institution/${value.institution.slug}`,
      query: {
        target: value[originName].slug
      }
    });
    setSelectMenuItem(-1);
  };

  const marker = useRef(null);
  const popUpr = useRef(null);

  const [getDetectingMDevice, setDetectingMDevice] = useState(true);
  // detecting mobile device
  useEffect(() => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      // true for mobile device
      setDetectingMDevice(true);
    } else {
      // false for not mobile device
      setDetectingMDevice(false);
      const controler = document.querySelector(".leaflet-control-container")
      controler.style.bottom = "65px"
      controler.style.right = "0px"
    }
  }, []);

  const icon = useGetIconUrl({ value: value.currentCount, valueOfInstitution: value.institution.currentCount, maxValue, clicked: false, getDetectingMDevice : !getDetectingMDevice && getDetectingMDevice  });
  const iconClicked = useGetIconUrl({ value: value.currentCount, valueOfInstitution: value.institution.currentCount, maxValue, clicked: true, getDetectingMDevice : !getDetectingMDevice && getDetectingMDevice  });

  useEffect(() => {
    if (getSelectMenuItem === value.id) {
      
      map.setView([value.institution.latitude, value.institution.longitude], map.getZoom());
    }
  }, [getSelectMenuItem]);

  return (
    <>
      {icon && iconClicked && (
        <Marker
          ref={marker}
          zIndexOffset={getSelectMenuItem === value.id ? 1000 : -1000}
          icon={getSelectMenuItem === value.id ? iconClicked : icon}
          position={[value.institution.latitude, value.institution.longitude]}
          eventHandlers={{
            click: (e) => {
              setSelectMenuItem(value.id);
              e.target.options.icon = iconClicked;
              currentMenuItemArrayIdAtomf(id);
            },
          }}
        >
          <Popup closeButton={false} autoPan={false} ref={popUpr}>
            <div className="font-medium font-title tracking-[-0.01rem]">{value.institution.label}</div>
            <div className="text-xs">Search results : {value.currentCount}</div>
            <div className="text-xs mb-2">Total human remains illegitimately at institution  : {value.institution.currentCount}</div>
            <div onClick={onPush} className="btn-small">
              To Institution
            </div>
          </Popup>
        </Marker>
      )}
    </>
  );
};

const LocationFinderDummy = () => {
  const resetMenuItem = useSetRecoilState(clikedMenuItemIdAtom);
  const map = useMapEvents({
    click() {
      resetMenuItem(-1);
    },
  });

  return null;
};
const LeafletMap = ({ data, ready, start, maxValue, originName }) => {
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
  const position = [data[0][originName]?.latitude ? data[0][originName]?.latitude : 0, data[0][originName]?.longitude ? data[0][originName]?.longitude : 0];
 
  useEffect(() => {
 
  },[])
  return (
    <MapContainer attributionControl={false} className={`absolute z-30 top-0 left-0 w-full ${getDetectingMDevice ? "h-full" : "h-full"} overflow-hidden`} center={position} zoom={15} scrollWheelZoom={true} zoomControl={false}>
      <LocationFinderDummy />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url={`https://api.mapbox.com/styles/v1/vis-int/ck3eo5das52db1ckkq9sndedt/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`}
      />
      {!ready && <LocationMarker data={data} pos={[data[0].institution.latitude, data[0].institution.longitude]} start={start} />}
      {start && (
        <>
          {data.map((value, id) => {
            return <ClickMarker key={value.id} id={id} value={value} maxValue={maxValue} originName={originName} />;
          })}
        </>
      )}
    </MapContainer>
  );
};

export default LeafletMap;
