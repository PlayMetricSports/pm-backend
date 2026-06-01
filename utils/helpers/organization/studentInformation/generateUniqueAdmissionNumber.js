const EnrollStudent = require("@/models/crm/conversion/enrollStudent.model");
const StudentInformation = require("@/models/erp/student/studentInformation.model");


const checkIfUnique = async (number) => {
    let admissionNumber = `K12-${number.toString().padStart(4, "0")}`;
    const isNotUnique = await StudentInformation.findOne({ admissionNumber: admissionNumber }).select("_id").lean();
    if (isNotUnique) {
        return checkIfUnique(number + 1);
    }
    else {
        return admissionNumber
    }
}


const GenerateUniqueAdmissionNumber = async () => {
    try {
        let admissionNumber = "";
        let currentNumericPart = 1;
        let currentStudentInfoNumericPart = 1;
        let currentEnrollStudentNumericPart = 1;

        const defaultNumericPart = 7101

        const latestStudent = await StudentInformation.findOne({}).sort({ _id: -1 }).select("admissionNumber");
        const latestEnrolledStudent = await EnrollStudent.findOne({}).sort({ _id: -1 }).select("admissionNumber")

        if (latestStudent) {
            const lastAdmissionNumber = latestStudent?.admissionNumber.split("-");
            const lastNumericPartforStudentInfo = Number(lastAdmissionNumber.at(-1));

            currentStudentInfoNumericPart = lastNumericPartforStudentInfo + 1;
        }
        if (latestEnrolledStudent) {
            const lastAdmissionNumberforEnroll = latestEnrolledStudent?.admissionNumber.split("-");
            const lastNumericPartforEnrolled = Number(lastAdmissionNumberforEnroll.at(-1));

            currentEnrollStudentNumericPart = lastNumericPartforEnrolled + 1;
        }

        currentNumericPart = Math.max(currentEnrollStudentNumericPart, currentStudentInfoNumericPart);
        const numericPart = Math.max(currentNumericPart, defaultNumericPart);
        admissionNumber = await checkIfUnique(numericPart)
        return {
            code: 200,
            success: true,
            data: {
                admissionNumber: admissionNumber
            },
            error: [],
            message: "Addmission number generated successfully."
        };
    } catch (error) {
        return {
            code: 500,
            success: false,
            error: [
                {
                    field: "popup",
                    message: `Error: ${error}`
                }
            ],
            message: ""
        };
    }
}

module.exports = GenerateUniqueAdmissionNumber;
