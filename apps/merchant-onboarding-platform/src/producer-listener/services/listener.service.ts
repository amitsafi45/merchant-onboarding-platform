import {
  OnQueueEvent,
  QueueEventsHost,
  QueueEventsListener,
  InjectQueue,
} from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import {
  ActiveEvent,
  AddedEvent,
  CompletedEvent,
  FailedEvent,
  RiskReviewJobPayload,
  QueueNameConfig,
} from '@app/queue-contracts';

@QueueEventsListener(QueueNameConfig.MERCHANT_RISK_REVIEW_QUEUE)
export class ListenerEventService extends QueueEventsHost {
  constructor(
    @InjectQueue(QueueNameConfig.MERCHANT_RISK_REVIEW_QUEUE)
    private readonly merchantRiskReviewQueue: Queue<RiskReviewJobPayload>,
  ) {
    super();
  }

  /**
   * Handles a risk-review job being added to the queue.
   *
   * The assignment does not specify real-time status updates, so no
   * notification is emitted here. If real-time notifications are required
   * later, emit the appropriate Socket.IO event from this handler.
   */
  @OnQueueEvent('added')
  async onAdded(args: AddedEvent): Promise<void> {
    const { jobId } = args;
    const job = await this.getJob(jobId);

    if (!job) {
      return;
    }

    const { jobId: applicationId, payload } = job.data;

    // Emit a Socket.IO event here if real-time notifications are required.
  }

  /**
   * Handles a risk-review job becoming active.
   *
   * The assignment does not specify real-time status updates, so no
   * notification is emitted here. Socket.IO can be used to notify clients
   * when the job starts processing, if required in the future.
   */
  @OnQueueEvent('active')
  async onActive(args: ActiveEvent): Promise<void> {
    const { jobId } = args;
    const job = await this.getJob(jobId);

    if (!job) {
      return;
    }

    const { jobId: applicationId, payload } = job.data;

    // Emit a Socket.IO event here if real-time notifications are required.
  }

  /**
   * Handles a successfully completed risk-review job.
   *
   * The assignment does not specify real-time status updates, so no
   * notification is emitted here. If clients need immediate completion
   * updates later, emit a Socket.IO event from this handler.
   */
  @OnQueueEvent('completed')
  async onQueueCompleted(args: CompletedEvent): Promise<void> {
    const { jobId } = args;
    const job = await this.getJob(jobId);

    if (!job) {
      return;
    }

    const { jobId: applicationId, payload } = job.data;

    // Emit a Socket.IO event here if real-time notifications are required.
  }

  /**
   * Handles a failed risk-review job.
   *
   * The assignment does not specify real-time status updates, so no
   * notification is emitted here. If clients need immediate failure
   * notifications later, emit a Socket.IO event from this handler.
   */
  @OnQueueEvent('failed')
  async onFailed(args: FailedEvent): Promise<void> {
    const { jobId } = args;
    const job = await this.getJob(jobId);

    if (!job) {
      return;
    }

    const { jobId: applicationId, payload } = job.data;

    // Emit a Socket.IO event here if real-time notifications are required.
  }

  /**
   * Retrieves a risk-review job by its ID.
   */
  private async getJob(
    jobId: string,
  ): Promise<Job<RiskReviewJobPayload> | undefined> {
    return (await this.merchantRiskReviewQueue.getJob(jobId)) ?? undefined;
  }
}
