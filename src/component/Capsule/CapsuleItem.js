import React, { useEffect, useState } from "react";
import classes from "./Capsule.module.css";
import Swal from "sweetalert2";

const CapsuleItem = (props) => {
  const [existPublic, setExistPublic] = useState(false);
  const [existPersonal, setExistPersonal] = useState(false);

  useEffect(() => {
    if (props.letterExist[`${props.capsuleId}public`]) {
      setExistPublic(true);
    }
    if (props.letterExist[`${props.capsuleId}personal`]) {
      setExistPersonal(true);
    }
  }, []);

  const writeLetter = (pubOrPerson) => {
    Swal.fire({
      title: "편지 내용을 작성해주세요.",
      input: "textarea",
      inputAttributes: {
        autocapitalize: "off",
        maxlength: 500,
      },
      showCancelButton: true,
      cancelButtonText: "취소",
      confirmButtonText: "저장",
    }).then((result) => {
      if (result.isConfirmed) {
        // console.log(result.value);
        props.saveLetter(props.capsuleId, result.value, pubOrPerson);
        if (pubOrPerson === "public") {
          setExistPublic(true);
        } else {
          setExistPersonal(true);
        }
      }
    });
  };

  return (
    <div>
      {" "}
      <div>
        <h2>타임캡슐{props.num}</h2>
      </div>
      <div id={props.capsuleId}></div>
      <div className={classes["classMe-div"]}>
        <li
          className={`${classes["classMe-li"]} ${
            existPublic ? classes["letterExist"] : ""
          }`}
          onClick={() => {
            //아직 작성하지 않았으면
            if (!existPublic) {
              console.log("아직 작성안함");
              writeLetter("public");
              //   작성했고 시간이 지났으면 팝업창으로?? 적었던 메세지들 보여주기
            } else {
            }
          }}
        >
          📦 우리반에게
        </li>
        <li
          className={`${classes["classMe-li"]} ${
            existPersonal ? classes["letterExist"] : ""
          }`}
          onClick={() => {
            //아직 작성하지 않았으면
            if (!existPersonal) {
              console.log("아직 작성안함");
              writeLetter("personal");
              //   작성했고 시간이 지났으면 팝업창으로?? 적었던 메세지들 보여주기
            } else {
            }
          }}
        >
          💊 나에게
        </li>
      </div>
    </div>
  );
};

export default CapsuleItem;
