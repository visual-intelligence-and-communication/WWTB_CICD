import { useSetRecoilState } from "recoil";
import { useEffect, useState } from "react";
import { scrollCurrentPosForBottomNavAtom } from "@/components/states";

const UseCheckCurrentSection = ({ name, sectionRef }) => {
  const setScrollCurrentPos = useSetRecoilState(scrollCurrentPosForBottomNavAtom);

  const [prevPos, setPrevPos] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const pos = sectionRef.current.getBoundingClientRect();
      // 
      const direction = pos.y - prevPos;

      // down
      if (direction < 0) {
        if (pos.y > 0 && pos.y < window.innerHeight*0.25) {
          setScrollCurrentPos(name);
        }
      }
      // up
      if (direction > 0) {
        if (pos.y < 0 && pos.y > -window.innerHeight*0.5) {
          setScrollCurrentPos(name);
        }
      }
      // // down
      // if (direction < 0) {
      //   const triggerHeight = pos.height * 0.3;
      //   if (pos.y < triggerHeight && pos.y > -(pos.height - triggerHeight)) {
      //     setScrollCurrentPos(name);
      //   }
      // }
      // // up
      // if (direction > 0) {
      //   const triggerHeight = pos.height * 0.8;
      //   if (pos.y < triggerHeight && pos.y > -(pos.height - triggerHeight)) {
      //     setScrollCurrentPos(name);
      //   }
      // }

      setPrevPos(pos.y);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevPos]);

  return null;
};

export default UseCheckCurrentSection;
