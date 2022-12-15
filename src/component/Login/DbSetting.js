import React from "react";

const DbSetting = (props) => {
  return (
    <div>
      데이터베이스 방번호, 학생명부 업로드하는 화면
      {/* 방번호 인풋창 + 학생명부와 비밀번호가 적힌 엑셀파일 업로드해서 저장버튼 누르고 열리기를 원하는 날짜까지(기본 1개, 1개더 추가 가능하도록) 업로드. */}
      <button onClick={() => props.logOutHandler()}>로그아웃</button>
    </div>
  );
};

export default DbSetting;
