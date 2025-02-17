
import express from "express";
import { index, indexSpecialization, show, showSpecialization, storeReview, storeDoctor, destroyDoctor, destroyReview } from "../controllers/DoctorController.js";
const doctorRouter = express.Router();
const specializationsRouter = express.Router();

doctorRouter.get("/", index);
specializationsRouter.get("/", indexSpecialization);

doctorRouter.get("/:id", show);
specializationsRouter.get("/:id", showSpecialization);

doctorRouter.post("/", storeDoctor);
doctorRouter.post("/review/:id", storeReview);

doctorRouter.delete("/:id", destroyDoctor);
doctorRouter.delete("/review/:id", destroyReview);

export {
    doctorRouter,
    specializationsRouter
};
