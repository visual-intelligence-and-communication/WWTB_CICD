import Layout from "@/components/layouts/Layout";
import { forceUpdate, storiesData } from "@/components/states";
import { useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import ReactAudioPlayer from "react-audio-player";
import { stripHTML } from "@/hooks/useRmoveHtmlTag";
import Image from "next/image";
const { useRouter } = require("next/router");


const STitle = ({ text, level }) => {
  const textH = stripHTML(text);
  return (
    <div
      className={`
      break-words
      font-title
  ${level === "h1" && "text-7xl font-bold"}
  ${level === "h2" && "text-5xl font-bold mb-4"}
  ${level === "h3" && "text-2xl text-blue-500 font-medium mb-8"}
  ${level === "h4" && "text-2xl font-medium mb-8"}
  ${level === "h5" && "text-lg text-blue-500 font-medium mb-8"}
  ${level === "h6" && "text-lg font-medium mb-8"}
  `}
    >
      {textH}
    </div>
  );
};

const SText = ({ text }) => {
  const textH = stripHTML(text);
  return <div className="text-sm ">{textH}</div>;
};

const SImages = ({ caption, files }) => {
  const [urls, setUrls] = useState([]);
  const captionText = stripHTML(caption)

  useEffect(() => {
    const getUrls = files.map((value) => {
      const u = `${process.env.KIRBY_URL_FOR_FILE}/@/file/${String(value).slice(7)}`;
      return {
        original: u,
        thumbnail: u,
      };
    });
    setUrls(getUrls);
  }, []);

  return (
    <div className="my-2">
      <div className="w-full aspect-video overflow-hidden my-3 flex justify-center items-center">{urls.length > 0 && <ImageGallery autoPlay={true} fullscreen={true} infinite={true} showFullscreenButton={false} showNav={true} showBullets={false} showPlayButton={false} showThumbnails={false} items={urls} />}</div>
      <div className="text-caption">{captionText}</div>
    </div>
  );
};

const SQuote = ({ text, citation }) => {
  const textH = stripHTML(text);
  const citationText = stripHTML(citation);
  return (
    <div className="my-4 border-l-2 border-black px-3">
      <div className="text-lg">{textH}</div>
      <div className="text-caption">{citationText}</div>
    </div>
  );
};

const SAudio = ({ audioFile }) => {
  useEffect(() => {}, []);
  return (
    <div className="my-3">
      <ReactAudioPlayer src={`${process.env.KIRBY_URL_FOR_FILE}/@/file/${String(audioFile[0]).slice(7)}`} autoPlay={false} controls />
    </div>
  );
};

const SVideo = ({ caption, url }) => {
  const captionText = stripHTML(caption);
  return (
    <div className="my-4">
      <div className="aspect-video">
        <ReactPlayer muted={false} width={"100%"} height={"100%"} url={url} controls={true} />
      </div>
      <div className="text-caption">{captionText}</div>
    </div>
  );
};

const SImage = ({ caption, url }) => {
  const captionText = stripHTML(caption);
  return (
    <div className="my-2 relative w-full aspect-square">
      <Image 
      src={`https://${String(process.env.KIRBY_URL_FOR_FILE).slice(2)}/@/file/${String(url).slice(7)}`} 
      fill
      alt=""
      style={{objectFit: "cover"}}
      />
      {/* <img className="w-full h-full" src={`${process.env.KIRBY_URL_FOR_FILE}/@/file/${String(url).slice(7)}`} /> */}
      <div className="text-caption">{captionText}</div>
    </div>
  );
};
const StoryPage = () => {
  const router = useRouter();
  const getStoriesData = useRecoilValue(storiesData);
  const [getStoryData, setStoryData] = useState([]);
  const [getStoryDataMore, setStoryDataMore] = useState([]);
  const getForecUpdate = useRecoilValue(forceUpdate);
  useEffect(() => {
    if (getStoriesData.length === 0) {
      // redirecting
      router.push("/");
    }

    let findIndex = -1;
    const findStory = getStoriesData.find((value, index) => {
      findIndex = index;
      return value.result.slug === router.query.slug;
    });

    const moreStories = [...getStoriesData].filter((value, index) => {
      if (index !== findIndex) {
        return value;
      }
    });

    setStoryDataMore(moreStories);
    if (!Boolean(findStory)) {
      router.push("/");
    } else {
      const blocksData = JSON.parse(findStory.result.content.text);

      setStoryData(blocksData);
    }
  }, [getForecUpdate]);
  return (
    <Layout>
      <div className="py-3 pb-20 w-full overflow-hidden">
        {getStoryData.length > 0 &&
          getStoryData.map((value) => {
            if (value.type === "heading") {
              return <STitle key={value.id} text={value.content.text} level={value.content.level} />;
            } else if (value.type === "text") {
              return <SText key={value.id} text={value.content.text} />;
            } else if (value.type === "gallery") {
              return <SImages key={value.id} caption={value.content.caption} files={value.content.images} />;
            } else if (value.type === "quote") {
              return <SQuote key={value.id} text={value.content.text} citation={value.content.citation} />;
            } else if (value.type === "audio") {
              return <SAudio key={value.id} audioFile={value.content.audiofile} />;
            } else if (value.type === "video") {
              return <SVideo key={value.id} caption={value.content.caption} url={value.content.url} />;
            } else if (value.type === "image") {
              return <SImage key={value.id} caption={value.content.caption} url={value.content.image[0]} />;
            } else {
              return (
                <div key={value.id} className="bg-yellow-300">
                  check type
                </div>
              );
            }
          })}
      </div>
    </Layout>
  );
};

export default StoryPage;
