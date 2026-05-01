import { Worker } from "bullmq";
import { logger } from "@/lib/logger/logger";

const connection = { url: process.env.REDIS_URL ?? "redis://localhost:6379" };

export const orderWorker = new Worker(
  "orders",
  async (job) => {
    logger.info({ jobId: job.id, data: job.data }, "Processing order job");
  },
  { connection }
);

orderWorker.on("completed", (job) => {
  logger.info({ jobId: job.id }, "Order job completed");
});

orderWorker.on("failed", (job, err) => {
  logger.error({ jobId: job?.id, err }, "Order job failed");
});
