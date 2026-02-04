export abstract class baseEntity<T> {
  constructor(
    public readonly id: T,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) { }
}