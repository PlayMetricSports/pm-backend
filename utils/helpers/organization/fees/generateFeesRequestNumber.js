const PaymentRequest = require("../../../../models/feeAccount/paymentRequest.model");

const GenerateFeesRequestNumber = async () => {
    // try {
    //     const formateData = new Date();
    //     const formattedDate = formateData.toLocaleDateString("en-GB");
    //     const date = formattedDate.replace(/\//g, "");

    //     const lastRequest = await PaymentRequest
    //         .findOne({ requestNumber: { $regex: `PR-${date}`, $options: "i" } })
    //         .sort({ createdAt: -1 });

    //     const lastRequestNumber = lastRequest ? Number(lastRequest.requestNumber.split("-").pop()) : 0;

    //     const requestNumber = `PR-${date}-${lastRequestNumber + 1}`;

    //     const checkNewRequest = await PaymentRequest
    //         .countDocuments({ requestNumber: requestNumber });

    //     if (checkNewRequest > 1) {
    //         return GenerateFeesRequestNumber();
    //     }
    //     else {
    //         return requestNumber;
    //     }
    // }
    try {
        // const formateData = new Date();
        // const formattedDate = formateData.toLocaleDateString("en-GB");
        // const date = formattedDate.replace(/\//g, "");

        // const lastRequest = await PaymentRequest
        //     .findOne({ requestNumber: { $regex: `PR-${date}`, $options: "i" } })
        //     .sort({ createdAt: -1 });

        // const lastRequestNumber = lastRequest ? Number(lastRequest.requestNumber.split("-").pop()) : 0;

        // const requestNumber = `PR-${date}-${lastRequestNumber + 1}`;

        // const checkNewRequest = await PaymentRequest
        //     .countDocuments({ requestNumber: requestNumber });

        // if (checkNewRequest > 1) {
        //     return GenerateFeesRequestNumber();
        // }
        // else {
        //     return requestNumber;
        // }


        // K12PRDDMMYYYYXXX
        const todaysDate = new Date();
        const dd = String(todaysDate.getDate()).padStart(2, '0');
        const mm = String(todaysDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const yyyy = todaysDate.getFullYear();
        const formattedDate = `${dd}${mm}${yyyy}`;
        const date = formattedDate.replace(/\//g, "");

        const lastRequest = await PaymentRequest
            .findOne({ requestNumber: { $regex: `K12PR${date}`, $options: "i" } })
            .sort({ createdAt: -1 });

        const lastRequestNumber = lastRequest ? Number(lastRequest.requestNumber.slice(-3)) : 0;

        const requestNumber = `K12PR${date}${String(lastRequestNumber + 1).padStart(3, '0')}`;

        const checkNewRequest = await PaymentRequest.countDocuments({ requestNumber: requestNumber });

        if (checkNewRequest > 1) {
            return GenerateFeesRequestNumber();
        }
        else {
            return requestNumber;
        }
    }
    catch (error) {
        return null;
    }
}

module.exports = GenerateFeesRequestNumber;