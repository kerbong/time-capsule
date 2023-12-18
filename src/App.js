import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import {
  getDocs,
  collection,
  setDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { authService, dbService } from "./fbase";
import Login from "./component/Login/Login";
import DbSetting from "./component/Login/DbSetting";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userUid, setUserUid] = useState(null);
  const [myCapsule, setMyCapsule] = useState([]);
  const [capsuleNames, setCapsuleNames] = useState([]);

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

  // 데이터베이스에서 방이름들만 받아오기
  const findLabelPossible = async () => {
    const new_capsuleNames = [];
    const queryRef = doc(dbService, "capsule", "roomNames");
    onSnapshot(queryRef, (doc) => {
      doc?.data()?.datas.forEach((data) => {
        new_capsuleNames.push(data);
      });

      setCapsuleNames([...new_capsuleNames]);
    });
  };

  useEffect(() => {
    //데이터베이스에서 자료이름들 찾아보고 저장해두기
    findLabelPossible();
  }, []);

  const saveCapsule = async (roomName, data) => {
    await setDoc(doc(dbService, "capsule", roomName), data);
    //이름목록에도 저장해주기
    let new_capsuleNames = [...capsuleNames];

    new_capsuleNames.push(roomName);
    await setDoc(doc(dbService, "capsule", "roomNames"), {
      datas: new_capsuleNames,
    });
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
                userUid={userUid}
                // userEmail={userEmail}
                logOutHandler={() => {
                  const auth = getAuth();
                  signOut(auth);
                  logOutHandler();
                }}
                saveCapsule={(name, data) => saveCapsule(name, data)}
              />
            }
          />
        ) : (
          //로그인 하지 않았을 때 화면
          <Route
            index
            element={
              <Login
                loggedInHandler={(user) => loggedInHandler(user)}
                capsuleNames={capsuleNames}
              />
            }
          />
        )}
      </Routes>
    </div>
  );
}

export default App;
