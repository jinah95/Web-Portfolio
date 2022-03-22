import is from "@sindresorhus/is";
import { Router } from "express";
import { loginRequired } from "../middlewares/loginRequired.js";
import { UserAuthService } from "../services/userService.js";
import { fieldChecking, removeFields } from "../utils/utils.js";
import dotenv from "dotenv";
dotenv.config();

const userAuthRouter = Router();

userAuthRouter.post("/users/register", async function (req, res, next) {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    // req (request) 에서 데이터 가져오기
    const { name, email, password } = req.body;

    // 위 데이터를 유저 db에 추가하기
    const newUser = await UserAuthService.addUser({
      name,
      email,
      password,
    });

    if (newUser.errorMessage) {
      throw new Error(newUser.errorMessage);
    }

    const result = removeFields(newUser["_doc"], "password");

    res
      .status(201)
      .json({ data: result, code: 201, message: "유저 생성 성공" });
  } catch (error) {
    next(error);
  }
});

userAuthRouter.post("/users/login", async function (req, res, next) {
  try {
    // req (request) 에서 데이터 가져오기
    const { email, password } = req.body;

    // 위 데이터를 이용하여 유저 db에서 유저 찾기
    const user = await UserAuthService.getUser({ email, password });

    if (user.errorMessage) {
      throw new Error(user.errorMessage);
    }

    res
      .status(200)
      .json({ data: user, code: 200, message: "유저 로그인 성공" });
  } catch (error) {
    next(error);
  }
});

userAuthRouter.get("/users", loginRequired, async function (req, res, next) {
  try {
    // 전체 사용자 목록을 얻음
    const users = await UserAuthService.getUsers();

    const result = users.map((user) => removeFields(user["_doc"], "password", "like"));

    res
      .status(200)
      .json({ data: result, code: 200, message: "유저 리스트 조회 성공" });
  } catch (error) {
    next(error);
  }
});

userAuthRouter.get(
  "/users/current",
  loginRequired,
  async function (req, res, next) {
    try {
      // jwt토큰에서 추출된 사용자 id를 가지고 db에서 사용자 정보를 찾음.
      const userId = req.currentUserId;
      const currentUserInfo = await UserAuthService.getUserInfo({
        userId,
      });

      if (currentUserInfo.errorMessage) {
        throw new Error(currentUserInfo.errorMessage);
      }

      const result = removeFields(currentUserInfo["_doc"], "password");

      res.status(200).json({
        data: result,
        code: 200,
        message: "사용자 조회 성공",
      });
    } catch (error) {
      next(error);
    }
  }
);

userAuthRouter.put("/users", loginRequired, async function (req, res, next) {
  try {
    // 토큰에서 사용자 id를 추출함.
    const userId = req.currentUserId;

    const toUpdate = fieldChecking(req.body, "name", "email", "password", "description", "permission");

    // 해당 사용자 아이디로 사용자 정보를 db에서 찾아 업데이트함. 업데이트 요소가 없을 시 생략함
    const updatedUser = await UserAuthService.setUser({ userId, toUpdate });

    if (updatedUser.errorMessage) {
      throw new Error(updatedUser.errorMessage);
    }

    const result = removeFields(updatedUser["_doc"], "password", "like");

    res
      .status(201)
      .json({ data: result, code: 201, message: "유저 수정 성공" });
  } catch (error) {
    next(error);
  }
});

userAuthRouter.get(
  "/users/:id",
  loginRequired,
  async function (req, res, next) {
    try {
      const userId = req.params.id;
      const userInfo = await UserAuthService.getUserInfo({ userId });

      if (userInfo.errorMessage) {
        throw new Error(userInfo.errorMessage);
      }

      // 유저 좋아요 해준사람 목록에 내가 있으면 true값을 가진 변수 전달
      const isLikedByThisUser = userInfo.like.by.includes(req.currentUserId);

      // 필요없는 필드 제거
      const rest = removeFields(userInfo["_doc"], "password", "like");

      // permission 필드 확인 후 비공개 처리된 필드 제거
      const filteredInfo = filteredByPermissionList(rest);

      // 좋아요 눌렀는지 체크하는 필드 추가
      const updatedUserInfo = { ...filteredInfo, isLikedByThisUser, like: { count: userInfo.like.count } };

      res
        .status(200)
        .json({ data: updatedUserInfo, code: 200, message: "유저 조회 성공" });
    } catch (error) {
      next(error);
    }
  }
);

userAuthRouter.get(
  "/users/search/:name",
  loginRequired,
  async (req, res, next) => {
    try {
      const { name } = req.params;
      const user = await UserAuthService.searchUser({ name });

      const result =
        Object
          .values(user)
          .map((one) => removeFields(one["_doc"], "password", "like"));

      res
        .status(200)
        .json({ data: result, code: 200, message: "유저 검색 성공" });
    } catch (error) {
      next(error);
    }
  }
);

userAuthRouter.post(
  "/users/:id/likes",
  loginRequired,
  async function (req, res, next) {
    try {
      const current = req.currentUserId;
      const liked = req.params.id;

      // 현재 로그인한 유저와 좋아요를 해줄 유저가 같다면
      if (liked === req.currentUserId) {
        // 에러 발생
        throw new Error("잘못된 접근입니다.");
      }

      // user 정보를 불러와서
      const user = await UserAuthService.getUserInfo({ userId: liked });
      const toUpdate = fieldChecking(user, "like");

      // 이미 좋아요를 눌렀다면
      if (toUpdate.like.by.includes(current)) {
        // 좋아요 -1
        toUpdate.like.count--;
        // 좋아요 누른 사람 목록에서 현재 유저의 userId 삭제
        const index = toUpdate.like.by.indexOf(current);
        toUpdate.like.by.splice(index, 1);
      }
      // 좋아요를 누르지 않았다면
      else {
        // 좋아요 +1
        toUpdate.like.count++;
        // 좋아요 누른 사람 목록에 현재 유저의 userId 추가
        toUpdate.like.by.push(current);
      }

      // 업데이트된 정보로 세팅
      const updatedUser = await UserAuthService.setUser({
        userId: liked,
        toUpdate,
      });

      // 실패했다면 에러
      if (updatedUser.errorMessage) {
        throw new Error(updatedUser.errorMessage);
      }

      const result = removeFields(updatedUser["_doc"], "password", "like");

      res
        .status(200)
        .json({ data: result, code: 200, message: "좋아요 반영 완료" });
    } catch (error) {
      next(error);
    }
  }
);

// jwt 토큰 기능 확인용, 삭제해도 되는 라우터임.
userAuthRouter.get("/afterlogin", loginRequired, function (req, res, next) {
  res
    .status(200)
    .send(
      `안녕하세요 ${req.currentUserId}님, jwt 웹 토큰 기능 정상 작동 중입니다.`
    );
});

function filteredByPermissionList(document) {
  const { permission, ...fields } = document;

  return Object
    .entries(fields)
    .reduce((res, [key, value]) => {
      if (permission[key] || permission[key] === undefined) {
        res[key] = value;
      }
      return res;
    }, {});
}

export { userAuthRouter };
