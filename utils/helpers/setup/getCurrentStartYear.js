
const GetCurrentStartYear = (academicYear) => {
    try {
        const currentDate = new Date();
        const financialYearStart = currentDate < new Date(currentDate.getFullYear(), 3, 1)
            ? new Date(currentDate.getFullYear() - 1, 3, 1)
            : new Date(currentDate.getFullYear(), 3, 1);

        const startYear = academicYear ? academicYear.split("-")[0] : financialYearStart.getFullYear();
        return startYear

    }
    catch (error) {
        return {
            error: error
        };
    }
}

module.exports = GetCurrentStartYear;