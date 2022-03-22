import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Input,
  Box,
  InputAdornment,
  Typography,
} from "@mui/material";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";

import * as Api from "../../api";
import UserNetworkCard from "./UserNetworkCard";
import { UserStateContext } from "../../App";

function Network() {
  const navigate = useNavigate();
  const userState = useContext(UserStateContext);

  const [users, setUsers] = useState([]); // 유저의 정보를 저장합니다.
  const [searchWord, setSearchWord] = useState(""); // 검색어를 저장합니다.
  const [noResults, setNoResults] = useState(null); // 검색 결과의 유무를 저장합니다.

  useEffect(() => {
    // 만약 전역 상태의 user가 null이라면, 로그인 페이지로 이동함.
    if (!userState.user) {
      navigate("/login");
      return;
    }
    // "users" 엔드포인트로 GET 요청을 하고, users를 response의 data로 세팅함.
    Api.get("users").then((res) => setUsers(res.data.data));
  }, [userState, navigate]);

  useEffect(() => {
    if (searchWord !== "") {
      Api.get("users/search", searchWord).then((res) => {
        const result = res.data.data;
        if (result.length > 0) {
          // 검색 결과가 있으면 검색 결과를 보여줍니다.
          setNoResults(false);
          setUsers(result);
        } else {
          // 검색 결과가 없을 경우 검색 결과 없음을 표시합니다.
          setNoResults(true);
        }
      });
    } else {
      // 검색어가 없을 경우 전체 유저 정보를 표시합니다.
      setNoResults(false);
      Api.get("users").then((res) => setUsers(res.data.data));
    }
  }, [searchWord]);

  return (
    <Container sx={{ py: 8 }} maxWidth="md">
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mb: 3,
        }}
      >
        <Input
          variant="outlined"
          startAdornment={
            <InputAdornment position="start">
              <PersonSearchIcon />
            </InputAdornment>
          }
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
        />
      </Box>
      <Grid container spacing={4}>
        {noResults ? (
          <Typography>검색 결과 없음</Typography>
        ) : (
          users.map((user) => <UserNetworkCard key={user.id} user={user} />)
        )}
      </Grid>
    </Container>
  );
}

export default Network;
