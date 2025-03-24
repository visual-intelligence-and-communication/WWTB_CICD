import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { clikedMenuItemIdAtom, scrollCurrentPosForBottomNavAtom } from "../states";
import { useRecoilState, useSetRecoilState } from "recoil";
import searchI from "/public/icons/search.svg";
import toolsI from "/public/icons/tools.svg";
import storiesI from "/public/icons/stories.svg";
import aboutI from "/public/icons/about.svg";
import logoI from "/public/icons/logo.svg";
import Image from "next/image";

const BottomNav = ({ mode = false, desktopFullSize = false }) => {
  const [currentPage, setCurrentPage] = useState("");
  const setSelectMenuItem = useSetRecoilState(clikedMenuItemIdAtom);
  const [getScrollCurrentPos, setScrollCurrentPos] = useRecoilState(scrollCurrentPosForBottomNavAtom);
  const router = useRouter();

  const iconSize = 38;

  const onPush = (path) => {
    setCurrentPage(path);
    setScrollCurrentPos(path);
    if (router.pathname === "/") {
      if (path === "/") {
        router.push("#landing-section");
        setSelectMenuItem(-1);
      } else {
        router.push(`#${path}`);
        setSelectMenuItem(-1);
      }
    } else {
      router.push(`/#${path}`);
      setSelectMenuItem(-1);
    }
  };

  useEffect(() => {
    if (router.pathname !== "/") {
      setCurrentPage(router.pathname);
    }
  }, []);

  useEffect(() => {
    if (router.pathname === "/") {
      setCurrentPage(getScrollCurrentPos);
    }
  }, [getScrollCurrentPos]);
  return (
    <div className={`${!mode ? "nav-mobile" : "nav-desktop"} ${desktopFullSize && "absolute"}`}>
      <div onClick={() => onPush("/")} className="font-title leading-none text-lg">
        <Image width={iconSize * 2} height={iconSize} src={logoI} alt="search" />
      </div>
      {router.pathname === "/" && (
        <>
          <div className={`${currentPage === "data-section" ? "opacity-100" : "opacity-50"} flex items-center justify-center`} onClick={() => onPush("data-section")}>
            <Image width={iconSize} height={iconSize} src={searchI} alt="search" />
          </div>
          <div className={`${currentPage === "stories-section" ? "opacity-100" : "opacity-50"} flex items-center justify-center`} onClick={() => onPush("stories-section")}>
            <Image width={iconSize} height={iconSize} src={storiesI} alt="search" />
          </div>
          <div className={`${currentPage === "tools-section" ? "opacity-100" : "opacity-50"} flex items-center justify-center`} onClick={() => onPush("tools-section")}>
            <Image width={iconSize} height={iconSize} src={toolsI} alt="tools" />
          </div>
          <div className={`${currentPage === "contact-section" ? "opacity-100" : "opacity-50"} flex items-center justify-center`} onClick={() => onPush("contact-section")}>
            <Image width={iconSize} height={iconSize} src={aboutI} alt="about" />
          </div>
        </>
      )}
      {router.pathname !== "/" && (
        <>
          <div className={`${currentPage.split("/").some((element) => "search" === element) ? "opacity-100" : "opacity-50"} flex items-center justify-center`} onClick={() => onPush("data-section")}>
            <Image width={iconSize} height={iconSize} src={searchI} alt="search" />
          </div>
          <div className={`${currentPage.split("/").some((element) => "stories" === element) ? "opacity-100" : "opacity-50"} flex items-center justify-center`} onClick={() => onPush("stories-section")}>
            <Image width={iconSize} height={iconSize} src={storiesI} alt="search" />
          </div>
          <div className={`${currentPage === "tools-section" ? "opacity-100" : "opacity-50"} flex items-center justify-center`} onClick={() => onPush("tools-section")}>
            <Image width={iconSize} height={iconSize} src={toolsI} alt="tools" />
          </div>
          <div className={`${currentPage === "contact-section" ? "opacity-100" : "opacity-50"} flex items-center justify-center`} onClick={() => onPush("contact-section")}>
            <Image width={iconSize} height={iconSize} src={aboutI} alt="about" />
          </div>
        </>
      )}
    </div>
  );
};

export default BottomNav;
