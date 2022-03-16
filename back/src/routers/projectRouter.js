import is from "@sindresorhus/is";
import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { userAuthService } from "../services/userService";
import { projectService } from "../services/projectService";

const projectRouter = Router();

projectRouter.post("/project/create", async function (req, res, next) {
// 새로운 프로젝트를 등록
// 로그인 필요
  try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    // req (request) 에서 데이터 가져오기
    //const user_id = req.currentUserId; //로그인한 user의 id

    const user_id = "2575121f-cad1-4f1f-a3e8-00293ec4a34b";
    const title = req.body.title;
    const description = req.body.description;
    const from_date = req.body.from_date;
    const to_date = req.body.to_date;

    // user 정보를 db에서 가져오기
    const user = await userAuthService.getUserInfo({ user_id });

    // 에러가 났다면
    if (user.errorMessage) {
      // 에러를 throw
      throw new Error(user.errorMessage);
    }

    // 에러가 나지 않았다면 위 데이터들을 프로젝트 db에 추가하기
    const newProject = await projectService.addProject({
      user,
      title,
      description,
      from_date,
      to_date
    });

    console.log(newProject);

    // 만약 추가하는 과정에서 에러가 났다면
    if (newProject.errorMessage) {
      // 에러를 throw
      throw new Error(newProject.errorMessage);
    }

    res.status(201).json(newProject);

  } catch (error) {
    next(error);
  }
// TODO
//  로그인 확인 미들웨어 추가
});

projectRouter.get("/projects/:id", async function (req, res, next) {
  const { id } = req.params;

  try {// project id를 이용하여 db에서 프로젝트 검색
    const project = await projectService.getProject({ id });

    // 에러가 발생했다면
    if (project.errorMessage) {
      // 에러를 throw
      throw new Error(project.errorMessage);
    }

    // 200 코드와 함께 프로젝트 정보 전송
    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
// TODO
//  로그인 확인 미들웨어 추가
});

projectRouter.put("/projects/:id", async function (req, res, next) {
  const { id } = req.params;

  try {
    // project id를 이용하여 기존의 project를 가져옴
    //const project = await projectService.getProject({id});

    // 에러가 발생했다면
    //if (project.errorMessage) {
    //  // 에러를 throw
    //  throw new Error(project.errorMessage);
    //}
    // 가져온 certificate의 user와 현재 로그인한 유저의 id 비교
    //const user = project.user;

    const title = req.body.title ?? null;
    const description = req.body.description ?? null;
    const from_date = req.body.from_date ?? null;
    const to_date = req.body.to_date ?? null;

    // 업데이트할 정보를 묶어서
    const toUpdate = { title, description, from_date, to_date };

    // 프로젝트 정보를 업데이트
    const updatedProject = await projectService.setProject({ id, toUpdate });

    // 만약 에러가 발생했다면
    if (updatedProject.errorMessage) {
      // 에러를 throw
      throw new Error(updatedProject.errorMessage);
    }

    res.status(200).json(updatedProject);
  } catch (error) {
    next(error);
  }
// TODO
//  로그인 확인 미들웨어 추가
});

projectRouter.get("/projectlist/:user_id", async function (req, res, next) {
//user_id의 프로젝트 목록을 가져옴
  const { user_id } = req.params;

  try {
    // user 정보를 db에서 가져오기
    const user = await userAuthService.getUserInfo({ user_id })

    // 에러가 났다면
    if (user.errorMessage) {
      // 에러를 throw
      throw new Error(user.errorMessage);
    }

    // 해당 user의 프로젝트 목록 가져오기
    const projects = await projectService.getProjects({ user });

    // 에러가 났다면
    if (projects.errorMessage) {
      // 에러를 throw
      throw new Error(projects.errorMessage);
    }

    res.status(200).send(projects);
  } catch (error) {
    next(error);
  }
// TODO
//  로그인 확인 미들웨어 추가
});

export { projectRouter };