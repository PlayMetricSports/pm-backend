const Curriculum = require("@/models/erp/subject/curriculum.model");

async function generateUniqueID() {
    let Id = "";

    const latestCurriculum = await Curriculum.findOne({}).sort({ createdAt: -1 }).select("curriculumId");

    if (latestCurriculum) {
        const latestCurriculumId = latestCurriculum.curriculumId;
        const CurriculumIdSplit = latestCurriculumId.split("-")
        const CurriculumIdNumber = CurriculumIdSplit[CurriculumIdSplit.length - 1];
        const num = Number(CurriculumIdNumber);
        Id = `CUR-${num + 1}`;
    } else {
        Id = "CUR-1";
    }

    const existingCurriculum = await Curriculum.findOne({ curriculumId: Id });

    if (existingCurriculum) {
        return generateUniqueID();
    } else {
        return Id;
    }
}

module.exports = generateUniqueID;