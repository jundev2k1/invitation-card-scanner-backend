import { ApiMessageDetail } from "src/common/constants";

export abstract class DomainException extends Error {
  public code: ApiMessageDetail;
  public status: number;

  protected constructor(message: string) {
    super(message);
  }
}
