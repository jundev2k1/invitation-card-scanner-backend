export abstract class baseEntity<T> {
  constructor(
    public id: T,
    public createdAt: Date,
    public updatedAt: Date,
  ) { }

  public updateUpdatedAt(): void {
    this.updatedAt = new Date();
  }
}