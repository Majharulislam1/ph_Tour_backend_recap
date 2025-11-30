import { Router } from "express";
import { AuthControllers } from "./auth.controller";

const router = Router();

router.post('/login',AuthControllers.crediantialController);
router.post('/refresh-token',AuthControllers.getNewAccessToken);



export const AuthRoute = router;