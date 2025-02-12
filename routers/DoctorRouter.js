
import express from "express";
import { index, show, storeReview, storeDoctor, destroyDoctor, destroyReview } from "../controllers/DoctorController.js";
const doctorRouter = express.Router();

doctorRouter.get("/", index);

doctorRouter.get("/:id", show);

doctorRouter.post("/", storeDoctor);
doctorRouter.post("/review", storeReview);

doctorRouter.delete("/:id", destroyDoctor);
doctorRouter.delete("/review/:id", destroyReview);

export default doctorRouter;