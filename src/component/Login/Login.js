import React, { useState } from "react";
import Form from "./Form";
import AccessRoom from "./AccessRoom";
import classes from "./DbSetting.module.css";

const Login = (props) => {
  const [loginType, setLoginType] = useState("");
  return (
    <div className="login-div">
      {loginType === "" && (
        <div>
          <div className="title-div">
            <h2>🔮 타 임 캡 슐 💊</h2>
            <h3>로그인 방식을 선택하세요.</h3>
          </div>
          <div className={classes["roomDate-div"]}>
            <button
              className={classes["capsule-btn"]}
              onClick={() => setLoginType("teacher")}
            >
              교사
            </button>
            <button
              className={classes["capsule-btn"]}
              onClick={() => setLoginType("student")}
            >
              학생
            </button>
          </div>
        </div>
      )}
      {/* 교사 버튼 클릭시 보여줄 화면 */}
      {loginType === "teacher" && (
        <Form
          loginTypeHandler={() => {
            setLoginType("");
          }}
          loggedIn={(user) => {
            props.loggedInHandler(user);
          }}
        />
      )}
      {/* 학생 버튼 클릭시 보여줄 화면 */}

      {loginType === "student" && (
        <AccessRoom capsuleNames={props.capsuleNames} />
      )}
    </div>
  );
};

export default Login;
