import React, { useState } from "react";
import { Box, TextField, Stack, Button } from "@mui/material";

import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";

const CertificateAddForm = ({ checkAddComplete }) => {
  console.log("CertificateAddForm 불러왔습니다.");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());

  // Date를 YYYY-MM-DD의 문자열로 바꾸는 함수입니다. 지유님꺼 업어옴
  const dateToString = (date) => {
    return (
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      date.getDate().toString().padStart(2, "0")
    );
  };
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // Date type의 시작일, 마감일 상태를 YYYY-MM-DD의 문자열로 바꿉니다.
    const strDate = dateToString(date);

    //서버에 post 요청을 하고 갱신.
    // const isAccepted = accept;

    if (e.target.name === "cancel") {
      console.log("추가하기 취소 버튼이 눌렸습니다.");
      checkAddComplete(null);
    } else {
      console.log("추가하기 완료 버튼이 눌렸습니다.");
      checkAddComplete({ title, description, date: strDate });
    }
  };

  return (
    <Box component="form" onSubmit={onSubmitHandler} sx={{ mt: 1 }}>
      <Stack spacing={2}>
        <TextField
          label="자격증명"
          required
          onChange={(e) => setTitle(e.target.value)}
          sx={{ width: "60ch" }}
        />
        <TextField
          label="발급처"
          required
          onChange={(e) => setDescription(e.target.value)}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <DesktopDatePicker
              label="발급일"
              required
              inputFormat={"yyyy-MM-dd"}
              mask={"____-__-__"}
              value={date}
              onChange={(date) => setDate(date)}
              renderInput={(params) => <TextField {...params} />}
            />
          </Stack>
        </LocalizationProvider>
        <Stack
          direction="row"
          spacing={2}
          sx={{ mt: 2, justifyContent: "center" }}
        >
          <Button name="accept" variant="contained" type="submit">
            확인
          </Button>{" "}
          <Button
            name="cancel"
            type="reset"
            onClick={onSubmitHandler}
            variant="outlined"
          >
            취소
          </Button>{" "}
        </Stack>
      </Stack>
    </Box>
  );
};

export default CertificateAddForm;
