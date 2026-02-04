import { ApiMessageDetail } from "src/common/constants";

export abstract class ApplicationException extends Error {
  public code: ApiMessageDetail;
  public status: number;
  public errorDetails: any;

  protected constructor(message: string) {
    super(message);
  }
}
