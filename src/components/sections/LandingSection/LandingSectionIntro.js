import formatDate from "@/utils/date/formatDate";
import Highlight from "@/components/common/inline/Highlight";
import HighlightList from "@/components/common/inline/HighlightList";
import { useEffect, useState } from "react";

export const LandingSectionIntro = ({
  cities = ["Mock City"],
  institutionCount = NaN,
  updatedAt = ["0000-01-01"],
  kText1,
  kText2,
  kText3
}) => {
  const [getToday, setToday] = useState("")
  const [getLastUpdated, setLastUpdated] = useState("")
  useEffect(() => {

    const today = formatDate(new Date(), "long");
    const lastUpdated = formatDate(new Date(updatedAt));
    setLastUpdated(lastUpdated)
    setToday(today)
  },[])

  return (
    <div>
      <Highlight>{getToday}</Highlight> {kText1}{" "}
      <Highlight>{getLastUpdated}</Highlight> {kText2}{" "}
      <Highlight>{institutionCount}</Highlight> {kText3}{" "}
      <HighlightList list={cities} /> {")"}
    </div>
  );
};
