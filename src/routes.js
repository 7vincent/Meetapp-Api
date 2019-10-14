import { Router } from "express";
import multer from "multer";
import multerConfig from "./config/multer";

import userController from "./app/controller/UserController";
import sessionController from "./app/controller/SessionController";
import fileController from "./app/controller/FileController";
import meetupController from "./app/controller/MeetupController";
import authMiddleware from "./app/middleware/auth";

const routes = new Router();
const upload = multer(multerConfig);

routes.post("/users", userController.store);
routes.post("/session", sessionController.store);

routes.use(authMiddleware);

routes.put("/users", userController.update);
routes.get("/users", userController.index);

routes.post("/meetups", meetupController.store);

routes.post("/files", upload.single("file"), fileController.store);

export default routes;
