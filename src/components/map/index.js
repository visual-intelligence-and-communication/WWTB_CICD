import dynamic from "next/dynamic";


let LeafletMap = dynamic(() => import("./LeafletMap"),{ssr: false})

export default LeafletMap;