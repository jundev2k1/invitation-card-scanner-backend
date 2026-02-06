import { UNIT_OF_WORK } from "src/common/tokens";
import { UnitOfWork } from "../unit-of-work/unit-of-work";

export const unitOfWorkProvider = {
  provide: UNIT_OF_WORK,
  useClass: UnitOfWork
};
