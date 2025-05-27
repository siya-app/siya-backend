import { Router } from "express";
import {
    getAllTerraces,
    getTerraceById,
    createNewTerrace,
    updateTerrace,
    deleteTerrace,
} from "../controllers/terrace.controller.js";

const router = Router();

router.get("/", getAllTerraces);
router.post("/", createNewTerrace);
router.get("/:id", getTerraceById);
router.put("/:id", updateTerrace);
router.delete("/:id", deleteTerrace);

export default router;