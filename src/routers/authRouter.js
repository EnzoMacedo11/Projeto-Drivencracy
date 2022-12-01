import { Router } from "express";
import { CriarEnquete, Opções, ReceberEnquete, ReceberOpções, Resultado, Voto } from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/poll", CriarEnquete)

authRouter.get("/poll", ReceberEnquete)

authRouter.post("/choice", Opções)

authRouter.get("/poll/:id/choice",ReceberOpções)

authRouter.post("/choice/:id/vote", Voto)

authRouter.get("/poll/:id/result", Resultado)

export default authRouter;