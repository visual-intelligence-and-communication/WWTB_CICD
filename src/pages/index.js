import LandingSection from "@/components/sections/LandingSection";
import ToolsSection from "@/components/sections/ToolsSection";
import HandleKirbyError from "@/components/layouts/HandleKirbyError";
import Layout from "@/components/layouts/Layout";
import { getGristIntro, getGristOriginSelection } from "@/utils/database/grist/gristSections";
import DataSection from "@/components/sections/DataSection";
import StoriesSection from "@/components/sections/StoriesSection";
import ContactSection from "@/components/sections/ContactSection";
import { fetchAllDataf } from "@/hooks/useFetchData";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Home({ data, notFound = false, error }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if(data){
      setIsLoading(false);
    }
  }, [data]);

  useEffect(() => {
    if(notFound){
      console.log(error)
    }
  },[])
  if (notFound) {
    return <HandleKirbyError />;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Layout layout="bottom">
        <LandingSection id={"landing-section"} {...data.dataGristIntro} kirbyData={data.dataKirby["landing-section"]} />
        <DataSection id={"data-section"} data={data.dataGristOriginSelection} kirbyData={data.dataKirby["data-section"]} />
        <StoriesSection id={"stories-section"} kirbyData={data.dataKirby["stories-section"]} />
        <ToolsSection id={"tools-section"} kirbyData={data.dataKirby["tools-section"]} />
        <ContactSection id={"contact-section"} kirbyData={data.dataKirby["contact-section"]} />
      </Layout>
    </>
  );
}

// getServerSideProps
export async function getServerSideProps() {
  const authEmail = process.env.KIRBY_USERNAME;
  const authPassword = process.env.KIRBY_PASSWORD;
  const backendApi = process.env.KIRBY_URL;

  const kirbyPageApiContact = "?query=page('contact-section')";
  const kirbyApiContact = new URL(kirbyPageApiContact, backendApi);
  const kirbyPageApiLanding = "?query=page('landing-section')";
  const kirbyApiLanding = new URL(kirbyPageApiLanding, backendApi);
  const kirbyPageApiStories = "?query=page('stories-section')";
  const kirbyApiStories = new URL(kirbyPageApiStories, backendApi);
  const kirbyPageApiData = "?query=page('data-section')";
  const kirbyApiData = new URL(kirbyPageApiData, backendApi);
  const kirbyPageApiTools = "?query=page('tools-Section')";
  const kirbyApiTool = new URL(kirbyPageApiTools, backendApi);

  const kirbyApi = [kirbyApiContact, kirbyApiLanding, kirbyApiStories, kirbyApiData, kirbyApiTool];

  const encodedAuthString = Buffer.from(`${authEmail}:${authPassword}`).toString("base64");
  const headerAuthString = `Basic ${encodedAuthString}`;

  try {
    const dataGristIntro = await getGristIntro();
    const dataGristOriginSelection = await getGristOriginSelection();
    const getData = await fetchAllDataf({ urls: kirbyApi, headerAuthString });
    const dataKirby = {};

    getData.forEach((value) => {
      dataKirby[value.result.id] = value;
    });

    // Stories/story
    const kirbyStoryDraftApi = await dataKirby["stories-section"].result.children.map((value) => {
      const kirbyPageApiDraft = `?query=page('${value}')`;
      const kirbyApiDraft = new URL(kirbyPageApiDraft, backendApi);
      return kirbyApiDraft;
    });
    dataKirby["stories-section"]["result"]["stories"] = await fetchAllDataf({ urls: kirbyStoryDraftApi, headerAuthString });

    // Kirby Site Page
    // const kirbyPageApiSite = "";
    // const kirbyApiSite = new URL(kirbyPageApiSite, backendApi);
    // const getKirbySitePage = await fetchData({url: kirbyApiSite, headerAuthString})
    //

    const metaData ={
      description: "We want them Back! makes information about Ancestral Remains of ancestors from colonial contexts accessible and visible.",
      title: "we want them back",
      type: "website",
      url: "https://wewantthemback.berlin",
      image: "/public/images/wewantthemback-logo.png"
    }

    return {
      props: { data: { dataGristIntro, dataGristOriginSelection, dataKirby, metaData} },
    };
  } catch (error) {
    console.error(error);

    return {
      props: {
        notFound: true,
        error: error
      },
    };
  }
}
