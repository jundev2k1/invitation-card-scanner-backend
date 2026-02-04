export class ApiResponse<T> {
  constructor(
    public readonly data: T,
    public readonly statusCode: number,
    public readonly messageCode: string,
    public readonly message: string,
  ) { };
}