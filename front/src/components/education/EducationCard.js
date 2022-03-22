import React, { useState, useContext } from "react";
import { Button, Grid, IconButton, Menu, MenuItem } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import * as Api from "../../api";
import { UserStateContext } from "../../App";
import AlertDialog from "../utils/AlertDialog";

function EducationCard({
  education,
  setClickEditBtn,
  isEditable,
  setEducations,
}) {
  const userState = useContext(UserStateContext); // 현재 로그인된 유저의 정보를 가져옵니다.

  const [anchorEl, setAnchorEl] = useState(null); // Menu Element를 가리킵니다.
  const [isOpen, setIsOpen] = useState(null); // Menu Element의 Open 상태를 저장합니다.
  const [isDeleting, setIsDeleting] = useState(false); // 삭제 여부를 저장합니다.

  const userId = userState.user.id; // 현재 로그인한 유저의 아이디를 저장합니다.

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setIsOpen(Boolean(event.currentTarget));
  };
  const handleClose = () => {
    setAnchorEl(null);
    setIsOpen(false);
  };

  const DelBtnClickHandler = async (isDeleting) => {
    if (isDeleting) {
      // educations로 DELETE 요청을 보내 학력을 삭제합니다.
      await Api.delete("educations", education.id);

      // education-lists/유저id로 GET 요청을 보내 업데이트 사항이 반영된 학력을 새로 저장합니다.
      const { data } = await Api.get("education-lists", userId);
      setEducations(data.data);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={10}>
        <p style={{ marginBottom: "5px" }}>{education.school}</p>
        <p className="text-muted">
          {education.major} ({education.position})
        </p>
      </Grid>
      <Grid item xs={2}>
        {isEditable && (
          <>
            <IconButton onClick={handleClick} sx={{ float: "right", mb: 2 }}>
              <MoreHorizIcon />
            </IconButton>
            {isOpen && (
              <Menu anchorEl={anchorEl} open={isOpen} onClose={handleClose}>
                <MenuItem onClick={handleClose}>
                  <Button
                    onClick={() => setClickEditBtn((cur) => !cur)}
                    startIcon={<EditIcon />}
                  >
                    편집
                  </Button>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Button
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => setIsDeleting(true)}
                  >
                    삭제
                  </Button>
                </MenuItem>
              </Menu>
            )}
            {isDeleting && (
              <AlertDialog checkDeleteComplete={DelBtnClickHandler} />
            )}
          </>
        )}
      </Grid>
    </Grid>
  );
}

export default EducationCard;
