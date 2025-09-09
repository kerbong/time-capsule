import React from "react";
import classes from "./DbSetting.module.css";

const ExistRoom = (props) => {
  // 학생 이름 중복 제거 및 정렬 함수
  const getUniqueNames = (messages) => {
    const names = messages.map((letter) => letter.writtenId.slice(0, -4));
    return Array.from(new Set(names));
  };


  // 학생 이름 한 줄로만 출력
  const renderNames = (names) => names.join(' ');

  return (
    <div className={classes["roomDate-div"]}>
      {props.myCapsule.map((room) => {
        // 1번 타임캡슐
        const firstNames = getUniqueNames(room.firstCapsule.messages);
        // 2번 타임캡슐
        const secondNames = getUniqueNames(room.secondCapsule.messages);
        return (
          <li className={classes["exp-li"]} key={room.doc_id}>
            <div style={{ textAlign: "center" }}>
              <h2>{room.doc_id}</h2>
              <button className={classes["capsule-btn"]} style={{ margin: "0 auto", display: "block", lineHeight: 1.3 }}>
                1번 타임캡슐 📦 개봉날짜<br />
                <span style={{ fontWeight: 700, color: '#fff', fontSize: '1.1em', display: 'block', marginTop: 4 }}>{room.firstCapsule.date}</span>
              </button>
            </div>
            <div style={{ margin: "10px 0", textAlign: "center" }}>
              {firstNames.length > 0 && <div>{renderNames(firstNames)}</div>}
              {firstNames.length > 0 && <div style={{ marginTop: "10px" }}>{firstNames.length}명 작성</div>}
              {firstNames.length === 0 && <div style={{ marginTop: "10px" }}>0명 작성</div>}
            </div>
            <div style={{ textAlign: "center", marginTop: "30px" }}>
              <button className={classes["capsule-btn"]} style={{ margin: "0 auto", display: "block", lineHeight: 1.3 }}>
                2번 타임캡슐 💊 개봉날짜<br />
                <span style={{ fontWeight: 700, color: '#fff', fontSize: '1.1em', display: 'block', marginTop: 4 }}>{room.secondCapsule.date}</span>
              </button>
            </div>
            <div style={{ margin: "10px 0", textAlign: "center" }}>
              {secondNames.length > 0 && <div>{renderNames(secondNames)}</div>}
              {secondNames.length > 0 && <div style={{ marginTop: "10px" }}>{secondNames.length}명 작성</div>}
              {secondNames.length === 0 && <div style={{ marginTop: "10px" }}>0명 작성</div>}
            </div>
            <hr />
          </li>
        );
      })}
    </div>
  );
};

export default ExistRoom;
