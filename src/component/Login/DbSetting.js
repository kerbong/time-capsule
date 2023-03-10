import React, { useRef, useState, useEffect } from "react";
import Swal from "sweetalert2";
import { read, utils } from "xlsx";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import classes from "./DbSetting.module.css";
import Modal from "../Layout/Modal";
import { collection, onSnapshot } from "firebase/firestore";
import { dbService } from "../../fbase";
import ExistRoom from "./ExistRoom";

const EXPLAIN = [
  "π λ°©μ΄λ¦μ λ¬Έμ νΉμ μ«μλ‘ κ΅¬μ±μ΄ κ°λ₯ν©λλ€. μ) 2022κ°λμ΄3λ°",
  "π λ°©μ΄λ¦μ μΆν νμλ€μ΄ μ μν  λ νμν©λλ€.",
  "π λ°©μ΄λ¦, μΊ‘μμ΄ μ΄λ¦¬λ λ μ§λ μ μ₯ νμ μμ μ΄ λΆκ°λ₯ν©λλ€.",
  "π μμμ μλ‘λ λ 'νμμ΄λ¦+λΉλ°λ²νΈ' λ‘λ§ κΈ μμ±μ΄ κ°λ₯ν©λλ€!(μ μλμλ£λ μΆκ°κ°λ₯)",
  "π μμνμΌμ μνΈλ νλλ§ μ¬μ©ν΄μ£ΌμΈμ.",
  "π μΌμͺ½ μλ¨μ λ²νΌμ ν΄λ¦­ν΄μ κΈ°μ‘΄μ λ°©μ μ μνμ€ μ μμ΅λλ€.",
  "π μμνμΌμ μλ‘λνμλ©΄ μ μ₯λ²νΌμ΄ λ³΄μλλ€.",
];

