import { ROUGHJS_COLORS } from "@/constants/colors/colors";
import { scaleSqrt } from "d3-scale";
import rough from "roughjs";
const { useEffect, useState } = require("react");

const useGetIconUrl = ({
  value,
  valueOfInstitution,
  maxValue,
  clicked,
  getDetectingMDevice = true,
}) => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const newMax = getDetectingMDevice ? window.innerWidth / 5 : 120;
    const diameterScale = scaleSqrt([0, maxValue], [10, newMax]);
    const radius = diameterScale(valueOfInstitution);

    const cDiameterScale = scaleSqrt([0, valueOfInstitution], [1, radius]);
    const cRadius = cDiameterScale(value);

    const canvasSize = radius * 1.1;
    let dpr = window.devicePixelRatio || 1; // Get device pixel ratio

    // Create a canvas with adjusted dimensions for better resolution
    let canvas = document.createElement("canvas");
    canvas.width = canvasSize * 2 * dpr;
    canvas.height = canvasSize * 2 * dpr;

    let ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr); // Scale the context by the device pixel ratio

    // Use RoughJS to draw a circle
    let roughCanvas = rough.canvas(canvas);
    roughCanvas.circle(canvasSize, canvasSize, radius * 2, {
      stroke: "none",
      strokeWidth: 1,
      fillWeight: 1,
      fill: clicked ? ROUGHJS_COLORS.cliked2 : ROUGHJS_COLORS.fill,
    });
    //current count
    roughCanvas.circle(canvasSize, canvasSize, cRadius * 2, {
      stroke: "none",
      strokeWidth: 1,
      fillWeight: 2.5,
      fill: clicked ? ROUGHJS_COLORS.cliked : ROUGHJS_COLORS.acc,
    });

    // Draw a precise outline using canvas API for smooth stroke
    // ctx.beginPath();
    // ctx.arc(canvasSize, canvasSize, radius, 0, Math.PI * 2);
    // ctx.lineWidth = 0;
    // ctx.strokeStyle = "black";
    // ctx.stroke();

    // ctx.beginPath();
    // ctx.arc(canvasSize, canvasSize, cRadius, 0, Math.PI * 2);
    // ctx.lineWidth = 0
    // ctx.strokeStyle = "black";
    // ctx.stroke();

    var icon = L.icon({
      iconUrl: canvas.toDataURL(),
      iconSize: [radius * 2, radius * 2],
      iconAnchor: [radius, radius],
      popupAnchor: [0, -radius],
    });
    // setUrl(canvas.toDataURL());
    setUrl(icon);

    //
  }, []);
  return url;
};

export default useGetIconUrl;
