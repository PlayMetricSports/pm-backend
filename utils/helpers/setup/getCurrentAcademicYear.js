const Setup = require("@/models/system/setup.model");

const GetCurrentAcademicYear = async () => {
    try {
        const currentAcademicYear = await Setup
            .find({})
            .sort({ createdAt: -1 })
            .limit(1)
            .select("currentStartYear");

        const academicYear = `${currentAcademicYear?.[0]?.currentStartYear}-${Number(currentAcademicYear?.[0]?.currentStartYear) + 1}`;

        return {
            error: "",
            academicYear: academicYear
        };

    }
    catch (error) {
        return {
            error: error,
        };
    }
}

module.exports = GetCurrentAcademicYear;