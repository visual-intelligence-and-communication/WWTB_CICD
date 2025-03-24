import { clikedDataSectionMenuAtom } from "@/components/states";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

const SearchBox = ({ name, data }) => {
  const [openList, setOpenList] = useState(false);
  const [clikedDataSectionMenu, setclikedDataSectionMenu] = useRecoilState(clikedDataSectionMenuAtom)
  const router = useRouter();
 
  const onPush = (path) => {
    router.push(`/search/origin/${data.slug}/${path}`)
    
  }

  const onClickHandler = () => {
    setclikedDataSectionMenu(data.slug)
    setOpenList(prev => !prev)
  }

  useEffect(() => {

    if(clikedDataSectionMenu !== data.slug){
      setOpenList(false)
    }
  },[clikedDataSectionMenu])
  return (
    <div className="border-b border-gray-400 py-2 ">
      <div onClick={onClickHandler}  className={`flex cursor-pointer justify-between items-center ${openList && "border-b border-gray-400 pb-2"}`}>
        <div className="font-bold text-lg">{`${name} {${data.currentCount - data.items.filter(v => v.slug === "unknown").map((v) => v.currentCount)[0]}}`}</div>
        <div >
          {openList ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          )}
        </div>
      </div>
      {openList && (
        <div className="flex flex-col gap-1 mt-2">
          {data.items.sort((a, b) => a.label.localeCompare(b.label)).filter((value) => value.slug !== "" && value.slug !== "unknown").map((item, iIndex) => {
            return <div key={iIndex} onClick={() => onPush(item.slug)} className="active:bg-yellow-200 cursor-pointer">{item.label}</div>;
          })}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
