export class PaginatedResult<T> {
  constructor(
    public readonly items: T[],
    public readonly count: number,
    public readonly totalPage: number,
    public readonly page: number,
    public readonly pageSize: number,
  ) { }
}
