import React, { useState } from "react";
import classes from "./Capsule.module.css";
import Swal from "sweetalert2";
import Modal from "../Layout/Modal";

const OpenItem = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [onItemNum, setOnItemNum] = useState(0);
  const [letters, setLetters] = useState([]);

  const showLetter = (pubOrPerson) => {
    let letters = [];

    let isPublic = pubOrPerson === "public" ? true : false;
    props?.letters?.forEach((letter) => {
      if (letter.public === isPublic) {
        //개인용의 경우에는 내것만 보여주기
        if (!isPublic) {
          if (letter.writtenId === props.userId) {
            letters.push(letter);
          }
        } else {
          letters.push(letter);
        }
      }
    });

    //만약 데이터가 없을 경우 편지가 없어요! 보여주기
    if (letters.length > 0) {
      setLetters([...letters]);
      setShowModal((prev) => !prev);
    } else {
      Swal.fire({
        icon: "error",
        title: "캡슐텅텅",
        text: "타임캡슐에 작성한 내용이 없습니다.",
      });
    }
  };

  const prev = () => {
    if (onItemNum > 0) {
      setOnItemNum((prev) => prev - 1);
    }
  };
  const next = () => {
    if (onItemNum < letters.length - 1) {
      setOnItemNum((prev) => prev + 1);
    }
  };

  return (
    <div>
      {showModal && (
        <Modal
          onClose={() => {
            setShowModal(false);
            setOnItemNum(0);
          }}
        >
          <div className={classes["modal-div"]}>
            {/* 닫기버튼 */}
            <div
              className={classes["closebtn-div"]}
              onClick={() => {
                setShowModal(false);
                setOnItemNum(0);
              }}
            >
              ✖
            </div>
            {/* 편지내용 */}
            <div>
              <h2>{letters[onItemNum].text}</h2>
            </div>
            {/* 글쓴이 */}
            <div className={classes["writter-div"]}>
              <h3>from {letters[onItemNum].writtenId.slice(0, -4)}</h3>
            </div>
            {/* 이전다음 버튼 */}
            <div className={classes["btn-div"]}>
              <button className={classes["nextPrev-btn"]} onClick={prev}>
                이전
              </button>
              <button className={classes["nextPrev-btn"]} onClick={next}>
                다음
              </button>
            </div>
          </div>
        </Modal>
      )}{" "}
      <h2>{props.name}오픈! 두근두근💌</h2>
      <div id={props.capsuleId}></div>
      <div className={classes["classMe-div"]}>
        {/* 롤링페이퍼 아니면? 롤링페이퍼면? */}
        {props.name !== "롤링페이퍼" ? (
          <>
            <li
              className={classes["classMe-li"]}
              onClick={() => {
                props?.letters?.length > 0 && showLetter("public");
              }}
            >
              📦 우리반 캡슐
            </li>
            <li
              className={classes["classMe-li"]}
              onClick={() => {
                props?.letters?.length > 0 && showLetter("personal");
              }}
            >
              💊 내 캡슐
            </li>
          </>
        ) : (
          <>
            <li
              className={classes["classMe-li"]}
              onClick={() => {
                // props?.letters?.length > 0 && showLetter("personal");
              }}
            >
              롤링페이퍼 보기
            </li>
          </>
        )}
      </div>
    </div>
  );
};

export default OpenItem;
