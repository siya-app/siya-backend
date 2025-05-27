/**
 * Required External Modules and Interfaces
 */
import { Router, Request, Response } from 'express';
import Terrace from '../models/terrace-model-sequelize.js';
import { CustomTerraceType } from '../models/zod/customTerrace-schema.js';

/**
 * Router Definition
 */
const router = Router();

/**
 * Controller Definitions
 */

// GET ALL items
router.get("/terraces", async (req: Request, res: Response) => {
    try {
        const terraces = await Terrace.findAll();
        res.json(terraces);
        res.status(200);

    } catch (error) {
        console.log(`Error fetching terraces: error ${error}`);
        res.status(500).json({error: "Error fetching terraces"})
    }
});

// GET items/:id

router.get("/terraces/:id", async (req: Request, res: Response) => {
    const terraceID = req.params.id;
    // const { terrace } = req.body;

    if (!terraceID) {
        return res.status(400).json({ error: "Invalid or inexistent terrace ID" });
    }

    try {
        const terrace = await Terrace.findOne( { where: { id: terraceID } });

        if (!terrace) {
            return res.status(404).json({ error: "Terrace ID- not found" });
        }
        res.status(200).json(terrace);

    } catch (error) {
        console.log(`Error fetching terrace ID-${terraceID}: error ${error}`);
        res.status(500).json({error: "Error fetching terrace"})
    }
});

// POST items

router.post("/terraces", async(req: Request, res: Response) => {
    const terraceData: CustomTerraceType = req.body;

    if (!terraceData || !terraceData.id) {
        return res.status(400).json({ error: "Invalid or inexistent terrace data" })
    }

    try {
        const createdTerrace = await Terrace.create({ terrace });
        res.status(201).json(createdTerrace);

    } catch (error) {
        console.error(`Error adding terrace: error ${error}`);
        res.status(500).json({ error: "Error adding terrace" })
    }
});

// PUT items/:id

router.put("/terraces/:id", async (req: Request, res: Response) => {
    const terraceID = parseInt(req.params.id, 10);
    const { terrace } = req.body;

    if (typeof terrace !== "string" || terrace.trim() === "") {
        return res.status(400).json({err: "Invalid or inexistent terrace data"})
    }

    try {
        await Terrace.update( {terrace }, { where: { id: terraceID } });
        res.sendStatus(200);

    } catch (error) {
        console.error(`Error updating terrace ID-${terraceID}: ${error}`);
        res.status(500).json({ error: "Error updating terrace" });
    }
})

// DELETE items/:id

router.delete("/terraces/:id", async (req: Request, res: Response) => {
    const terraceID = parseInt(req.params.id, 10);

    if (isNaN(terraceID) || !terraceID) {
        return res.status(400).json({ error: "Invalid or inexistent terrace ID" })
    }

    try {
        await Terrace.destroy({ where: { id: terraceID }});
        res.sendStatus(200);

    } catch (error) {
        console.error(`Error deleting terrace ID-${terraceID}: ${error}`);
        res.status(500).json({ error: "Error deleting terrace", terraceID })
    }
});

export default router;