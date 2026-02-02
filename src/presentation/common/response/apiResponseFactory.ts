export class ApiResponse<T> {
    constructor(
        public readonly data: T,
        public readonly message: string = 'Request successful',
        public readonly statusCode: number = 200,
    ) { }

    static success<T>(
        data: T,
        message: string = 'Request successful',
        statusCode: number = 200
    ): ApiResponse<T> {
        return new ApiResponse<T>(data, message, statusCode);
    }

    static created<T>(
        data: T,
        message: string = 'Resource created successfully',
    ): ApiResponse<T> {
        return new ApiResponse<T>(data, message, 201);
    }

    static noContent(): ApiResponse<null> {
        return new ApiResponse<null>(null, 'No Content', 204);
    }

    static error<T>(
        data: T,
        message: string = 'An error occurred',
        statusCode: number = 500
    ): ApiResponse<T> {
        return new ApiResponse<T>(data, message, statusCode);
    }
}
