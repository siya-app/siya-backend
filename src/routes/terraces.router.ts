/**
 * Required External Modules and Interfaces
 */
import { Router, Request, Response } from 'express';
import { pool } from '../config/db-connection.js';
import Terrace from '../models/terrace-model-sequelize.js';

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
        res.status(200)
    } catch (err) {
        console.log(`error fetching terraces: error ${err}`);
        res.status(500).json({error: "Error fetching terraces"})
    }
});

// GET items/:id

// POST items

// PUT items/:id

// DELETE items/:id