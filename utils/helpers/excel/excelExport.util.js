const XLSX = require("xlsx");

const exportToExcel = (data, sheetName = "Sheet1", columnWidths = []) => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    if (columnWidths.length > 0) {
        worksheet["!cols"] = columnWidths;
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const buffer = XLSX.write(workbook, { 
        type: "buffer", 
        bookType: "xlsx" 
    });

    return buffer;
};

const exportMultipleSheetsToExcel = (sheets) => {
    const workbook = XLSX.utils.book_new();

    sheets.forEach(sheet => {
        const worksheet = XLSX.utils.json_to_sheet(sheet.data);
        
        if (sheet.columnWidths && sheet.columnWidths.length > 0) {
            worksheet["!cols"] = sheet.columnWidths;
        }

        XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name);
    });

    const buffer = XLSX.write(workbook, { 
        type: "buffer", 
        bookType: "xlsx" 
    });

    return buffer;
};

module.exports = {
    exportToExcel,
    exportMultipleSheetsToExcel
};