
import express from "express";
import { index } from "../controllers/SpecializationController.jsx"
const specializationRouter = express.Router();

specializationRouter.get("/specialization", index);