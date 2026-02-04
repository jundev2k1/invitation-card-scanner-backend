export class ApiResponse<T> {
  constructor(
    public readonly data: T | undefined,
    public readonly statusCode: number,
    public readonly messageCode: string,
    public readonly message: string,
    public readonly details: any | null | undefined = undefined,
  ) { };
}