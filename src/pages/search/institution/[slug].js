import Layout from "@/components/layouts/Layout";
import { getDatabaseUpdatedAt, getInstitution, getOrigin } from "@/utils/database/grist";
import { getGristInstitutionUnderMicroscope } from "@/utils/database/grist/gristSections";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchData } from "@/hooks/useFetchData";
import Highlight from "@/components/common/inline/Highlight";
import CirclePackingContainer from "@/components/sections/DataSection/institution/CirclePackingContainer";

export default function Page({ data, updatedAt, kirbyData, dataForAddress, data2 }) {
  const router = useRouter();
  const [totalCount, setTotalCount] = useState(0);
  const [institutionName, setInstitutionName] = useState("");
  const [selectedQueryCount, setSelectedQueryCount] = useState(0);
  const [selectedQueryContinent, setSelectedQueryContinent] = useState("");
  const [getSelectedQueryInfo, setSelectedQueryInfo] = useState("");
  const [getSelectedQueryCategory, setSelectedQueryCategory] = useState("");
  const [getUpdatedAt, setUpdatedAt] = useState("");
  const [getTargetForCirclePacking, setTargetForCirclePacking] = useState("");

  let totalContinent = {};
  const getTotalInstitutionCount = () => {
    totalContinent = {}; // This code is just for react use strict because react runs two times
    [...data]
      .map((value) => {
        return value;
      })
      .forEach((value) => {
        if (totalContinent[value.parent]) {
          if (value.category === "unknown") {
            totalContinent[value.category] = totalContinent[value.parent] + value.currentCount;
          } else {
            totalContinent[value.parent] = totalContinent[value.parent] + value.currentCount;
          }
          // totalContinent[value.parent] = totalContinent[value.parent] + value.currentCount;
        } else {
          if (value.category === "unknown") {
            totalContinent[value.category] = value.currentCount;
          } else {
            totalContinent[value.parent] = value.currentCount;
          }
          // totalContinent[value.parent] = value.currentCount;
        }
      });
    const totalContinentCount = Object.values(totalContinent).reduce((prev, curr) => prev + curr);

    // setTotalCount(totalContinentCount);
    setTotalCount(data[0].currentCount);
  };

  const getInstitutionNaame = () => {
    const getName = data.filter((value) => value.category === "institution")[0].label;

    setInstitutionName(getName);
  };
  

  const getSelectedQuery = () => {
    //TODO: if the items has one group and the itmes has multiple groups exist together then how?
    const urlParams = new URLSearchParams(window.location.search);
    const target = urlParams.get("target");
    
    // The length should be 1 here. If not then Grist has a problem
    let selectedQueryInfo = data.filter((value) => value.slug === target && (value.currentCount > 0 || value.category === "continent"));

   
    if (selectedQueryInfo.length < 1 || selectedQueryInfo[0].currentCount < 1) {
      const findOrign = data2.filter((value) => String(value.fields.original_group).toLocaleLowerCase() === String(target).toLocaleLowerCase());
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < findOrign.length; j++) {
          if ((data[i].originCategory === findOrign[j].id) && !Boolean(data[i].currentCount <= 0)) {
            selectedQueryInfo.push(data[i]);
          }
        }
      }
    }


    if (selectedQueryInfo.length >= 0) {
      if (selectedQueryInfo[0]?.parent) {
        setSelectedQueryInfo(Array.from(new Set([...selectedQueryInfo].map(value => value.label))));
        setSelectedQueryContinent(Array.from(new Set([selectedQueryInfo[0].parent])));
        setSelectedQueryCategory(Array.from(new Set([selectedQueryInfo[0].category])));
        if (selectedQueryInfo[0].category === "continent") {
          setSelectedQueryCount(totalContinent[target]);
        } else {
          const counts = selectedQueryInfo.map(value => value.currentCount)
          setSelectedQueryCount(counts.reduce((a,b) => a + b, 0));
        }
      } else {
        setSelectedQueryContinent("ERROR");
      }
    }

  };

  useEffect(() => {
    const date = new Date(updatedAt.updatedAt);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    setUpdatedAt(`${day}.${month}.${year}`);
    getTotalInstitutionCount();

    getInstitutionNaame();
    getSelectedQuery();
  }, []);
  const onPushNewSearch = () => {
    router.push(`/#data-section`);
  };

  return (
    <Layout layout="bottom" size={false}>
      <div className="w-full h-fit overflow-y-scroll relative flex flex-col justify-between py-4">
        <div className="flex flex-col justify-between mb-8">
          <div className="flex flex-col gap-4">
            <div>
              {kirbyData.result.content.institutionsummaryintro} <span className="font-bold">{institutionName}</span> <Highlight>{selectedQueryCount}</Highlight> {kirbyData.result.content.institutionsummaryspecificcount} <Highlight>{totalCount}</Highlight>{" "}
              {kirbyData.result.content.institutionsummarytotalcount}{" "}
              <Highlight>
              {
                getSelectedQueryInfo.length >= 1 && getSelectedQueryInfo.map((value, index) => {
                  return (
                    <span key={index}>
                    {value.charAt(0).toLocaleUpperCase()}
                    {value.slice(1)}{getSelectedQueryInfo.length !== index + 1 && " & "}
                    </span>
                  )
                })
              }
              </Highlight>
              {getSelectedQueryCategory.length === 1 ? getSelectedQueryCategory[0] !== "continent" && "," : getSelectedQueryCategory !== "continent" && ","}
              {(getSelectedQueryCategory.length === 1 ? getSelectedQueryCategory[0] : getSelectedQueryCategory) !== "continent" && (
                <Highlight>
                  {(selectedQueryContinent.length === 1 ? selectedQueryContinent[0] : selectedQueryContinent).charAt(0).toLocaleUpperCase()}
                  {(selectedQueryContinent.length === 1 ? selectedQueryContinent[0] : selectedQueryContinent).slice(1)}
                </Highlight>
              )}
            </div>
            <div className="text-sm text-zinc-700 flex flex-col gap-2">
              <div className="">
                <div className="font-bold">Address:</div>
                <div>{dataForAddress[0].address}</div>
              </div>
              <div className="">
                <div className="font-bold">Data last updated:</div>
                <div>{getUpdatedAt}</div>
              </div>
            </div>
          </div>
        </div>
        <CirclePackingContainer data={data} kirbyData={kirbyData} data2={data2} />
        <div className="w-full h-fit flex flex-col items-center pb-4">
          <div onClick={onPushNewSearch} className="btn-xs">
            Back to Search
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params: { slug } }) {
  const authEmail = process.env.KIRBY_USERNAME;
  const authPassword = process.env.KIRBY_PASSWORD;
  const backendApi = process.env.KIRBY_URL;

  const kirbyPageApiData = "?query=page('data-section')";
  const kirbyApiData = new URL(kirbyPageApiData, backendApi);

  const encodedAuthString = Buffer.from(`${authEmail}:${authPassword}`).toString("base64");
  const headerAuthString = `Basic ${encodedAuthString}`;

  const getData = await fetchData({ url: kirbyApiData, headerAuthString });
  const data = await getGristInstitutionUnderMicroscope({ slug });
  const data2 = await getOrigin();
  const dataForAddress = await getInstitution({ slug });
  const updatedAt = await getDatabaseUpdatedAt();
  try {
    return {
      props: { data, updatedAt, kirbyData: getData, dataForAddress, data2 },
    };
  } catch (error) {
    console.error(error);
  }
}

// export async function getStaticPaths(i18nContext) {
//   try {
//     const institutions = await getInstitution();

//     const paths = institutions
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
