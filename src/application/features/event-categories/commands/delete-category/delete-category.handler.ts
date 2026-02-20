import { REPO_FACADE, UNIT_OF_WORK } from "@/src/common/tokens";
import { UnitOfWork } from "@/src/infrastracture/database";
import { RepositoryFacade } from "@/src/infrastracture/repositories";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteCategoryCommand } from "./delete-category.command";

@CommandHandler(DeleteCategoryCommand)
export class DeleteCategoryHandler implements ICommandHandler<DeleteCategoryCommand> {
  constructor(
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: UnitOfWork,
    @Inject(REPO_FACADE) private readonly repoFacade: RepositoryFacade
  ) { }

  async execute(request: DeleteCategoryCommand): Promise<void> {
    await this.unitOfWork.withTransaction(async () => {
      await this.repoFacade.eventCategory.delete(request.id.value);
    });
  }
}
