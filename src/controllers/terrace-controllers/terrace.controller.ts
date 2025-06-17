import Terrace from '../../models/terrace-model/db/terrace-model-sequelize.js';
import Tag from '../../models/terrace-model/db/tags-model-sequelize.js'
import { CustomTerraceSchema } from '../../models/terrace-model/zod/customTerrace-schema.js';
import { Request, Response } from 'express';


// http://localhost:8080/terraces
// GET ALL items
export const getAllTerraces = async (req: Request, res: Response) => {
    try {
        const terraces = await Terrace.findAll();
        res.json(terraces);
        res.status(200);

    } catch (error: any) {
        console.error(`Error fetching terraces: error ${error}`);

        if (error.name === 'ZodError') {
            return res.status(500).json({ error: "❌ Error fetching terraces", details: error.errors })
        }

        console.error(`❌ Error fetching terraces:`, error);
        return res.status(500).json({ error: "Error fetching terraces" });
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
        const terrace = await Terrace.findByPk(terraceID);
        // const terrace = await Terrace.findOne({ where: { id: terraceID } });

        if (!terrace) {
            return res.status(404).json({ error: "Terrace ID- not found" });
        }
        res.status(200).json(terrace);

    } catch (error: any) {
        console.error(`Error fetching terrace ID-${terraceID}: error ${error}`);

        if (error.name === 'ZodError') {
            return res.status(500).json({ error: "❌ Error fetching terrace", details: error.errors })
        }

        console.error(`❌ Error fetching terrace:`, error);
        return res.status(500).json({ error: "Error fetching terrace" });
    }
};

export const getFilteredTerraces = async (req: Request, res: Response) => {
    const { cover, dietary, emotional, food, placement } = req.query;

    try {
        // Convert query params to an array of tag IDs
        const filterIds = [
            cover, 
            dietary, 
            emotional, 
            food, 
            placement
        ].filter(Boolean).map(Number);

        // Base query options
        const queryOptions: any = {
            include: [
                {
                    model: Tag,
                    as: 'tags',
                    attributes: ['id', 'name', 'category', 'image_url'],
                    through: { attributes: [] } // Hide junction table attributes
                }
            ]
        };

        // Apply filters if any are provided
        if (filterIds.length > 0) {
            queryOptions.include[0].where = {
                id: filterIds
            };
            
            // Count how many unique categories are being filtered
            const categoryCount = await Tag.count({
                where: { id: filterIds },
                attributes: ['category'],
                group: ['category'],
                distinct: true
            });

            queryOptions.having = sequelize.literal(
                `COUNT(DISTINCT tags.id) >= ${categoryCount.length}`
            );
            queryOptions.group = ['Terrace.id'];
        }

        const terraces = await Terrace.findAll(queryOptions);

        if (!terraces || terraces.length === 0) {
            return res.status(404).json({ 
                message: "No terraces found matching the selected filters",
                suggestion: "Try broadening your search criteria"
            });
        }

        // Optional: Format the response to group tags by category
        const formattedTerraces = terraces.map(terrace => ({
            ...terrace.get({ plain: true }),
            tagsByCategory: terrace.tags.reduce((acc, tag) => {
                if (!acc[tag.category]) {
                    acc[tag.category] = [];
                }
                acc[tag.category].push(tag);
                return acc;
            }, {})
        }));

        res.status(200).json({
            count: terraces.length,
            terraces: formattedTerraces
        });

    } catch (error: any) {
        console.error('❌ Error fetching filtered terraces:', error);

        if (error.name === 'SequelizeDatabaseError') {
            return res.status(400).json({ 
                error: "Invalid filter parameters",
                details: error.message
            });
        }

        if (error.name === 'ZodError') {
            return res.status(400).json({ 
                error: "Validation error", 
                details: error.errors 
            });
        }

        return res.status(500).json({ 
            error: "Internal server error",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


// http://localhost:8080/terraces
// POST items
export const createNewTerrace = async (req: Request, res: Response) => {

    try {
        const terraceData = CustomTerraceSchema.parse(req.body);

        if (!terraceData) {
            return res.status(204).json({ error: "Invalid or inexistent terrace" });
        }
        console.warn("💡 terraceData validated:", terraceData);

        const createdTerrace = await Terrace.create(terraceData);
        return res.status(201).json(createdTerrace);

    } catch (error: any) {
        if (error.name === "ZodError") {
            console.error("🔥 FULL ERROR:", error);
            return res.status(400).json({ error: "❌ Validation failed", details: error.errors });
        }

        console.error(`❌ Error adding terrace:`, error);
        return res.status(500).json({ error: "Error adding terrace" });
    }
};

// http://localhost:8080/terraces/id
// PUT items/:id
export const updateTerrace = async (req: Request, res: Response) => {
    const terraceID = req.params.id;
    const updateData = req.body; // Assuming the update data is sent in the request body

    if (!terraceID) {
        return res.status(400).json({ error: "Invalid or inexistent terrace ID" });
    }

    if (!updateData || Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: "No update data provided" });
    }

    try {
        const [updatedRows] = await Terrace.update(updateData, {
            where: { id: terraceID }
        });

        if (updatedRows === 0) {
            return res.status(404).json({ error: "Terrace not found or no changes made" });
        }

        res.status(200).json({
            message: "Terrace updated successfully",
            terraceID,
            updatedFields: updateData
        });

    } catch (error: any) {
        console.error(`Error updating terrace ID-${terraceID}: ${error}`);

        if (error.name === 'ZodError') {
            return res.status(500).json({
                error: "❌ Error updating terrace",
                terraceID,
                details: error.errors
            });
        }

        console.error(`❌ Error updating terrace:`, error);
        return res.status(500).json({
            error: "Error updating terrace",
            message: error.message
        });
    }
};

// http://localhost:8080/terraces
// DELETE items/:id
export const deleteTerrace = async (req: Request, res: Response) => {
    const terraceID = req.params.id;

    if (!terraceID) {
        return res.status(400).json({ error: "Invalid or inexistent terrace ID" })
    }

    try {
        await Terrace.destroy({ where: { id: terraceID } });
        res.sendStatus(200);

    } catch (error: any) {
        console.error(`Error deleting terrace ID-${terraceID}: ${error}`);

        if (error.name === 'ZodError') {
            return res.status(500).json({ error: "❌ Error deleting terrace", terraceID, details: error.errors });
        }
        console.error(`❌ Error adding terrace:`, error);
        return res.status(500).json({ error: "Error deleting terrace" });
    }
};