import React, { useRef, useState, useEffect } from "react";
import Swal from "sweetalert2";
import { read, utils } from "xlsx";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import classes from "./DbSetting.module.css";

const EXPLAIN = [
  "방이름은 문자 혹은 숫자로 구성이 가능합니다. 예) 2022가나초3반",
  "방이름은 추후 학생들이 접속할 때 필요합니다.",
  "방이름은 저장 후에 수정이 불가능합니다.",
  "엑셀에 업로드 된 학생이름+비밀번호 로만 글 작성이 가능합니다.",
  "엑셀파일의 시트는 하나만 사용해주세요.",
  "왼쪽 상단의 버튼을 클릭해서 기존의 방에 접속하실 수 있습니다.",
  "학생 명단이 있는 엑셀을 업로드하시면 저장버튼이 보입니다.",
];

const DbSetting = (props) => {
  const [studentsInfo, setStudentsInfo] = useState([]);
  const [value1, onChange1] = useState(new Date());
  const [value2, onChange2] = useState(new Date());
  const [showCal1, setShowCal1] = useState(false);
  const [showCal2, setShowCal2] = useState(false);
  const [capsule1Open, setCapsule1Open] = useState("");
  const [capsule2Open, setCapsule2Open] = useState("");

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
    if (props.capsuleNames?.includes(roomName)) {
      errorSwal(
        "방이름 중복",
        "이미 존재하는 방 이름입니다. 다른 이름으로 설정해주세요!"
      );
      return;
    }

    if (roomName === "") {
      errorSwal("방이름 없음", "방이름이 없습니다! 방이름을 설정해주세요!");
      return;
    }

    //유저는 하루 2개만 저장가능 확인 함수
    const savedToday = props.myCapsule?.filter(
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
      title: "저장완료",
      showConfirmButton: true,
      timer: 5000,
    });

    //개봉날짜 및 방이름 초기화
    roomNameInput.current.value = "";
    setCapsule1Open("");
    setCapsule2Open("");
  };

  return (
    <>
      <button
        className={classes["logout-btn"]}
        onClick={() => props.logOutHandler()}
      >
        로그아웃
      </button>
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
        <button
          className={classes["capsule-btn"]}
          onClick={() => setShowCal1((prev) => !prev)}
        >
          1번 타임캡슐 📦 개봉날짜
        </button>
        {!showCal1 ? capsule1Open : "날짜를 선택하세요."}
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
        <button
          className={classes["capsule-btn"]}
          onClick={() => setShowCal2((prev) => !prev)}
        >
          2번 타임캡슐 💊 개봉날짜
        </button>
        {!showCal2 ? capsule2Open : "날짜를 선택하세요."}
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
      <div className={classes["excel-div"]}>
        {studentsInfo.length === 0 ? (
          <>
            <button className={classes["capsule-btn"]}>
              <a href="https://drive.google.com/uc?export=download&id=1d4I3NmUx3PsmiRfujNOfMAzkZxNDSkLH">
                양식 다운
              </a>
            </button>

            <button className={classes["capsule-btn"]}>
              <label htmlFor="excelFileInput">엑셀 업로드</label>
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
              학생정보 초기화
            </button>
          </>
        )}
      </div>
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
  );
};

export default DbSetting;
