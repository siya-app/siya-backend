import Terrace from '../models/terrace-model-sequelize.js';
import { Router, Request, Response } from 'express';
import { CustomTerraceType } from '../models/zod/customTerrace-schema.js';

// http://localhost:8080/terraces
// GET ALL items
export const getAllTerraces = async (req: Request, res: Response) => {
    try {
        const terraces = await Terrace.findAll();
        res.json(terraces);
        res.status(200);

    } catch (error) {
        console.log(`Error fetching terraces: error ${error}`);
        res.status(500).json({error: "Error fetching terraces"})
    }
};

// http://localhost:8080/terraces/id
// GET items/:id
export const getTerraceById = async (req: Request, res: Response) => {
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
};

// http://localhost:8080/terraces
// POST items
export const createNewTerrace = async(req: Request, res: Response) => {
    const terraceData: CustomTerraceType = req.body;
    console.log("💡 terraceData:", terraceData);

    if (!terraceData || !terraceData.id) {
        return res.status(400).json({ error: "Invalid or inexistent terrace data" })
    }

    try {
        const createdTerrace = await Terrace.create(terraceData);
        res.status(201).json(createdTerrace);

    } catch (error) {
        console.error(`Error adding terrace: error ${error}`);
        res.status(500).json({ error: "Error adding terrace" })
    }
};

// http://localhost:8080/terraces/id
// PUT items/:id
export const updateTerrace = async (req: Request, res: Response) => {
    const terraceID = parseInt(req.params.id, 10);
    const { terrace } = req.body;

    if (typeof terrace !== "string" || terrace.trim() === "") {
        return res.status(400).json({err: "Invalid or inexistent terrace data"})
    }

    try {
        await Terrace.update( { terrace }, { where: { id: terraceID } });
        res.sendStatus(200);

    } catch (error) {
        console.error(`Error updating terrace ID-${terraceID}: ${error}`);
        res.status(500).json({ error: "Error updating terrace" });
    }
};

// http://localhost:8080/terraces
// DELETE items/:id
export const deleteTerrace = async (req: Request, res: Response) => {
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
};