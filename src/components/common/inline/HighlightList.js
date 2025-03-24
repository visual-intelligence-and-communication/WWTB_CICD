import Highlight from "./Highlight";
import { Fragment } from "react";

const HighlightList = ({ list }) => {
  return (
    <>
      {list.map((it, index) => {
        const separator = index === list.length - 1 ? "" : ",";
        return (
          <Fragment key={it}>
            <Highlight>{it}</Highlight>
            {separator}
          </Fragment>
        );
      })}
    </>
  );
};

export default HighlightList;
