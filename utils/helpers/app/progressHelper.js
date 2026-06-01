const calculateLevelAndBadge = (totalPoints) => {
    const currentLevel = Math.floor(totalPoints / 100) + 1;

    let currentBadge = "Bronze";
    if (currentLevel >= 5) {
        currentBadge = "Gold";
    } else if (currentLevel >= 3) {
        currentBadge = "Silver";
    }

    return { currentLevel, currentBadge };
};

const calculateOverallProgress = async (Model, studentId) => {
    const result = await Model.aggregate([
        { $match: { studentId: studentId } },
        {
            $group: {
                _id: null,
                totalPoints: { $sum: "$totalPointsEarned" },
                totalSessions: { $sum: 1 },
                completedSessions: {
                    $sum: { $cond: ["$isCompleted", 1, 0] }
                }
            }
        }
    ]);

    const totalPoints = result[0]?.totalPoints || 0;
    const totalSessions = result[0]?.totalSessions || 0;
    const completedSessions = result[0]?.completedSessions || 0;
    const { currentLevel, currentBadge } = calculateLevelAndBadge(totalPoints);

    return {
        totalPoints,
        totalSessions,
        completedSessions,
        currentLevel,
        currentBadge,
        pointsToNextLevel: 100 - (totalPoints % 100)
    };
};

module.exports = { calculateLevelAndBadge, calculateOverallProgress };