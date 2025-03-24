import { useEffect, useRef, useState } from "react";
import Title from "../Title"
import UseCheckCurrentSection from "@/hooks/useCheckCurrentSection";

const ContactSection = ({id, kirbyData}) => {
    const sectionRef= useRef(null);
    UseCheckCurrentSection({name: "contact-section", sectionRef});
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
   

    return (
        <div ref={sectionRef} id={id} className={`${getDetectingMDevice ? "section-container pb-32" : "section-container-desktop"}`}>
            <Title text={kirbyData.result.content.sectiontitle} size="h2" />
            <p className="mb-4 whitespace-pre-line">
                {kirbyData.result.content.contacttext}
            </p>
            <p className="mb-4 whitespace-pre-line">
                {kirbyData.result.content.imprinttext}
            </p>
            <p className="mb-4 whitespace-pre-line">
                {kirbyData.result.content.privacypolicytext}
            </p>
          
           
        </div>
    )
}

export default ContactSection