import React, { useEffect, useRef, useState } from "react";
import classes from "./DbSetting.module.css";
import { updateDoc, onSnapshot, doc, getDoc } from "firebase/firestore";
import { dbService } from "../../fbase";
import Swal from "sweetalert2";
import CapsuleList from "../Capsule/CapsuleList";
import RollingPaper from "../RollingPaper/RollingPaper";

const AccessRoom = (props) => {
  const [roomData, setRoomData] = useState({});
  const [userNamePw, setUserNamePw] = useState("");
  const [room, setRoom] = useState("");
  const [roomName, setRoomName] = useState("");
  const [namePw, setNamePw] = useState("");

  const roomNameInput = useRef();
  const namePwInput = useRef();

  const getRoomDb = () => {
    //방이 존재하고 내아이디가 있으면, 방정보 불러와서 저장해두기
    if (props.capsuleNames?.includes(roomName)) {
      onSnapshot(doc(dbService, "capsule", roomName), (doc) => {
        // setRoomData({})
        if (doc.data().studentsInfo?.includes(namePw)) {
          setUserNamePw(namePw);
          setRoomData({ ...doc.data() });
          setRoom(roomName);
        } else {
          Swal.fire({
            icon: "error",
            title: "이름/비번확인",
            text: "이름과 비번이 틀렸어요! 다시 확인해주세요!",
          });
        }
      });
      Swal.fire({
        icon: "success",
        title: "접속완료",
        text: `해당 방에 '${namePw}'로 접속했습니다!`,
        showConfirmButton: true,
        timer: 5000,
      });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    setRoomName(roomNameInput.current.value);
    setNamePw(namePwInput.current.value);
  };

  useEffect(() => {
    getRoomDb();
  }, [namePw, roomName]);

  const saveLetter = async (filed, text, pubOrPerson) => {
    const data = {
      text: text,
      public: pubOrPerson === "public" ? true : false,
      writtenId: userNamePw,
    };
    const letterRef = doc(dbService, "capsule", room);
    // console.log(filed, text, pubOrPerson);
    // console.log(data);
    //최신 정보 받아와서 저장하기..

    const ex_doc = await getDoc(letterRef);
    if (filed === "capsule1") {
      const new_messages = [...ex_doc?.data()?.firstCapsule?.messages];
      new_messages.push(data);
      await updateDoc(letterRef, {
        firstCapsule: {
          date: roomData.firstCapsule.date,
          messages: new_messages,
        },
      });
    }
    if (filed === "capsule2") {
      const new_messages = [...ex_doc?.data()?.secondCapsule?.messages];
      new_messages.push(data);
      await updateDoc(letterRef, {
        secondCapsule: {
          date: roomData.secondCapsule.date,
          messages: new_messages,
        },
      });
    }
  };

  const logOutHandler = () => {
    setRoomData({});
    setUserNamePw("");
    setRoom("");
    setRoomName("");
    setNamePw("");
  };

  return (
    <div>
      {Object.keys(roomData).length === 0 ? (
        <>
          <form onSubmit={(e) => submitHandler(e)}>
            <input
              className={classes["room-input"]}
              type="text"
              ref={roomNameInput}
              placeholder="접속할 방이름"
              maxLength={"20"}
              autoFocus={true}
            />
            <input
              className={classes["room-input"]}
              type="text"
              ref={namePwInput}
              placeholder="내이름+비번"
              maxLength={"10"}
            />
            <button className={classes["capsule-btn"]} onClick={submitHandler}>
              접속
            </button>
          </form>
          <button
            className={classes["capsule-btn"]}
            onClick={() => {
              props.loginTypeHandler();
            }}
          >
            뒤로
          </button>
        </>
      ) : (
        <>
          <CapsuleList
            roomData={roomData}
            userId={userNamePw}
            saveLetter={(filed, text, pubOrPerson) => {
              saveLetter(filed, text, pubOrPerson);
            }}
            roomName={roomName}
            logOutHandler={logOutHandler}
          />
          {/* <RollingPaper roomData={roomData} /> */}
          {/* 열리기 까지 남은시간 보여주기... */}
        </>
      )}
    </div>
  );
};

export default AccessRoom;
