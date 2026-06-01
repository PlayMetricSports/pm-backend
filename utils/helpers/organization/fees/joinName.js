const joinName = (name) => {
    if (name) {
        return [
            name?.firstName,
            name?.middleName,
            name?.lastName,
        ].filter(Boolean).join(' ')
    }
}

module.exports = joinName;
