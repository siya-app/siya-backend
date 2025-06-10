export function matchByCoords(terrace, businesses, coordinateTolerance = 0.000001 // ~1.1 cm precision
) {
    if (!Array.isArray(businesses))
        return null;
    const matches = businesses.filter(biz => {
        console.warn(`biz ${biz} vs terrace ${terrace}`);
        const latDiff = Math.abs(parseFloat(biz.Latitud) - parseFloat(terrace.LATITUD));
        const longDiff = Math.abs(parseFloat(biz.Longitud) - parseFloat(terrace.LONGITUD));
        return latDiff < coordinateTolerance && longDiff < coordinateTolerance;
    });
    return matches.length > 0 ? matches : null;
}
//# sourceMappingURL=coordsValidator.js.map