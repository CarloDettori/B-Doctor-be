
import express from "express";
import { index, show, storeReview, storeDoctor, destroyDoctor, destroyReview, indexSpecialization } from "../controllers/DoctorController.js";
const doctorRouter = express.Router();
const specializationsRouter = express.Router();

doctorRouter.get("/", index);
specializationsRouter.get("/", indexSpecialization);

doctorRouter.get("/:id", show);

doctorRouter.post("/", storeDoctor);
doctorRouter.post("/review/:id", storeReview);

doctorRouter.delete("/:id", destroyDoctor);
doctorRouter.delete("/review/:id", destroyReview);

export {
    doctorRouter,
    specializationsRouter
};
