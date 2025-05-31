import { z } from "zod";

export const TerraceSchema = z.object({
    LATITUD: z.string(),
    CODI_DISTRICTE: z.string(),
    EMPLACAMENT: z.string(),
    // CADIRES_CALCADA: z.string(),
    // TAULES_CALCADA: z.string(),
    // DATA_EXPLO: z.string(),
    CADIRES: z.string(),
    // Y_ETRS89: z.string(),
    // VIGENCIA: z.string(),
    // X_ETRS89: z.string(),
    NOM_BARRI: z.string(),
    CADIRES_VORERA: z.string(),
    TAULES_VORERA: z.string(),
    // OCUPACIO: z.string(),
    NOM_DISTRICTE: z.string(),
    CODI_BARRI: z.string(),
    TAULES: z.string(),
    _id: z.number(),
    // ORDENACIO: z.string(),
    LONGITUD: z.string(),
    SUPERFICIE_OCUPADA: z.string(),
}).passthrough();

export type TerraceApiType = z.infer<typeof TerraceSchema>;
