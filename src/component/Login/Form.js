import React, { useState, useRef } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { authService } from "../../fbase";
import Swal from "sweetalert2";
import classes from "./DbSetting.module.css";

const Form = (props) => {
  const [isTeacher, setIsTeacher] = useState("");

  const isTeacherChecker = (e) => {
    e.preventDefault();
    let inputValue = teacherCheckRef.current.value;
    if (inputValue === "from-indi") {
      Swal.fire({
        icon: "success",
        title: "환영합니다!",
        text: "구글 연동 로그인이 가능합니다!",
        showConfirmButton: true,
        timer: 5000,
      });
      localStorage.setItem("isTeacher", inputValue);
      setIsTeacher(inputValue);
    } else {
      Swal.fire({
        icon: "error",
        title: "입력불가",
        text: "교사용 접속 비밀번호를 다시 확인해주세요!",
      });
    }
    teacherCheckRef.current.value = "";
  };

  const teacherCheckRef = useRef();

  const onSocialClick = async (e) => {
    e.preventDefault();
    const {
      target: { name },
    } = e;
    let provider;
    if (name === "google") {
      provider = new GoogleAuthProvider();
    }

    if (navigator.platform) {
      var filter = "win16|win32|win64|mac|macintel";
      if (filter.indexOf(navigator.platform.toLowerCase()) < 0) {
        // mobile 접속인 경우
        // console.log("모바일");

        await signInWithRedirect(authService, provider);
      } else {
        if (
          navigator.userAgent.match(
            ".*(iPhone|iPod|iPad|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson).*"
          )
        ) {
          // PC 상의 모바일 에뮬레이터
          // console.log("mobile on pc");
          await signInWithPopup(authService, provider)
            .then((result) => {
              props.loggedIn(result.user);
            })
            .catch((error) => {
              console.log(error.code);
            });
        } else {
          // pc 접속인 경우
          // console.log("pc");
          await signInWithPopup(authService, provider)
            .then((result) => {
              props.loggedIn();
            })
            .catch((error) => {
              console.log(error.code);
            });
        }
      }
    }
  };

  return (
    <div>
      {isTeacher === "" && (
        <>
          <h3>교사인증 비밀번호</h3>
          <form onSubmit={isTeacherChecker}>
            <input type={"password"} ref={teacherCheckRef} autoFocus></input>
          </form>
        </>
      )}

      {isTeacher === "from-indi" && (
        <form>
          <button
            className={classes["capsule-btn"]}
            name="google"
            onClick={onSocialClick}
          >
            Google 로그인
          </button>
        </form>
      )}

      <button
        className={classes["capsule-btn"]}
        onClick={() => props.loginTypeHandler()}
      >
        뒤로
      </button>
    </div>
  );
};

export default Form;
