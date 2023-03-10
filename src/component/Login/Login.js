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
            <h2>๐ฎ ํ ์ ์บก ์ ๐</h2>
            <h3>๋ก๊ทธ์ธ ๋ฐฉ์์ ์ ํํ์ธ์.</h3>
          </div>
          <div className={classes["roomDate-div"]}>
            <h1>๐ฆ</h1>
            <button
              className={classes["capsule-btn"]}
              onClick={() => setLoginType("teacher")}
            >
              ๊ต์ฌ
            </button>
            <button
              className={classes["capsule-btn"]}
              onClick={() => setLoginType("student")}
            >
              ํ์
            </button>
          </div>
        </div>
      )}
      {/* ๊ต์ฌ ๋ฒํผ ํด๋ฆญ์ ๋ณด์ฌ์ค ํ๋ฉด */}
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
      {/* ํ์ ๋ฒํผ ํด๋ฆญ์ ๋ณด์ฌ์ค ํ๋ฉด */}

      {loginType === "student" && (
        <AccessRoom
          capsuleNames={props.capsuleNames}
          loginTypeHandler={() => setLoginType("")}
        />
      )}
    </div>
  );
};

export default Login;
