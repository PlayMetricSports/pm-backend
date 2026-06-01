const doTimesOverlap = (startA, endA, startB, endB) => {
    const toMinutes = (timeStr) => {
        const [hours, minutes] = timeStr.split(":").map(Number);
        return hours * 60 + minutes;
    };

    const startAMins = toMinutes(startA);
    const endAMins = toMinutes(endA);
    const startBMins = toMinutes(startB);
    const endBMins = toMinutes(endB);

    return startAMins < endBMins && endAMins > startBMins;
};

module.exports = { doTimesOverlap };