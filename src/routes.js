import { Router } from "express";

import userController from "./app/controller/UserController";
import sessionController from "./app/controller/SessionController";
import authMiddleware from "./app/middleware/auth";

const routes = new Router();

routes.post("/users", userController.store);
routes.post("/session", sessionController.store);

routes.use(authMiddleware);

routes.put("/users", userController.update);
routes.get("/users", userController.index);

export default routes;
