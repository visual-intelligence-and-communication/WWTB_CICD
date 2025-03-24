import { useEffect, useRef, useState } from "react";
import Title from "../Title"
import Tool from "../Tool"
import UseCheckCurrentSection from "@/hooks/useCheckCurrentSection";

const ToolsSection = ({id, kirbyData}) => {
    const sectionRef= useRef(null)
    const [getLink, setLink] = useState([])
    const [getDownload, setDownload] = useState([])
    const [getContact, setContact] = useState([])
    const [getDetectingMDevice, setDetectingMDevice] = useState(true);
    UseCheckCurrentSection({name: "tools-section", sectionRef});
    useEffect(() => {
        const linkModule = JSON.parse(kirbyData.result.content.linkmodule)
        const downloadModule = JSON.parse(kirbyData.result.content.downloadmodule)
        const contactModule = JSON.parse(kirbyData.result.content.contactmodule)
        setLink(linkModule);
        setDownload(downloadModule);
        setContact(contactModule);
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            // true for mobile device
            
            setDetectingMDevice(true);
          } else {
            // false for not mobile device
            
            setDetectingMDevice(false);
          }

      
    },[]) 
    return (
        <div ref={sectionRef} id={id} className={`${getDetectingMDevice ? "section-container" : "section-container-desktop"}`}>
            <Title text={kirbyData.result.content.sectiontitle} size="h2" />
        
            {getDownload.length > 0 && <div>
                <div className="font-bold">{kirbyData.result.content.downloadmoduletitle}</div>
                {
                    getDownload.map((value,index) => {
                        return <Tool key={index} index={index} type="download" title={value.content.text} text={value.content.downloadtooltext} data={`${process.env.KIRBY_URL_FOR_FILE}/@/file/${String(value.content.downloadtoolfile[0]).slice(7)}`} />
                    })
                }
            </div>}
            {getLink.length > 0 && <div>
                <div className="font-bold">{kirbyData.result.content.linkmoduletitle}</div>
                {
                    getLink.map((value,index) => {
                        return <Tool key={index} index={index} type="link" title={value.content.linktoolheadline} text={value.content.linktooltext} data={value.content.linktoollink} />
                    })
                }
            </div>}
            {getContact.length > 0 && <div>
                <div className="font-bold">{kirbyData.result.content.contactmoduletitle}</div>
                {
                    getContact.map((value, index) => {
                        return <Tool key={index} index={index} type="contact" title={value.content.contacttoolheadline} text={value.content.contacttooltext} data={value.content.contacttoolemaillink} />
                    })
                }
            </div>}
           
        </div>
    )
}

export default ToolsSection