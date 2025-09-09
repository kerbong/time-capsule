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
  "😄 방이름은 문자 혹은 숫자로 구성이 가능합니다. 예) 2022가나초3반",
  "😄 방이름은 추후 학생들이 접속할 때 필요합니다.",
  "😄 방이름, 캡슐이 열리는 날짜는 저장 후에 수정이 불가능합니다.",
  "😄 엑셀에 업로드 된 '학생이름+비밀번호' 로만 글 작성이 가능합니다!(선생님자료도 추가가능)",
  "😄 엑셀파일의 시트는 하나만 사용해주세요.",
  "😄 왼쪽 상단의 버튼을 클릭해서 기존의 방에 접속하실 수 있습니다.",
  "😄 엑셀파일을 업로드하시면 저장버튼이 보입니다.",
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

  //캡슐 방 정보들 가져와서 저장하기
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
      //위치가 중요. 스냅샷 안에서 해야함!!
      setCapsuleNames([...new_capsuleNames]);
      setMyCapsule([...new_myCapsule]);
    });
  };

  useEffect(() => {
    getCapsules();
  }, []);

  //특수문자 입력방지 함수
  const characterCheck = (obj) => {
    //띄어쓰기와 특수문자 모두
    const regExp = /[ ~!@\#$%^&*\()\-=+_'\;<>\/.\`:\"\\,\[\]?|{}]/gi;

    if (regExp.test(obj.current.value)) {
      // 입력한 특수문자 한자리 지움
      obj.current.value = obj.current.value.substring(
        0,
        obj.current.value.length - 1
      );
      errorSwal("입력불가", "특수문자, 띄어쓰기는 입력이 불가능합니다!");
    }
  };

  //엑셀파일 업로드 함수
  const excelFileHandler = (e) => {
    let input = e;
    if (input.files[0] !== undefined) {
      let reader = new FileReader();
      reader.onload = function () {
        try {
          let data = reader.result;
          let workBook = read(data, { type: "binary" });
          workBook.SheetNames.forEach(function (sheetName) {
            let rows = utils.sheet_to_json(workBook.Sheets[sheetName]);
            //비번이 숫자가 아닌경우 취소..!
            if (rows?.filter((r) => isNaN(+r["비번"]))?.length > 0) {
              Swal.fire(
                "업로드 실패",
                `학생들이 접속할 때 사용할 개인 비번을 숫자로 변경해주세요! `,
                "warning"
              );
              return false;
            }

            // console.log(rows);
            let new_rows = rows.map((row) => row["이름"] + row["비번"]);

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

  //date를 yyyy-mm-dd로 변환하는 함수
  const yyyyMmDd = (date) => {
    return new Intl.DateTimeFormat("fr-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  //타임캡슐 날짜 확인함수
  const openDateCheck = () => {
    let isPossible = true;
    //열리는 날짜가 지금 날짜보다 하루 이상 뒤의 날짜가 아니면
    if (
      new Date(capsule1Open) - new Date() < 86400000 ||
      new Date(capsule2Open) - new Date() < 86400000
    ) {
      errorSwal("날짜변경 필요", "내일 이후의 날짜로 개봉날짜를 설정해주세요!");

      isPossible = false;
    }

    if (capsule1Open === capsule2Open) {
      errorSwal(
        "개봉날짜 중복",
        "타임캡슐 1과 2의 열리는 날짜를 다르게 설정해주세요!"
      );
      isPossible = false;
    }

    return isPossible;
  };

  //저장함수
  const saveHandler = () => {
    //타임캡슐 개봉날짜 확인하기, 불가능하면
    if (!openDateCheck()) {
      return;
    }
    //방이름 중복확인
    const roomName = roomNameInput.current.value;

    if (capsuleNames?.includes(roomName)) {
      errorSwal(
        "방이름 중복",
        "이미 존재하는 방 이름입니다. 다른 이름으로 설정해주세요!"
      );
      return false;
    }

    if (roomName === "") {
      errorSwal("방이름 없음", "방이름이 없습니다! 방이름을 설정해주세요!");
      return;
    }

    //유저는 하루 2개만 저장가능 확인 함수
    const savedToday = myCapsule?.filter(
      (cap) => cap.writtenDate === yyyyMmDd(new Date())
    )?.length;
    //오늘 저장한 개수가 이미 2개면 저장불가
    if (savedToday > 1) {
      errorSwal(
        "방등록 초과",
        "하루에 만들 수 있는 방은 최대 2개 입니다! 내일 다시 활용해주세요!"
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

    //App에서 저장시키기
    props.saveCapsule(roomName, data);

    Swal.fire({
      icon: "success",
      title: `${roomName}`,
      text: `타임캡슐1 '${capsule1Open}' 오픈 | 타임캡슐2 '${capsule2Open}' 오픈 되는 방이 만들어졌어요!`,
      showConfirmButton: true,
      timer: 5000,
    });

    //개봉날짜 및 방이름 초기화
    roomNameInput.current.value = "";
    setCapsule1Open("");
    setCapsule2Open("");
  };

  //로그아웃 핸들러
  const logOutHandler = () => {
    Swal.fire({
      icon: "question",
      title: `로그아웃 할까요?`,
      showConfirmButton: true,
      showDenyButton: true,
      confirmButtonText: "확인",
      denyButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        // 로그아웃하기
        props.logOutHandler();
      }
    });
  };

  return (
    <div className={classes["db-container"]}>
      {/* 설명 모달 */}
      {showModal && (
        <Modal
          onClose={() => {
            setShowModal(false);
          }}
        >
          <ul style={{ padding: 0, margin: 0 }}>
            {EXPLAIN.map((exp, index) => (
              <li className={classes["exp-li"]} key={"exp" + index}>
                {exp}
              </li>
            ))}
          </ul>
        </Modal>
      )}

      {/* 상단 버튼 모음 */}
      <div>
        <button
          className={classes["showRoom-btn"]}
          onClick={() => setShowRoom((prev) => !prev)}
        >
          {showRoom ? "새방만들기" : "기존방보기"}
        </button>
        <button
          className={classes["showExpl-btn"]}
          onClick={() => setShowModal(true)}
        >
          설명보기
        </button>
        <button className={classes["logout-btn"]} onClick={logOutHandler}>
          로그아웃
        </button>
      </div>

      {/* 기존방보기면? 새방만들기면? */}
      {showRoom ? (
        <ExistRoom myCapsule={myCapsule} />
      ) : (
        <>
          {/* 방 정보(방이름, 캡슐 개봉날짜) */}
          <div className={classes["roomDate-div"]}>
            <input
              className={classes["room-input"]}
              type="text"
              ref={roomNameInput}
              placeholder="접속할 때 사용할 방이름"
              onKeyDown={() => characterCheck(roomNameInput)}
              onKeyUp={() => characterCheck(roomNameInput)}
              maxLength={"20"}
              autoFocus={true}
            />

            {/* 1번 타임캡슐 */}
            <button
              className={classes["capsule-btn"]}
              onClick={() => setShowCal1((prev) => !prev)}
            >
              1번 타임캡슐 📦 개봉날짜
            </button>
            <h3>{!showCal1 ? capsule1Open : "날짜를 선택하세요."}</h3>
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

            {/* 2번 타임캡슐 */}
            <button
              className={classes["capsule-btn"]}
              onClick={() => setShowCal2((prev) => !prev)}
            >
              2번 타임캡슐 💊 개봉날짜
            </button>
            <h3>{!showCal2 ? capsule2Open : "날짜를 선택하세요."}</h3>
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

          {/* 엑셀 양식 및 학생정보 부분 */}
          <div className={classes["excel-div"]}>
            {studentsInfo.length === 0 ? (
              <>
                <button
                  className={classes["capsule-btn"]}
                  onClick={() => {
                    window.open(
                      "https://drive.google.com/uc?export=download&id=1d4I3NmUx3PsmiRfujNOfMAzkZxNDSkLH",
                      "_blank"
                    );
                  }}
                >
                  양식 다운
                </button>

                <button
                  className={classes["capsule-btn"]}
                  style={{ padding: "0" }}
                >
                  <label
                    htmlFor="excelFileInput"
                    className={classes["input-label"]}
                  >
                    엑셀 업로드
                  </label>
                  <input
                    className={classes["excel-input"]}
                    type="file"
                    id="excelFileInput"
                    onChange={(e) => {
                      excelFileHandler(e.target);
                    }}
                    accept={".xls,.xlsx"}
                  />
                </button>
              </>
            ) : (
              <button
                className={classes["capsule-btn"]}
                onClick={() => {
                  setStudentsInfo([]);
                }}
              >
                학생정보 초기화
              </button>
            )}
          </div>

          {/* 업로드된 학생정보 보여주기 */}
          {studentsInfo.length > 0 && (
            <>
              <h2>학생 접속정보</h2>
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
                저 장
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DbSetting;
