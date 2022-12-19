import React from "react";
import classes from "./DbSetting.module.css";

const ExistRoom = (props) => {
  return (
    <div className={classes["roomDate-div"]}>
      {props.myCapsule.map((room) => (
        <li className={classes["exp-li"]} key={room.doc_id}>
          <div>
            <h2>{room.doc_id}</h2>
            <button className={classes["capsule-btn"]}>
              1번 타임캡슐 📦 개봉날짜
            </button>

            {room.firstCapsule.date}
          </div>
          <div>
            {room.firstCapsule.messages.map((letter) =>
              letter.writtenId.slice(0, -4)
            )}
          </div>
          <div>{room.firstCapsule.messages.length}명 작성</div>

          <div>
            <button className={classes["capsule-btn"]}>
              2번 타임캡슐 💊 개봉날짜
            </button>
            {room.secondCapsule.date}
          </div>
          <div className={classes["student-span"]}>
            {room.secondCapsule.messages.map((letter) => (
              <span className={classes["student-span"]}>
                {letter.writtenId.slice(0, -4)}
              </span>
            ))}
          </div>
          <div className={classes["student-span"]}>
            {room.secondCapsule.messages.length}명 작성
          </div>
          <hr />
        </li>
      ))}
    </div>
  );
};

export default ExistRoom;
