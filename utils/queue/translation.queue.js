const { Queue, Worker } = require("bullmq");
const { translateAndStoreUtil } = require("@/utils/translation/translateAndStore.util");

const redisConnection = {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: parseInt(process.env.REDIS_PORT || "6379")
};

const QUEUE_NAME = "translation-jobs";

// jobs add karne ke liye queue
const translationQueue = new Queue(QUEUE_NAME, {
    connection: redisConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 3000
        },
        removeOnComplete: 100,
        removeOnFail: 200
    }
});

let totalJobsAdded = 0;
let totalJobsDone = 0;
let totalJobsFailed = 0;

const translationWorker = new Worker(
    QUEUE_NAME,
    async (job) => {
        const { modelName, refId, fields } = job.data;
        await translateAndStoreUtil({ modelName, refId, fields });
    },
    {
        connection: redisConnection,
        concurrency: 3
    }
);

translationWorker.on("completed", (job) => {
    totalJobsDone++;
    console.log("translation done: " + job.data.modelName + " refId=" + job.data.refId);
});

translationWorker.on("failed", (job, error) => {
    totalJobsFailed++;
    console.error(
        "translation failed: " + job.data.modelName + " refId=" + job.data.refId +
        " reason: " + error.message
    );
});

translationWorker.on("error", (error) => {
    console.error("translation worker error:", error.message);
});

async function addTranslationJob({ modelName, refId, fields }) {
    totalJobsAdded++;
    await translationQueue.add("translate", { modelName, refId, fields });
}

function getQueueStats() {
    return {
        totalAdded: totalJobsAdded,
        totalDone: totalJobsDone,
        totalFailed: totalJobsFailed
    };
}

module.exports = { addTranslationJob, getQueueStats };