import { clikedMenuItemIdAtom, currentMenuItemArrayIdAtom } from "@/components/states";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";



const MenuItem = ({value, id}) => {
  const [seleced, setSelected] = useState(false);
  const [selecedAtom, setSelectedAtom] = useRecoilState(clikedMenuItemIdAtom)
  const onClickHandler = () => {
    if(!seleced){
        setSelectedAtom(value.id)
      
        setSelected(true)

    }else{

    }
  }

  useEffect(() => {
      if(selecedAtom !== value.id){
          setSelected(false)
        }
        if(selecedAtom === -1){
            setSelected(false)
        }
        if(selecedAtom === value.id){
        // 
        setSelected(true)
    }
  },[selecedAtom]);


  return (
    <div
      key={value.id}
      onClick={onClickHandler}
      className={`transition-all focus:outline-none rounded-full min-h-[32px] max-h-[42px] w-[130px] flex items-center overflow-hidden ${!seleced ? "bg-white border-black text-black" : "bg-black text-white"}  px-3 py-1 border  cursor-pointer focus:bg-black active:bg-black active:text-white `}
    >
      <span className="text-xs">{String(value.institution.label).slice(0, 20)}...</span>
    </div>
  );
};

export default MenuItem;
