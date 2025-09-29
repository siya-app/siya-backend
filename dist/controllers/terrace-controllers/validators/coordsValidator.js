export function matchByCoords(terrace, businesses, coordinateTolerance // ~5m precision
) {
    if (!Array.isArray(businesses))
        return null;
    const matches = businesses.filter(biz => {
        // console.warn(`biz ${biz} vs terrace ${terrace}`)
        const latDiff = Math.abs(parseFloat(biz.Latitud) - parseFloat(terrace.LATITUD));
        const longDiff = Math.abs(parseFloat(biz.Longitud) - parseFloat(terrace.LONGITUD));
        // console.log(`→ Biz: ${biz.Nom_Local}, latDiff: ${latDiff}, longDiff: ${longDiff}`);
        return latDiff < coordinateTolerance && longDiff < coordinateTolerance;
    });
    // console.log(`${matches.map((biz) => biz.Nom_Local)}`);
    return matches.length > 0 ? matches : null;
}
//# sourceMappingURL=coordsValidator.js.map