import { Router } from "express";
import multer from "multer";
import multerConfig from "./config/multer";

import userController from "./app/controller/UserController";
import sessionController from "./app/controller/SessionController";
import fileController from "./app/controller/FileController";
import meetupController from "./app/controller/MeetupController";
import subscriptionController from "./app/controller/SubscriptionController";
import authMiddleware from "./app/middleware/auth";

const routes = new Router();
const upload = multer(multerConfig);

routes.post("/users", userController.store);
routes.post("/session", sessionController.store);

routes.use(authMiddleware);

routes.put("/users", userController.update);
routes.get("/users", userController.index);

routes.post("/meetups", meetupController.store);
routes.get("/mymeetups", meetupController.myMeetups);
routes.put("/meetups", meetupController.update);
routes.delete("/meetups", meetupController.delete);

routes.post("/files", upload.single("file"), fileController.store);
routes.get("/files", fileController.index);

routes.post("/subscription", subscriptionController.store);

export default routes;
