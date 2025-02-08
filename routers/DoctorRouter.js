
import express from "express";
import { index, show, store, destroy } from "../controllers/DoctorController.js";
const doctorRouter = express.Router();

doctorRouter.get("/", index);

doctorRouter.get("/:id", show);

doctorRouter.post("/", store);

doctorRouter.delete("/:id", destroy);


export default doctorRouter;