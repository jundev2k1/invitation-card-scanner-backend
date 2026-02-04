import { ApiMessageDetail } from "src/common/constants";

export abstract class ApplicationException extends Error {
  protected code: ApiMessageDetail;
  protected status: number;

  protected constructor(message: string) {
    super(message);
  }
}
