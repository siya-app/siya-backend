import { z } from "zod";

export const TerraceSchema = z.object({

    LATITUD: z.string(),
    LONGITUD: z.string(),
    CODI_DISTRICTE: z.string(),
    NOM_DISTRICTE: z.string(),
    CODI_BARRI: z.string(),
    NOM_BARRI: z.string(),
    EMPLACAMENT: z.string(),
    OCUPACIO: z.string(),
    TAULES: z.string(),
    CADIRES: z.string(),
    TAULES_VORERA: z.string(),
    CADIRES_VORERA: z.string(),
    TAULES_CALCADA: z.string(),
    CADIRES_CALCADA: z.string(),
    SUPERFICIE_OCUPADA: z.string(),
    DATA_EXPLO: z.string(),
    VIGENCIA: z.string(),
    ORDENACIO: z.string(),
    X_ETRS89: z.string(),
    Y_ETRS89: z.string(),
    _id: z.number()
}).passthrough();

export type TerraceApiType = z.infer<typeof TerraceSchema>;

