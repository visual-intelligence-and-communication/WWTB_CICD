import { currentStoryTextBox, forceUpdate } from "@/components/states";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import rough from "roughjs";
import Image from "next/image";

import TestImg from "/public/images/marker.png"
import { ROUGHJS_COLORS } from "@/constants/colors/colors";



// const Story = ({ data: {result: {content, files}}, id }) => {
const Story = ({ data, id }) => {
  const [read, setRead] = useState(false);
  const [thumbNailText, setThumbNailText] = useState("")
  const [getCurrentStoryTextBox, setCurrentStoryTextBox] = useRecoilState(currentStoryTextBox)
  const svgRef = useRef(null)
  const router = useRouter();
  const [getImgUrl, setImgUrl] = useState("")
  const setForceUpdate = useSetRecoilState(forceUpdate);

  const onPush = () => {
    setForceUpdate((prev) => !prev)
    router.push(`/stories/${data.result.slug}`);
  };

  const onHandleTextBoxClick = () => {
    setRead((prev) => !prev);
    setCurrentStoryTextBox(id)
  }
  useEffect(() => {
    const blocksData = JSON.parse(data.result.content.text)
    const findImg = blocksData.find((value) => value.type === "image" || value.type === "gallery")
    const findText = blocksData.find((value) => value.type === "text")
    const imgUrl = findImg.type === "gallery" ? findImg.content.images[0] : findImg.content.image[0]
    setImgUrl(imgUrl)
    setThumbNailText(findText.content.text)
  },[])

  useEffect(() => {
    if(getCurrentStoryTextBox !== id){
      setRead(false)
    }
    },[getCurrentStoryTextBox])

  useEffect(() => {
    const rc = rough.svg(svgRef.current);
    const node = rc.rectangle(0, 0, svgRef.current.clientWidth, svgRef.current.clientWidth, {
        fill: ROUGHJS_COLORS.fill,
        strokeWidth: 1,
        
    });
    svgRef.current.appendChild(node)
  },[])

  
  return (
    <div className="text-black bg-white min-w-[230px] flex flex-col gap-3">
      <div onClick={onPush} className="w-full aspect-square overflow-hidden rounded-2xl relative">
        <svg ref={svgRef} className="absolute top-0 left-0 w-full h-full"></svg>
        <div className="absolute top-0 left-0 w-[89%] bg-white aspect-square rounded-2xl flex flex-col overflow-hidden border border-black">
          <div className="bg-white p-2">{String(data.result.content.storyblurb).slice(0,28)}{String(data.result.content.storyblurb).length > 28 && "..."}</div>
          <div className="bg-red-400 flex-1 rounded-2xl overflow-hidden relative">
            <Image 
              src={`https://${String(process.env.KIRBY_URL_FOR_FILE).slice(2)}/@/file/${String(getImgUrl).slice(7)}`}
              fill
              alt={`Image: ${String(data.result.content.storyblurb).slice(0,28)}`}
              style={{objectFit: "cover"}}
            />
           {/* {getImgUrl !== "" && <img src={`${process.env.KIRBY_URL_FOR_FILE}/@/file/${String(getImgUrl).slice(7)}`} className="w-full h-full object-cover" />} */}
          </div>
        </div>
      </div>
      <div className="break-all min-h-[50px]" dangerouslySetInnerHTML={{__html: `${read ? String(thumbNailText).slice(0, 300) : String(thumbNailText).slice(0, 50) + "..."}`}}>
      </div>
      <span onClick={onHandleTextBoxClick} className="break-normal text-blue-400">
        {read ? "Close" : "Read more"}
      </span>
      <div className="flex">
        <div onClick={onPush} className="btn-small">
          Read
        </div>
      </div>
    </div>
  );
};

export default Story;
