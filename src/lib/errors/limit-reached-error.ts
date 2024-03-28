export class LimitReachedError extends Error {
  constructor(limit: number) {
    const message = `Limit of ${limit} reached`;

    super(message);
  }
}
