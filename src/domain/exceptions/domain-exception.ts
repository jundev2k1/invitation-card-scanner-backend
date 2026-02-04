import { ApiMessageDetail } from "src/common/constants";

export abstract class DomainException extends Error {
  protected code: ApiMessageDetail;
  protected status: number;

  protected constructor(message: string) {
    super(message);
  }
}
