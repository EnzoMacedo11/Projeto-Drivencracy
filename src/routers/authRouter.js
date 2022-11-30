import { Router } from "express";
import { CriarEnquete, Opções, ReceberEnquete, ReceberOpções } from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/poll", CriarEnquete)

authRouter.get("/poll", ReceberEnquete)

authRouter.post("/choice", Opções)

authRouter.get("/poll/:id/choice",ReceberOpções)

export default authRouter;