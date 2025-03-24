import NotFoundPage from "@/components/notfounds/NotFoundPage";
import SearchLayout from "@/components/sections/DataSection/SearchLayout";
import { fetchData } from "@/hooks/useFetchData";
import { getRegionInstitution } from "@/utils/database/grist";
import { getGristIntro } from "@/utils/database/grist/gristSections";
import { useEffect } from "react";

export default function Page({ data, dataGristIntro, kirbyData }) {
 
  useEffect(() => {
    
  },[]) 
  if(data.length === 0){
    return <>
    <NotFoundPage />
  </>
  }

  return (<SearchLayout data={data} dataGristIntro={dataGristIntro} kirbyData={kirbyData} />)
}

export async function getServerSideProps({ params: { slug } }) {
  const authEmail = process.env.KIRBY_USERNAME;
  const authPassword = process.env.KIRBY_PASSWORD;
  const backendApi = process.env.KIRBY_URL;

  const kirbyPageApiData = "?query=page('data-section')";
  const kirbyApiData = new URL(kirbyPageApiData, backendApi);

  const encodedAuthString = Buffer.from(`${authEmail}:${authPassword}`).toString("base64");
  const headerAuthString = `Basic ${encodedAuthString}`;

 

  const getData = await fetchData({url: kirbyApiData, headerAuthString});

  const data = await getRegionInstitution({ slug }); 
  const dataGristIntro = await getGristIntro();
  
  try {
    return {
      props: { data, dataGristIntro, kirbyData: getData },
    };
  } catch (error) {
    console.error(error);
  }
}

// export async function getStaticPaths(i18nContext) {
//   try {
//     const regions = await getRegion();
//     const paths = regions
//       .map((it) => ({
//         params: { name: it.label, slug: it.slug },
//       }))
//       .filter((it) => it.slug !== "unknown");

//     return {
//       paths,
//       fallback: false,
//     };
//   } catch (error) {
//     console.error(error);
//   }
// }
