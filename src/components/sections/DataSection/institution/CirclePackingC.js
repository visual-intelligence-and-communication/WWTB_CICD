const { useEffect, useRef, useState } = require("react");
import * as d3 from "d3";
import rough from "roughjs";
import { stratify, hierarchy } from "d3-hierarchy";
import { ROUGHJS_COLORS } from "@/constants/colors/colors";
import CLegend from "./CLegend";

const CirclePackingC = ({ data, kirbyData }) => {
  const svgContainerRef = useRef(null);
  const [getForceReset, setForceReset] = useState(false);
  const [checkError, setError] = useState(false)

  useEffect(() => {
    try{
      const width = svgContainerRef.current.clientWidth;
      const height = svgContainerRef.current.clientHeight;
  
      d3.select("#cPack").remove();
  
      const totalContinent = {};
      [...data]
        .filter((value) => value.category !== "continent")
        .forEach((value) => {
          if (totalContinent[value.parent]) {
            totalContinent[value.parent] = totalContinent[value.parent] + value.currentCount;
          } else {
            totalContinent[value.parent] = value.currentCount;
          }
        });
  
      const urlParams = new URLSearchParams(window.location.search);
      const target = urlParams.get("target");
  
      const svg = d3
        .select(svgContainerRef.current)
        .append("svg")
        .attr("id", "cPack")
        .attr("width", "100%")
        .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
        .attr("height", "100%")
        .style("background", "white")
        .attr("style", `cursor: pointer;`);
  
        
        // 🍺 Handling Error execpt Unknown Data
        const newData = data.filter((value) => {
          return value.category !== "unknown"
        })
        

      const stData = stratify()
        .id((d) => d.slug)
        .parentId((d) => d.parent)(newData);
      
  
      // Create root node
      const root = hierarchy(stData)
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
        .selectAll("g")
        .data(root.descendants())
        .join("g")
        .attr("transform", (d) => `translate(${d.x + 12},${d.y + 12})`)
        .attr("class", "rCircle");
  
      const nodeLabel = svg
        .append("g")
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
              fill: ROUGHJS_COLORS.fill3,
              // fillStyle: "solid",
              fillWeight: 1,
              stroke: ROUGHJS_COLORS.fill,
              strokeWidth: 1,
              hachureAngle: 60,
            };
            return rc.circle(0, 0, d.r * 2, style);
          } else {
            const category = d.data.data.category;
            const color = category === "country" ? ROUGHJS_COLORS.acc2 : category === "region" ? ROUGHJS_COLORS.acc3 : ROUGHJS_COLORS.acc4;
            const style = {
              fill: d.data.data.slug === target ? ROUGHJS_COLORS.acc : color,
              // fillStyle: d.data.data.slug === target ? "solid" : 'solid',
              stroke: ROUGHJS_COLORS.fill,
              roughness: 0.2,
              fillWeight: 0.2,
              strokeWidth: 0.3,
            };
            return rc.circle(0, 0, d.r * 2, style);
          }
        })
        .style("user-select", "none")
        .style("pointer-events", "none");
  
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
          // 
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
              if (d.data.data.slug === target) {
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
          // .filter(function (d) {
          //   return d.parent === focus || this.style.display === "inline";
          // })
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
              if (d.data.data.slug === target) {
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

      setError(false)
    }catch(error){
      // if you don't want to show the page when this page has an error.
      setError(true)
 
      
      
    }
  }, [getForceReset, checkError]);

  const onHandleExport = () => {
    const width = svgContainerRef.current.clientWidth;
    const height = svgContainerRef.current.clientHeight;
    const svg = d3.select("#cPack");

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
    const textForExport = `Institution: ${getName} <br/> current count: ${selectedQueryInfo.currentCount} <br/> total count: ${totalContinentCount} `;
    const textData = textForExport.split("<br/>");

    textTitleG
      .append("text")
      .selectAll("tspan")
      .data(textData)
      .join("tspan")
      .text(function (d) {
        return d;
      })
      .attr("x", -width / 2)
      .attr("y", function (d, i) {
        // return i * 15 + 10;
        // return -height / 2 + i * 15 + 10;
        return height / 2 + i * 10 - 20 ;
      })
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "auto")
      .attr("font-family", "Courier")
      .attr("font-size", "8px")
      .attr("font-weight", "bold")
      .attr("fill", ROUGHJS_COLORS.fill);

    svg.style("transform", "scale(0.7)");

    if (!svg.empty()) {
      // Convert the SVG element to an SVG string
      const svgString = new XMLSerializer().serializeToString(svg.node());

      // Create a blob with the SVG string
      const blob = new Blob([svgString], { type: "image/svg+xml" });

      // Create an image element
      const img = new Image();
      img.onload = function () {
        // Create a canvas element
        const canvas = document.createElement("canvas");
        canvas.width = img.width * 13;
        canvas.height = img.height * 13;
        canvas.style.background = "white";
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "#FFFFFF"; // white color
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Draw the image onto the canvas
        ctx.drawImage(img, 0, 0);

        // Convert canvas to data URL
        const dataURL = canvas.toDataURL("image/png"); // Change to "image/jpeg" for JPEG format

        // Create a download link
        const downloadLink = document.createElement("a");
        downloadLink.href = dataURL;
        downloadLink.download = "visualization.png"; // Change to ".jpg" for JPEG format

        // Trigger download
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      };

      // Set the source of the image to the SVG blob
      img.src = URL.createObjectURL(blob);
    } else {
      console.error("SVG element not found or empty.");
    }
    setForceReset((prev) => !prev);
  };

  if(checkError){
    return (<><div>Error</div></>)
  }

  return (
    <div className="flex flex-col mb-12">
      <div className="font-semibold mb-2">{kirbyData.result.content.visualizationheadline}</div>
      <div ref={svgContainerRef} className="w-full aspect-square relative">
        <div className="flex absolute top-0 left-0">
          <div onClick={onHandleExport} className="bg-black text-white cursor-pointer px-2 py-1 text-sm">
            Download
          </div>
        </div>
        {/* svg */}
      </div>
      <div className="text-sm text-zinc-400 text-center mt-2">Tap to Zoom</div>
      <div className="flex w-full h-20 mt-4">
        <CLegend />
      </div>
    </div>
  );
};

export default CirclePackingC;
