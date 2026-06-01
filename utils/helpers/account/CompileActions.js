const CompileActions = async (actions) => {
    const transformedObject = actions.reduce((acc, curr) => {
        const { subSystemId, moduleId, subModuleId } = curr;

        const subSystemName = subSystemId?.subSystemName || '';
        const subSystemKey = subSystemId?.subSystemKey || '';
        const subSystemIcon = subSystemId?.subSystemIcon || '';
        const subSystemIndexing = subSystemId?.indexing || 0;

        const moduleName = moduleId?.moduleName || '';
        const moduleKey = moduleId?.moduleKey || '';
        const moduleIcon = moduleId?.moduleIcon || '';
        const moduleIndexing = moduleId?.indexing || 0;

        const subModuleName = subModuleId?.subModuleName || '';
        const subModuleKey = subModuleId?.subModuleKey || '';
        const subModuleIcon = subModuleId?.subModuleIcon || '';
        const subModuleIndexing = subModuleId?.indexing || 0;

        if (!acc[subSystemName]) {
            acc[subSystemName] = {
                subSystemName,
                subSystemKey,
                subSystemIcon,
                subSystemIndexing, // Used for sorting but will be excluded later
                modules: {}
            };
        }

        if (!acc[subSystemName].modules[moduleName]) {
            acc[subSystemName].modules[moduleName] = {
                moduleName,
                moduleKey,
                moduleIcon,
                moduleIndexing, // Used for sorting but will be excluded later
                subModules: []
            };
        }

        acc[subSystemName].modules[moduleName].subModules.push({
            subModuleName,
            subModuleKey,
            subModuleIcon,
            subModuleIndexing // Used for sorting but will be excluded later
        });

        return acc;
    }, {});

    // Sort the subsystems by subSystemIndexing
    const sortedSubsystems = Object.values(transformedObject).sort((a, b) => a.subSystemIndexing - b.subSystemIndexing);

    // Sort the modules and submodules
    sortedSubsystems.forEach(subSystem => {
        subSystem.modules = Object.values(subSystem.modules).sort((a, b) => a.moduleIndexing - b.moduleIndexing);

        subSystem.modules.forEach(module => {
            module.subModules.sort((a, b) => a.subModuleIndexing - b.subModuleIndexing);
        });
    });

    // Exclude indexing fields from the final return structure
    const actionMenu = sortedSubsystems.map(subSystem => ({
        subSystemName: subSystem.subSystemName,
        subSystemKey: subSystem.subSystemKey,
        subSystemIcon: subSystem.subSystemIcon,
        modules: subSystem.modules.map(module => ({
            moduleName: module.moduleName,
            moduleKey: module.moduleKey,
            moduleIcon: module.moduleIcon,
            subModules: module.subModules.map(subModule => ({
                subModuleName: subModule.subModuleName,
                subModuleKey: subModule.subModuleKey,
                subModuleIcon: subModule.subModuleIcon
            }))
        }))
    }));

    // Get the permissions
    const permissions = actions.map(item => item.actionKey);

    return { permissions, actionMenu };
}

module.exports = CompileActions;