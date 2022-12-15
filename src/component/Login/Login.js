import React, { useState } from "react";
import Form from "./Form";
import Students from "./Students";

const Login = (props) => {
  const [loginType, setLoginType] = useState("");
  return (
    <div className="login-div">
      {loginType === "" && (
        <div>
          <div className="title-div">
            <p>⏲🔮 타 임 캡 슐 💊✨</p>
            <p>로그인 방식을 선택하세요.</p>
          </div>
          <div>
            <button onClick={() => setLoginType("teacher")}>교사</button>
            <button onClick={() => setLoginType("student")}>학생</button>
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

      {loginType === "student" && <Students />}
    </div>
  );
};

export default Login;
