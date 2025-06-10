function normalizeString(s) {
    return s.toLowerCase().replace(/[^\w\s]/g, '').trim();
}
export function matchByCoordsAndAddress(terrace, businesses) {
    const validMatches = [];
    const invalidMatches = [];
    const emplacement = normalizeString(terrace.EMPLACAMENT);
    businesses.forEach(biz => {
        const streetName = normalizeString(biz.Nom_Via) ?? '';
        const streetNumber = biz.Porta ? String(biz.Porta) : '';
        const hasStreet = streetName && emplacement.includes(streetName);
        const hasNumber = streetNumber && emplacement.includes(streetNumber);
        if (hasStreet && hasNumber) {
            validMatches.push(biz);
        }
        else {
            let reason = 'BOTH_MISSING';
            if (hasStreet && !hasNumber)
                reason = 'MISSING_NUMBER';
            if (!hasStreet && hasNumber)
                reason = 'MISSING_STREET';
            invalidMatches.push({
                name: biz.Nom_Local || 'Unknown name',
                address: terrace.EMPLACAMENT,
                lat: biz.Latitud,
                long: biz.Longitud,
                reason
            });
        }
    });
    return {
        validMatches,
        invalidMatches
    };
}
//# sourceMappingURL=addressValidator.js.map