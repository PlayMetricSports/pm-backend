const parseName = (name) => {
    if (name) {
        const parts = name.split(" ");
        const firstName = parts[0].trim() || ""
        if (parts.length > 2)
            return {
                firstName,
                middleName: parts[1].trim() || "",
                lastName: parts.slice(2).join(" ").trim() || "",
            }
        else return {
            firstName,
            middleName: "",
            lastName: parts.slice(1).join(" ").trim() || "",
        }
    }
}

module.exports = parseName;
