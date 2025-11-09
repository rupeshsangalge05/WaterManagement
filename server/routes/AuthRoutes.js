import express from "express";
import { login } from "../controllers/AuthController.js";

const AuthRouter = express.Router();

AuthRouter.post("/login", login);

export default AuthRouter;
