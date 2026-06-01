const CompileAPIActions = async (actions) => {
    const transformedObject = actions.reduce((acc, curr) => {
        const subSystemName = curr.subSystemId.subSystemName;
        const subSystemKey = curr.subSystemId.subSystemKey;
        const subSystemIcon = curr.subSystemId.subSystemIcon;

        const moduleName = curr.moduleId.moduleName;
        const moduleKey = curr.moduleId.moduleKey;
        const moduleIcon = curr.moduleId.moduleIcon;

        const subModuleName = curr.subModuleId.subModuleName;
        const subModuleKey = curr.subModuleId.subModuleKey;
        const subModuleIcon = curr.subModuleId.subModuleIcon;
        const actionKey = curr.actionKey;

        if (!acc[subSystemName]) {
            acc[subSystemName] = {
                subSystemName,
                subSystemKey,
                subSystemIcon,
                modules: {}
            };
        }
        if (!acc[subSystemName].modules[moduleName]) {
            acc[subSystemName].modules[moduleName] = {
                moduleName,
                moduleKey,
                moduleIcon,
                subModules: []
            };
        }
        acc[subSystemName].modules[moduleName].subModules.push({
            subModuleName,
            subModuleKey,
            subModuleIcon,
            actionKey
        });
        return acc;
    }, {});

    // Sort subModules by actionKey within each module
    Object.values(transformedObject).forEach(subSystem => {
        Object.values(subSystem.modules).forEach(module => {
            module.subModules.sort((a, b) => a.actionKey.localeCompare(b.actionKey));
        });
    });

    const actionMenu = Object.values(transformedObject).map(item => {
        item.modules = Object.values(item.modules);
        return item;
    });

    const permissions = actions.map(item => item.actionKey);

    return { permissions, actionMenu };
}

module.exports = CompileAPIActions;