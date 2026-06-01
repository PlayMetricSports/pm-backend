
const GetCurrentAcademicYearByDate = () => {
    try {
        const currentDate = new Date();
        const financialYearStart = currentDate < new Date(currentDate.getFullYear(), 3, 1)
            ? new Date(currentDate.getFullYear() - 1, 3, 1)
            : new Date(currentDate.getFullYear(), 3, 1);
        const academicYear = `${financialYearStart.getFullYear()}-${financialYearStart.getFullYear() + 1}`;
        return academicYear
    }
    catch (error) {
        return {
            error: error,
        };
    }
}

module.exports = GetCurrentAcademicYearByDate;