import React, { useEffect, useState } from "react";
import classes from "./Capsule.module.css";
import useInterval from "../../hooks/useInterval";
import CapsuleItem from "./CapsuleItem";
import OpenItem from "./OpenItem";
import Swal from "sweetalert2";

const CapsuleList = (props) => {
  const [showCap1, setShowCap1] = useState(false);
  const [showCap2, setShowCap2] = useState(false);
  const [showRolling, setShowRolling] = useState(false);
  const [onDateCap1, setOnDateCap1] = useState(false);
  const [onDateCap2, setOnDateCap2] = useState(false);
  const [letterExist, setLetterExist] = useState({});
  const [roomData, setRoomData] = useState({});

  useEffect(() => {
    setRoomData({ ...props.roomData });
  }, [props.roomData]);

  useEffect(() => {
    let new_letterExist = {};
    const checkExistLetter = (data, capsule) => {
      data?.messages?.forEach((mess) => {
        if (mess.writtenId === props.userId) {
          if (mess.public) {
            new_letterExist[`${capsule}public`] = true;
          } else {
            new_letterExist[`${capsule}personal`] = true;
          }
        }
      });
    };
    checkExistLetter(roomData?.firstCapsule, "capsule1");
    checkExistLetter(roomData?.secondCapsule, "capsule2");
    // console.log(new_letterExist);
    setLetterExist({ ...new_letterExist });
  }, [roomData]);

  //남은시간 계산해주는 함수
  const returnGapTime = (toData) => {
    let dday = new Date(toData).getTime();
    let today = new Date().getTime();
    return dday - today;
  };

  //매초 실행할 함수
  useInterval(() => {
    let gap1 = returnGapTime(roomData.firstCapsule.date);
    //만약 갭이 0보다 크면, 즉 아직 때가 안되었으면.. 남은시간 보여주고
    if (gap1 > 0) {
      showRemainTime(gap1, "capsule1");
    } else {
      if (onDateCap1 === false) {
        setOnDateCap1(true);
      }
    }
  }, 1000);

  useInterval(() => {
    let gap2 = returnGapTime(roomData.secondCapsule.date);

    if (gap2 > 0) {
      showRemainTime(gap2, "capsule2");
    } else {
      if (onDateCap2 === false) {
        // console.log("열렸어요!");
        setOnDateCap2(true);
      }
    }
  }, 1000);

  //남은시간 보여주는 함수
  const showRemainTime = (gap, what) => {
    let el = document.getElementById(what);

    let day = Math.floor(gap / (1000 * 60 * 60 * 24));
    let hour = Math.floor((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let min = Math.floor((gap % (1000 * 60 * 60)) / (1000 * 60));
    let sec = Math.floor((gap % (1000 * 60)) / 1000);

    if (el !== null) {
      el.innerHTML =
        "D-Day : " + day + "일 " + hour + "시간 " + min + "분 " + sec + "초";
    }
  };

  const logOutHandler = () => {
    Swal.fire({
      icon: "question",
      title: `로그아웃 할까요?`,
      showConfirmButton: true,
      showDenyButton: true,
      confirmButtonText: "확인",
      denyButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        // 로그아웃하기
        props.logOutHandler();
      }
    });
  };

  return (
    <div>
      <button className={classes["logout-btn"]} onClick={logOutHandler}>
        로그아웃
      </button>

      {/* 타임캡슐 1번 */}
      <div>
        <div
          className={classes["capsule-image"]}
          onClick={() => {
            setShowCap1((prev) => !prev);
          }}
        >
          🎁
        </div>
        {/* // {남은시간 계산해서 보여주기} */}
        {showCap1 &&
          // 아직 안열렸으면? 열렸으면
          (!onDateCap1 ? (
            <>
              <CapsuleItem
                num={1}
                capsuleId={"capsule1"}
                letterExist={letterExist}
                saveLetter={(filed, text, pubOrPerson) => {
                  props.saveLetter(filed, text, pubOrPerson);
                }}
              />
            </>
          ) : (
            <>
              <OpenItem
                name={"캡슐1"}
                userId={props.userId}
                capsuleId={"capsule1"}
                letters={roomData?.firstCapsule?.messages}
              />
            </>
          ))}
      </div>
      {/* 타임캡슐 2번 */}
      <div>
        <div
          className={classes["capsule-image"]}
          onClick={() => {
            setShowCap2((prev) => !prev);
          }}
        >
          {" "}
          📮
        </div>
        {/* // {남은시간 계산해서 보여주기} */}
        {showCap2 &&
          // 아직 안열렸으면? 열렸으면
          (!onDateCap2 ? (
            <>
              <CapsuleItem
                num={2}
                capsuleId={"capsule2"}
                letterExist={letterExist}
                saveLetter={(filed, text, pubOrPerson) => {
                  props.saveLetter(filed, text, pubOrPerson);
                }}
              />
            </>
          ) : (
            <>
              <OpenItem
                name={"캡슐2"}
                userId={props.userId}
                capsuleId={"capsule2"}
                letters={roomData?.secondCapsule?.messages}
              />
            </>
          ))}
      </div>

      {/* 내가 안 쓴 쪽찌가 있으면 css로 구분. 쓴건 회색, 안쓴건 컬러풀.. */}
      {/* 총 2개의 캡슐이 보이고 그 아래에 내가 썼는지(나, 우리에게) 가 보임.*/}
      {/**/}
    </div>
  );
};

export default CapsuleList;
