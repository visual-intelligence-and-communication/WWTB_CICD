const { useEffect, useRef, useState } = require("react");
import * as d3 from "d3";
import rough from "roughjs";
import { stratify, hierarchy } from "d3-hierarchy";
import { ROUGHJS_COLORS } from "@/constants/colors/colors";
import CLegend from "./CLegend";
import CLegend2 from "./CLegend2";
import { jsPDF } from "jspdf";
import "svg2pdf.js";

const CirclePackingContainer = ({ data, kirbyData, data2 }) => {
  const svgContainerRef = useRef(null);
  const [getForceReset, setForceReset] = useState(false);
  const [checkError, setError] = useState(false);

  useEffect(() => {
    try {
      const width = svgContainerRef.current.clientWidth;
      const height = svgContainerRef.current.clientHeight;

      d3.select("#cPackU").remove();

      const totalContinent = {};

      /* Get Total Count of continents */
      [...data]
        .map((value) => {
          return value;
        })
        .forEach((value) => {
          if (totalContinent[value.parent]) {
            // totalContinent[value.parent] = totalContinent[value.parent] + value.currentCount;
            if (value.category === "unknown") {
              totalContinent[value.category] = totalContinent[value.parent] + value.currentCount;
            } else {
              totalContinent[value.parent] = totalContinent[value.parent] + value.currentCount;
            }
          } else {
            if (value.category === "unknown") {
              totalContinent[value.category] = value.currentCount;
            } else {
              totalContinent[value.parent] = value.currentCount;
            }
          }
        });

      // const urlParams = new URLSearchParams(window.location.search);
      // const targetValue = urlParams.get("target");

      // let selectedQueryInfo = data.filter((value) => value.slug === targetValue)[0];

      // // /* If the data has multiple groups then try to find using origin ID */
      // if (!Boolean(selectedQueryInfo)) {
      //   const findOrign = data2.filter((value) => String(value.fields.original_group).toLocaleLowerCase() === String(targetValue).toLocaleLowerCase())[0];
      //   selectedQueryInfo = data.filter((value) => value.originCategory === findOrign.id)[0];
      // }

      // const target = selectedQueryInfo.slug

      //TODO: if the items has one group and the itmes has multiple groups exist together then how?
      const urlParams = new URLSearchParams(window.location.search);
      const target = urlParams.get("target");

      // The length should be 1 here. If not then Grist has a problem
      let selectedQueryInfo = data.filter((value) => value.slug === target && (value.currentCount > 0 || value.category === "continent"));

      if (selectedQueryInfo.length < 1 || selectedQueryInfo[0].currentCount < 1) {
        const findOrign = data2.filter((value) => String(value.fields.original_group).toLocaleLowerCase() === String(target).toLocaleLowerCase());
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < findOrign.length; j++) {
            if (data[i].originCategory === findOrign[j].id && !Boolean(data[i].currentCount <= 0)) {
              selectedQueryInfo.push(data[i]);
            }
          }
        }
      }

      const svg = d3
        .select(svgContainerRef.current)
        .append("svg")
        .attr("id", "cPackU")
        .attr("width", "100%")
        .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
        .attr("height", "100%")
        .style("background", "white")
        .attr("style", `cursor: pointer;`);

      // 🍺 Handling Error: Dealing with Unknown Data That Only Includes Continent Information
      const newData = data.map((value) => {
        if (value.id && value.category === "continent") {
          // value.category = "unknown";
          value.label = "Not specified";
          // value.label = "Country, Region or Ancestry not specified";
          value.slug = "unknown";
        }
        return value;
      });

      const stData = stratify()
        // .id((d) => d.id)
        .id((d) => d.slug)
        .parentId((d) => d.parent)(newData);

      // Create root node
      let root = hierarchy(stData)
        .sum((d) => d.data.currentCount)
        .sort((a, b) => b.data.currentCount - a.data.currentCount);

      const pack = d3
        .pack()
        .size([svgContainerRef.current.clientWidth - 24, svgContainerRef.current.clientHeight - 24])
        .padding(3);

      pack(root);

      // Draw circles
      const node = svg
        .append("g")
        .attr("id", "node")
        .selectAll("g")
        .data(root.descendants())
        .join("g")
        .attr("transform", (d) => `translate(${d.x + 12},${d.y + 12})`)
        .attr("class", "rCircle");

      const nodeLabel = svg
        .append("g")
        .attr("id", "nodeLabel")
        .selectAll("g")
        .data(root.descendants())
        .join("g")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .style("user-select", "none")
        .attr("transform", (d) => `translate(${d.x + 12},${d.y + 12})`);

      const rc = rough.svg(svg.node());

      // node.filter(d => d.depth === 1 || d.depth === 0)
      const rCir = node
        .append(function (d) {
          if (d.depth === 0) {
            const style = {
              stroke: ROUGHJS_COLORS.fill,
              strokeWidth: 2,
              fill: ROUGHJS_COLORS.fill2,
              fillStyle: "solid",
            };
            return rc.circle(0, 0, d.r * 2, style);
          } else if (d.depth === 1) {
            const style = {
              fill: target === d.data.id ? ROUGHJS_COLORS.acc : ROUGHJS_COLORS.fill3,
              // fillStyle: "solid",
              fillWeight: 1,
              stroke: ROUGHJS_COLORS.fill,
              strokeWidth: 1,
              hachureAngle: 60,
            };
            return rc.circle(0, 0, d.r * 2, style);
          } else {
            const category = d.data.data.category;
            const color = category === "country" ? ROUGHJS_COLORS.acc2 : category === "region" ? ROUGHJS_COLORS.acc3 : category === "ancestry" ? ROUGHJS_COLORS.acc4 : ROUGHJS_COLORS.fill4;
            const selectedQueryInfoIds = selectedQueryInfo.map((value) => value.id)
            const style = {
              fill: selectedQueryInfoIds.some((v) => v === d.data.data.id) ? ROUGHJS_COLORS.acc : color,
              stroke: ROUGHJS_COLORS.fill,
              roughness: 0.2,
              fillWeight: 0.2,
              strokeWidth: 0.3,
            };
            return rc.circle(0, 0, d.r * 2, style);
           
          }
        })
        .style("user-select", "none")
        .style("pointer-events", "none")
        .attr("class", "nodeRCir");

      // node.filter(d => !d.children)
      nodeLabel
        .filter((d) => d.depth === 1 || d.depth === 2)
        .append("text")
        .attr("class", "rText")
        .attr("dy", "0.3em")
        .attr("font-family", "Courier")
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .style("user-select", "none")
        .html(function (d) {
          if (d.depth === 1) {
            return `${d.data.data.label}<tspan dy="1.2em" x="0%" text-anchor="middle">${totalContinent[d.data.data.slug]}`;
          }
          return `${d.data.data.label}<tspan dy="1.2em" x="0%" text-anchor="middle">${d.data.data.currentCount}`;
        });

      node
        .filter((d) => d.depth !== 2)
        .append("circle")
        .attr("r", (d) => d.r)
        .style("fill", function (d) {
          return "white";
        })
        .style("user-select", function (d) {
          return "auto";
        })
        .style("opacity", 0)
        .attr("transform", (d) => {
          return `scale(1)`;
        })
        .on("click", function (event, d) {
          focus !== d && (zoom(event, d), event.stopPropagation());
          //focus !== d && (zoom(event, d.parent), event.stopPropagation());
        });

      svg.on("click", (event) => zoom(event, root));
      let focus = root;
      let view;
      zoomTo([focus.x, focus.y, focus.r * 2]);

      function zoomTo(v) {
        const k = width / v[2];

        view = v;

        nodeLabel
          .attr("transform", (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`)
          .style("fill-opacity", function (d) {
            if (d.parent === focus) {
              return 1;
            } else {
              if (d.data.data.slug === target) {
                return 0;
              } else {
                return 0;
              }
            }
          });
        node.attr("transform", (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
        node.attr("r", (d) => d.r * k);
        rCir.attr("transform", (d) => {
          return `scale(${k})`;
        });
        rCir.style("opacity", (d) => {
          if (d.depth === 2) {
            if (d.parent === focus) {
              return 1;
            } else {
              const selectedQueryInfoIds = selectedQueryInfo.map((value) => value.id)
              if (selectedQueryInfoIds.some((v) => v === d.data.data.id)) {
                return 1;
              } else {
                return 0;
              }
            }
          } else {
            return 1;
          }
        });
      }
      function zoom(event, d) {
        const focus0 = focus;

        focus = d;

        const transition = svg
          .transition()
          .duration(event.altKey ? 7500 : 750)
          .tween("zoom", (d) => {
            const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
            return (t) => zoomTo(i(t));
          });

        nodeLabel
          .transition(transition)
          .style("fill-opacity", function (d) {
            if (d.parent === focus) {
              return 1;
            } else {
              if (d.data.data.slug === target) {
                return 0;
              } else {
                return 0;
              }
            }
          })
          // .style("fill-opacity", (d) => (d.parent === focus ? 1 : 0))
          .on("start", function (d) {
            if (d.parent === focus) this.style.display = "inline";
          })
          .on("end", function (d) {
            if (d.parent !== focus) {
              if (d.data.data.slug === target) {
                return (this.style.display = "inline");
              } else {
                return (this.style.display = "none");
              }
            }
          });

        rCir.transition(transition).style("opacity", (d) => {
          if (d.depth === 2) {
            if (d.parent === focus) {
              return 1;
            } else {
              const selectedQueryInfoIds = selectedQueryInfo.map((value) => value.id)
              if (selectedQueryInfoIds.some((v) => v === d.data.data.id)) {
                return 1;
              } else {
                return 0;
              }
            }
          } else {
            return 1;
          }
        });
      }

      setError(false);
    } catch (error) {
      console.log(error);
      // if you don't want to show the page when this page has an error.
      setError(true);
    }
  }, [getForceReset, checkError]);

  const onHandleExport = () => {
    const width = svgContainerRef.current.clientWidth;
    const height = svgContainerRef.current.clientHeight;
    const svg = d3.select("#cPackU");
    // Text just for export
    const textTitleG = svg.append("g");

    const getName = data.filter((value) => value.category === "institution")[0].label;
    const urlParams = new URLSearchParams(window.location.search);
    const target = urlParams.get("target");
    const selectedQueryInfo = data.filter((value) => value.slug === target)[0];
    const totalContinent = {};
    [...data]
      .filter((value) => value.category !== "continent" && value.category !== "institution")
      .forEach((value) => {
        if (totalContinent[value.parent]) {
          totalContinent[value.parent] = totalContinent[value.parent] + value.currentCount;
        } else {
          totalContinent[value.parent] = value.currentCount;
        }
      });

    const totalContinentCount = Object.values(totalContinent).reduce((prev, curr) => prev + curr);
    const textForExport = `Institution: ${getName} <br/> Results total: ${totalContinentCount} <br/> Remains count : ${selectedQueryInfo.category !== "continent" ? selectedQueryInfo.currentCount : totalContinent[target]} `;
    const textData = textForExport.split("<br/>");

    d3.select("#nodeLabel").style("transform", "scale(0.7) translate(0, -30px)");
    d3.select("#node").style("transform", "scale(0.7) translate(0, -30px)");

    textTitleG
      .append("text")
      .selectAll("tspan")
      .data(textData)
      .join("tspan")
      .text(function (d) {
        return d;
      })
      .attr("x", 0)
      .attr("x", -width / 2 + 10)
      .attr("y", function (d, i) {
        // return i * 15 + 10;
        // return -height / 2 + i * 15 + 10;
        return height / 2 + i * 10 - 20 - 10;
      })
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "auto")
      .attr("font-family", "Courier")
      .attr("font-size", "8px")
      .attr("font-weight", "bold")
      .attr("fill", ROUGHJS_COLORS.fill);

    /* jsPDF + svg2pdf */
    if (!svg.empty()) {
      const exportSvgToPdf = () => {
        const svgElemnt = svg.node();
        const doc = new jsPDF({
          orientation: "landscape",
          unit: "px",
          format: [svgElemnt.clientWidth, svgElemnt.clientHeight],
        });

        doc
          .svg(svgElemnt, {
            x: 0,
            y: 0,
            width: svgElemnt.clientWidth,
            height: svgElemnt.clientHeight,
          })
          .then(() => {
            doc.save("download.pdf");
          });
      };
      exportSvgToPdf();
    } else {
      console.error("SVG element not found or empty.");
    }
    /* Convert to Image */
    // if (!svg.empty()) {
    //   // Convert the SVG element to an SVG string
    //   const svgString = new XMLSerializer().serializeToString(svg.node());

    //   // Create a blob with the SVG string
    //   const blob = new Blob([svgString], { type: "image/svg+xml" });

    //   // Create an image element
    //   const img = new Image();
    //   img.onload = function () {
    //     // Create a canvas element
    //     const canvas = document.createElement("canvas");
    //     canvas.width = img.width * 13;
    //     canvas.height = img.height * 13;
    //     canvas.style.background = "white";
    //     const ctx = canvas.getContext("2d");

    //     ctx.fillStyle = "#FFFFFF"; // white color
    //     ctx.fillRect(0, 0, canvas.width, canvas.height);
    //     // Draw the image onto the canvas
    //     ctx.drawImage(img, 0, 0);

    //     // Convert canvas to data URL
    //     const dataURL = canvas.toDataURL("image/jpeg"); // Change to "image/jpeg" for JPEG format

    //     // Create a download link
    //     const downloadLink = document.createElement("a");
    //     downloadLink.href = dataURL;
    //     downloadLink.download = "visualization.jpg"; // Change to ".jpg" for JPEG format

    //     // Trigger download
    //     document.body.appendChild(downloadLink);
    //     downloadLink.click();
    //     document.body.removeChild(downloadLink);
    //   };

    //   // Set the source of the image to the SVG blob
    //   img.src = URL.createObjectURL(blob);
    // } else {
    //   console.error("SVG element not found or empty.");
    // }
    setForceReset((prev) => !prev);
  };

  // if (checkError) {
  //   return (
  //     <>
  //       <div>Error</div>
  //     </>
  //   );
  // }

  return (
    <div className="flex flex-col mb-12">
      <div className="font-semibold mb-2">{kirbyData.result.content.visualizationheadline}</div>
      <div ref={svgContainerRef} className="w-full aspect-square relative">
        <div className="flex absolute top-0 left-0">
          <div onClick={onHandleExport} className="btn-xs">
            Download
          </div>
        </div>
        {/* svg */}
      </div>
      <div className="text-sm text-zinc-400 text-center mt-2">Tap to Zoom</div>
      <div className="flex w-full h-fit mt-4 flex-col">
        <CLegend />
        <CLegend2 />
      </div>
    </div>
  );
};

export default CirclePackingContainer;
