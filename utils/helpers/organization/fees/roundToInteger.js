const roundToInteger = (value) => {
    const roundedAmount = Math.round(value * 100) % 100 < 50
        ? Math.floor(value)
        : Math.ceil(value);
    return roundedAmount
}
module.exports = roundToInteger