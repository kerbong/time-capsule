import React, { useRef, useState } from "react";
import classes from "./DbSetting.module.css";
import { getDocs, collection, onSnapshot, doc } from "firebase/firestore";
import { dbService } from "../../fbase";
import Swal from "sweetalert2";
import CapsuleList from "../Capsule/CapsuleList";
import RollingPaper from "../RollingPaper/RollingPaper";

const AccessRoom = (props) => {
  const [roomData, setRoomData] = useState({});

  const roomNameInput = useRef();
  const namePwInput = useRef();

  const submitHandler = async (e) => {
    e.preventDefault();

    const roomName = roomNameInput.current.value;
    const namePw = namePwInput.current.value;
    //방이 존재하고 내아이디가 있으면, 방정보 불러와서 저장해두기
    if (props.capsuleNames?.includes(roomName)) {
      onSnapshot(doc(dbService, "capsule", roomName), (doc) => {
        if (doc.data().studentsInfo?.includes(namePw)) {
          Swal.fire({
            icon: "success",
            title: "접속완료",
            text: `해당 방에 내정보(${namePw})로 접속했습니다!`,
            showConfirmButton: true,
            timer: 5000,
          });
          setRoomData({ ...doc.data() });
        } else {
          Swal.fire({
            icon: "error",
            title: "이름/비번확인",
            text: "이름과 비번이 틀렸어요! 다시 확인해주세요!",
          });
        }
      });
    }
  };
  return (
    <div>
      {Object.keys(roomData).length === 0 ? (
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
          <button onClick={submitHandler}>접속</button>
        </form>
      ) : (
        <>
          첫번재 캡슐과 두번째 캡슐 보여주기
          <CapsuleList roomData={roomData} />
          <RollingPaper />
          {/* 열리기 까지 남은시간 보여주기... */}
        </>
      )}
      {/* 선생님이 만든 방 번호를 적은 후 접속되면 학급 방, 자기방 버튼을 보여줌. 학급방 누르면 전체 데이터들 보여줌. 자기방을 누르면 자신의 이름, 비밀번호 입력창이 보이고, 2차 접속. */}
    </div>
  );
};

export default AccessRoom;
