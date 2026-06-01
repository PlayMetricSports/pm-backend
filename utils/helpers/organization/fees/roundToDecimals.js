const roundToDecimals = (value, decimals = 2) => {
    if (value === null || value === undefined || value === '' || isNaN(value)) {
        return 0;
    }
    const factor = Math.pow(10, decimals);
    return Math.round(Number(value) * factor) / factor;
}

module.exports = roundToDecimals;