const DbSetting = (props) => {
  const [studentsInfo, setStudentsInfo] = useState([]);
  const [value1, onChange1] = useState(new Date());
  const [value2, onChange2] = useState(new Date());
  const [showCal1, setShowCal1] = useState(false);
  const [showCal2, setShowCal2] = useState(false);
  const [capsule1Open, setCapsule1Open] = useState("");
  const [capsule2Open, setCapsule2Open] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [capsuleNames, setCapsuleNames] = useState(false);
  const [myCapsule, setMyCapsule] = useState(false);
  const [showRoom, setShowRoom] = useState(false);

  const roomNameInput = useRef();
  // const excelInput = useRef();

  const errorSwal = (title, text) => {
    Swal.fire({
      icon: "error",
      title: title,
      text: text,
    });
  };

  useEffect(() => {
    setCapsule1Open(yyyyMmDd(value1));
  }, [value1]);
  useEffect(() => {
    setCapsule2Open(yyyyMmDd(value2));
  }, [value2]);

  //μΊ‘μ λ°© μ λ³΄λ€ κ°μ Έμμ μ μ₯νκΈ°
  const getCapsules = () => {
    onSnapshot(collection(dbService, "capsule"), (snapshot) => {
      const new_capsuleNames = [];
      const new_myCapsule = [];

      snapshot.docs.forEach((doc) => {
        new_capsuleNames.push(doc.id);
        if (doc.data().writtenId === props.userUid) {
          new_myCapsule.push({ ...doc.data(), doc_id: doc.id });
        }
      });
      //μμΉκ° μ€μ. μ€λμ· μμμ ν΄μΌν¨!!
      setCapsuleNames([...new_capsuleNames]);
      setMyCapsule([...new_myCapsule]);
    });
  };

  useEffect(() => {
    getCapsules();
  }, []);

  //νΉμλ¬Έμ μλ ₯λ°©μ§ ν¨μ
  const characterCheck = (obj) => {
    //λμ΄μ°κΈ°μ νΉμλ¬Έμ λͺ¨λ
    const regExp = /[ ~!@\#$%^&*\()\-=+_'\;<>\/.\`:\"\\,\[\]?|{}]/gi;

    if (regExp.test(obj.current.value)) {
      // μλ ₯ν νΉμλ¬Έμ νμλ¦¬ μ§μ
      obj.current.value = obj.current.value.substring(
        0,
        obj.current.value.length - 1
      );
      errorSwal("μλ ₯λΆκ°", "νΉμλ¬Έμ, λμ΄μ°κΈ°λ μλ ₯μ΄ λΆκ°λ₯ν©λλ€!");
    }
  };

  //μμνμΌ μλ‘λ ν¨μ
  const excelFileHandler = (e) => {
    let input = e.target;
    if (input.files[0] !== undefined) {
      let reader = new FileReader();
      reader.onload = function () {
        try {
          let data = reader.result;
          let workBook = read(data, { type: "binary" });
          workBook.SheetNames.forEach(function (sheetName) {
            let rows = utils.sheet_to_json(workBook.Sheets[sheetName]);
            // console.log(rows);
            let new_rows = rows.map((row) => row["μ΄λ¦"] + row["λΉλ²"]);
            setStudentsInfo([...new_rows]);
          });
        } catch (error) {
          //   console.log(error);
        }
      };
      reader.readAsBinaryString(input.files[0]);
    } else {
      return;
    }
  };

  //dateλ₯Ό yyyy-mm-ddλ‘ λ³ννλ ν¨μ
  const yyyyMmDd = (date) => {
    return new Intl.DateTimeFormat("fr-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  //νμμΊ‘μ λ μ§ νμΈν¨μ
  const openDateCheck = () => {
    let isPossible = true;
    //μ΄λ¦¬λ λ μ§κ° μ§κΈ λ μ§λ³΄λ€ νλ£¨ μ΄μ λ€μ λ μ§κ° μλλ©΄
    if (
      new Date(capsule1Open) - new Date() < 86400000 ||
      new Date(capsule2Open) - new Date() < 86400000
    ) {
      errorSwal("λ μ§λ³κ²½ νμ", "λ΄μΌ μ΄νμ λ μ§λ‘ κ°λ΄λ μ§λ₯Ό μ€μ ν΄μ£ΌμΈμ!");

      isPossible = false;
    }

    if (capsule1Open === capsule2Open) {
      errorSwal(
        "κ°λ΄λ μ§ μ€λ³΅",
        "νμμΊ‘μ 1κ³Ό 2μ μ΄λ¦¬λ λ μ§λ₯Ό λ€λ₯΄κ² μ€μ ν΄μ£ΌμΈμ!"
      );
      isPossible = false;
    }

    return isPossible;
  };

  //μ μ₯ν¨μ
  const saveHandler = () => {
    console.log(myCapsule);
    //νμμΊ‘μ κ°λ΄λ μ§ νμΈνκΈ°, λΆκ°λ₯νλ©΄
    if (!openDateCheck()) {
      return;
    }
    //λ°©μ΄λ¦ μ€λ³΅νμΈ
    const roomName = roomNameInput.current.value;
    console.log(capsuleNames.filter((name) => name === roomName));
    if (capsuleNames?.includes(roomName)) {
      errorSwal(
        "λ°©μ΄λ¦ μ€λ³΅",
        "μ΄λ―Έ μ‘΄μ¬νλ λ°© μ΄λ¦μλλ€. λ€λ₯Έ μ΄λ¦μΌλ‘ μ€μ ν΄μ£ΌμΈμ!"
      );
      return false;
    }

    if (roomName === "") {
      errorSwal("λ°©μ΄λ¦ μμ", "λ°©μ΄λ¦μ΄ μμ΅λλ€! λ°©μ΄λ¦μ μ€μ ν΄μ£ΌμΈμ!");
      return;
    }

    //μ μ λ νλ£¨ 2κ°λ§ μ μ₯κ°λ₯ νμΈ ν¨μ
    const savedToday = myCapsule?.filter(
      (cap) => cap.writtenDate === yyyyMmDd(new Date())
    )?.length;
    //μ€λ μ μ₯ν κ°μκ° μ΄λ―Έ 2κ°λ©΄ μ μ₯λΆκ°
    if (savedToday > 1) {
      errorSwal(
        "λ°©λ±λ‘ μ΄κ³Ό",
        "νλ£¨μ λ§λ€ μ μλ λ°©μ μ΅λ 2κ° μλλ€! λ΄μΌ λ€μ νμ©ν΄μ£ΌμΈμ!"
      );
      return;
    }

    const data = {
      firstCapsule: { date: capsule1Open, messages: [] },
      secondCapsule: { date: capsule2Open, messages: [] },
      rollingPaper: [],
      studentsInfo: [...studentsInfo],
      writtenId: props.userUid,
      writtenDate: yyyyMmDd(new Date()),
    };

    //Appμμ μ μ₯μν€κΈ°
    props.saveCapsule(roomName, data);

    Swal.fire({
      icon: "success",
      title: `${roomName}`,
      text: `νμμΊ‘μ1 '${capsule1Open}' μ€ν | νμμΊ‘μ2 '${capsule2Open}' μ€ν λλ λ°©μ΄ λ§λ€μ΄μ‘μ΄μ!`,
      showConfirmButton: true,
      timer: 5000,
    });

    //κ°λ΄λ μ§ λ° λ°©μ΄λ¦ μ΄κΈ°ν
    roomNameInput.current.value = "";
    setCapsule1Open("");
    setCapsule2Open("");
  };

  //λ‘κ·Έμμ νΈλ€λ¬
  const logOutHandler = () => {
    Swal.fire({
      icon: "question",
      title: `λ‘κ·Έμμ ν κΉμ?`,
      showConfirmButton: true,
      showDenyButton: true,
      confirmButtonText: "νμΈ",
      denyButtonText: "μ·¨μ",
    }).then((result) => {
      if (result.isConfirmed) {
        // λ‘κ·ΈμμνκΈ°
        props.logOutHandler();
      }
    });
  };

  return (
    <>
      {/* μ€λͺ λͺ¨λ¬ */}
      {showModal && (
        <Modal
          onClose={() => {
            setShowModal(false);
          }}
        >
          <div>
            {EXPLAIN.map((exp, index) => (
              <li className={classes["exp-li"]} key={"exp" + index}>
                {exp}
              </li>
            ))}
          </div>
        </Modal>
      )}

      {/* μλ¨ λ²νΌ λͺ¨μ */}
      <div>
        <button
          className={classes["showRoom-btn"]}
          onClick={() => setShowRoom((prev) => !prev)}
        >
          {showRoom ? "μλ°©λ§λ€κΈ°" : "κΈ°μ‘΄λ°©λ³΄κΈ°"}
        </button>
        <button
          className={classes["showExpl-btn"]}
          onClick={() => setShowModal(true)}
        >
          μ€λͺλ³΄κΈ°
        </button>
        <button className={classes["logout-btn"]} onClick={logOutHandler}>
          λ‘κ·Έμμ
        </button>
      </div>

      {/* κΈ°μ‘΄λ°©λ³΄κΈ°λ©΄? μλ°©λ§λ€κΈ°λ©΄? */}
      {showRoom ? (
        <>
          <ExistRoom myCapsule={myCapsule} />
        </>
      ) : (
        <>
          {/* λ°© μ λ³΄(λ°©μ΄λ¦, μΊ‘μ κ°λ΄λ μ§) */}
          <div className={classes["roomDate-div"]}>
            <input
              className={classes["room-input"]}
              type="text"
              ref={roomNameInput}
              placeholder="μ μν  λ μ¬μ©ν  λ°©μ΄λ¦"
              onKeyDown={() => characterCheck(roomNameInput)}
              onKeyUp={() => characterCheck(roomNameInput)}
              maxLength={"20"}
              autoFocus={true}
            />

            {/* 1λ² νμμΊ‘μ */}
            <button
              className={classes["capsule-btn"]}
              onClick={() => setShowCal1((prev) => !prev)}
            >
              1λ² νμμΊ‘μ π¦ κ°λ΄λ μ§
            </button>
            <h3>{!showCal1 ? capsule1Open : "λ μ§λ₯Ό μ ννμΈμ."}</h3>
            {showCal1 && (
              <Calendar
                onChange={(val) => {
                  onChange1(val);
                  setShowCal1(false);
                }}
                value={value1}
                formatDay={(locale, date) =>
                  date.toLocaleString("en", { day: "numeric" })
                }
              />
            )}

            {/* 2λ² νμμΊ‘μ */}
            <button
              className={classes["capsule-btn"]}
              onClick={() => setShowCal2((prev) => !prev)}
            >
              2λ² νμμΊ‘μ π κ°λ΄λ μ§
            </button>
            <h3>{!showCal2 ? capsule2Open : "λ μ§λ₯Ό μ ννμΈμ."}</h3>
            {showCal2 && (
              <Calendar
                onChange={(val) => {
                  onChange2(val);
                  setShowCal2(false);
                }}
                value={value2}
                formatDay={(locale, date) =>
                  date.toLocaleString("en", { day: "numeric" })
                }
              />
            )}
          </div>

          {/* μμ μμ λ° νμμ λ³΄ λΆλΆ */}
          <div className={classes["excel-div"]}>
            {studentsInfo.length === 0 ? (
              <>
                <button className={classes["capsule-btn"]}>
                  <a href="https://drive.google.com/uc?export=download&id=1d4I3NmUx3PsmiRfujNOfMAzkZxNDSkLH">
                    μμ λ€μ΄
                  </a>
                </button>

                <button className={classes["capsule-btn"]}>
                  <label htmlFor="excelFileInput">μμ μλ‘λ</label>
                </button>
                <input
                  className={classes["excel-input"]}
                  type="file"
                  id="excelFileInput"
                  onChange={(e) => {
                    excelFileHandler(e);
                  }}
                  accept={".xls,.xlsx"}
                />
              </>
            ) : (
              <>
                <button
                  className={classes["capsule-btn"]}
                  onClick={() => {
                    setStudentsInfo([]);
                  }}
                >
                  νμμ λ³΄ μ΄κΈ°ν
                </button>
              </>
            )}
          </div>

          {/* μλ‘λλ νμμ λ³΄ λ³΄μ¬μ£ΌκΈ° */}
          {studentsInfo.length > 0 && (
            <>
              <h2>νμ μ μμ λ³΄</h2>
              <hr />
              <ul className={classes["students-ul"]}>
                {studentsInfo?.map((stu) => (
                  <li key={stu} className={classes["students-li"]}>
                    {stu}
                  </li>
                ))}
              </ul>
              <hr />
            </>
          )}

          <div className={classes["excel-div"]}>
            {studentsInfo?.length > 0 && (
              <button
                className={classes["capsule-btn"]}
                onClick={() => {
                  saveHandler();
                }}
              >
                μ  μ₯
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default DbSetting;
