import { CategoryId } from "@/src/domain/value-objects";

export class DeleteCategoryCommand {
  constructor(public readonly id: CategoryId) { }
}
