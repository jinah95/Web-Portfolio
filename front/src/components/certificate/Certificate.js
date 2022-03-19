import React, { useState } from "react";
import { Row } from "react-bootstrap";

import CertificateEditForm from "./CertificateEditForm";
import CertificateCard from "./CertificateCard";

//mvp 구현 1차 완료 이제부터 리파인이다.

//Certicate 모듈입니다. CertificateCard 와 CertificateEditForm 을 호출합니다.

const Certicate = ({
  cert,
  checkModified,
  isEditable,
  title,
  description,
  date,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  //isEditing 필요.
  //isEditable 은 portfolio에서 받아온 데이터. 수정을 할수있느냐의 여부.
  //Card에게도 전달하여 수정하기 버튼을 활성화 시켜야함
  //isEditing은 수정하기 버튼이 눌렸을때 작동됨.

  const checkEditing = (editing) => {
    setIsEditing(editing);
  };
  const checkDeleting = () => {
    //확인 과정 필요.
    //Are you sure?  모달창?
    //지금은 그냥 삭제
    const type = "delete";
    checkModified(cert.id, type, {});
  };

  const checkEdited = (isEdited, props) => {
    //editForm에서 값이 리턴됨.
    console.log("checkEdited");
    //console.log(...props);
    //setIsEdited(edited);
    if (isEdited) {
      //데이터 수정에관련된 로직
      console.log("데이터 수정작업이 이루어집니다.");
      const type = "edit";
      checkModified(cert.id, type, props);
    }
    //EditForm을 비활성화 시킵니다.
    setIsEditing(false);
  };

  return (
    <Row>
      {isEditing ? (
        <CertificateEditForm
          checkEdited={checkEdited}
          title={title}
          description={description}
          date={date}
        />
      ) : (
        <CertificateCard
          isEditable={isEditable}
          checkEditing={checkEditing}
          checkDeleting={checkDeleting}
          title={title}
          description={description}
          date={date}
        />
      )}
    </Row>
  );
};

export default Certicate;
