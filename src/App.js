import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { authService } from "./fbase";
import Login from "./component/Login/Login";
import DbSetting from "./component/Login/DbSetting";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userUid, setUserUid] = useState(null);

  useEffect(() => {
    try {
      authService.onAuthStateChanged((user) => {
        if (user) {
          setUserUid(user.uid);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
        setInit(true);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const logOutHandler = () => {
    setInit(false);
    setIsLoggedIn(false);
    setUserUid(null);
  };

  const loggedInHandler = (user) => {
    setUserUid(user.uid);
    setIsLoggedIn(true);
    setInit(true);
  };

  return (
    <div className="App">
      <Routes>
        {init && isLoggedIn ? (
          // 교사가 로그인 하면 보여줄 화면
          <Route
            index
            element={
              <DbSetting
                // topics={topics}
                userUid={userUid}
                // userEmail={userEmail}
                logOutHandler={() => {
                  const auth = getAuth();
                  signOut(auth);
                  logOutHandler();
                }}
              />
            }
          />
        ) : (
          //로그인 하지 않았을 때 화면
          <Route
            index
            element={
              <Login loggedInHandler={(user) => loggedInHandler(user)} />
            }
          />
        )}
      </Routes>
    </div>
  );
}

export default App;
