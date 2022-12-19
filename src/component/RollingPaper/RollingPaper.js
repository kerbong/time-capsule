import React from "react";
import classes from "./RollingPaper.module.css";
import OpenItem from "../Capsule/OpenItem";
const RollingPaper = (props) => {
  return (
    <div>
      <div className={classes["paper-image"]}>🧾</div>
      <OpenItem
        name={"롤링페이퍼"}
        capsuleId={"rolling"}
        letters={props.roomData?.rollingPaper}
      />
    </div>
  );
};

export default RollingPaper;
