import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { getDocs, collection, setDoc, doc } from "firebase/firestore";
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
    const new_myCapsule = [];
    const querySnapshot = await getDocs(collection(dbService, "capsule"));
    querySnapshot.forEach((doc) => {
      new_capsuleNames.push(doc.id);
      if (doc.data().writtenId === userUid) {
        new_myCapsule.push(doc.id);
      }
    });
    setMyCapsule([...new_myCapsule]);
    setCapsuleNames([...new_capsuleNames]);
  };

  useEffect(() => {
    //데이터베이스에서 자료이름들 찾아보고 저장해두기
    findLabelPossible();
  }, []);

  const saveCapsule = async (roomName, data) => {
    console.log(roomName);
    console.log(data);
    await setDoc(doc(dbService, "capsule", roomName), data);
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
                capsuleNames={capsuleNames}
                myCapsule={myCapsule}
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
