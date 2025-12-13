import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createDivisionSchema, updateDivisionSchema } from "./division.validation";
import { DivisionControllers } from "./division.controllers";
import { multerUpload } from "../../config/multer.config";




export const DivisionRouter = Router();


DivisionRouter.post('/create', checkAuth(Role.ADMIN,Role.SUPER_ADMIN),  multerUpload.single("file"),  validateRequest(createDivisionSchema),DivisionControllers.createDivision);

DivisionRouter.get("/",DivisionControllers.getAllDivisions);
DivisionRouter.get("/:slug",DivisionControllers.getSingleDivision);
DivisionRouter.patch("/:id",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),validateRequest(updateDivisionSchema),DivisionControllers.updateDivision);
DivisionRouter.delete("/:id",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),DivisionControllers.deleteDivision);


