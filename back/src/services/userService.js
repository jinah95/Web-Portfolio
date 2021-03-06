import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  User,
  Certificate,
  Project,
  Award,
  Career,
  Education,
  Tech,
} from "../db/index.js"; // from을 폴더(db) 로 설정 시, 디폴트로 index.js 로부터 import함.
import { v4 as uuidv4 } from "uuid";
import { updateHandler } from "../utils/utils.js";
class UserAuthService {
  static async addUser({ name, email, password }) {
    // 이메일 중복 확인
    const user = await User.findByEmail({ email });

    if (user !== null) {
      const error = new Error(
        "이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요."
      );
      error.status = 400;
      throw error;
    }

    // 비밀번호 해쉬화
    const hashedPassword = await bcrypt.hash(password, 10);

    // id 는 유니크 값 부여
    const id = uuidv4();
    const newUser = { id, name, email, password: hashedPassword };

    // db에 저장
    const createdNewUser = await User.create({ newUser });
    createdNewUser.errorMessage = null; // 문제 없이 db 저장 완료되었으므로 에러가 없음.

    return createdNewUser;
  }

  static async getUser({ email, password }) {
    // 이메일 db에 존재 여부 확인
    const user = await User.findByEmail({ email });

    if (user === null) {
      const error = new Error(
        "해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요."
      );
      error.status = 404;
      throw error;
    }

    // 비밀번호 일치 여부 확인
    const correctPasswordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(
      password,
      correctPasswordHash
    );

    if (!isPasswordCorrect) {
      const error = new Error(
        "비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요."
      );
      error.status = 401;
      throw error;
    }

    // 로그인 성공 -> JWT 웹 토큰 생성
    const secretKey = process.env.JWT_SECRET_KEY || "jwt-secret-key";
    const token = jwt.sign({ userId: user.id }, secretKey);

    // 반환할 loginuser 객체를 위한 변수 설정
    const { id, name, description } = user;

    const loginUser = {
      token,
      id,
      email,
      name,
      description,
      errorMessage: null,
    };

    return loginUser;
  }

  static async getUsers() {
    const users = await User.findAll();
    return users;
  }

  static async setUser({ userId, toUpdate }) {
    // 우선 해당 id 의 유저가 db에 존재하는지 여부 확인
    let user = await User.findById({ userId });

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (user === null) {
      const error = new Error(
        "가입 내역이 없습니다. 다시 한 번 확인해 주세요."
      );
      error.status = 404;
      throw error;
    }

    // null인 field는 제외하고, 남은 field만 객체에 담음
    const fieldToUpdate = updateHandler(toUpdate);

    // password 필드가 존재한다면
    if (fieldToUpdate["password"] !== undefined) {
      // 암호화
      fieldToUpdate["password"] = await bcrypt.hash(
        fieldToUpdate["password"],
        10
      );
    }
    user = await User.update({ userId, fieldToUpdate });

    return user;
  }

  static async getUserInfo({ userId }) {
    const user = await User.findById({ userId });

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (user === null) {
      const error = new Error(
        "존재하지 않는 사용자입니다. 다시 한 번 확인해 주세요."
      );
      error.status = 404;
      throw error;
    }

    return user;
  }

  static async searchUser({ name }) {
    const users = await User.findByName({ name });
    const techs = await User.findByTech({ name });

    for (const tech of techs) {
      if (tech.user === null || tech.user === undefined) {
        continue;
      }
      users.push(tech.user);
    }
    return users;
  }

  static async getEmail({ email }) {
    const user = await User.findByEmail({ email });
    if (user === null || user === undefined) {
      const error = new Error(
        "존재하지 않는 사용자입니다. 다시 한 번 확인해 주세요."
      );
      error.status = 404;
      throw error;
    }
    return user;
  }

  static async deleteUser({ user }) {
    await Project.deleteAll({ user });
    await Certificate.deleteAll({ user });
    await Education.deleteAll({ user });
    await Award.deleteAll({ user });
    await Career.deleteAll({ user });
    await Tech.deleteAll({ user });
    await User.delete({ user });
  }

  static async setProfile({ userId, profile }) {
    const setProfile = await User.updateByProfile({ userId, profile });
    return setProfile;
  }
}

export { UserAuthService };
