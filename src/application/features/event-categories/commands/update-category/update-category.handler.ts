import { BadRequestException } from "@/src/application/common";
import { REPO_FACADE, UNIT_OF_WORK } from "@/src/common/tokens";
import { NotFoundException } from "@/src/domain/exceptions";
import { UnitOfWork } from "@/src/infrastracture/database";
import { RepositoryFacade } from "@/src/infrastracture/repositories";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateCategoryCommand } from "./update-category.command";

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryHandler implements ICommandHandler<UpdateCategoryCommand> {
  constructor(
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: UnitOfWork,
    @Inject(REPO_FACADE) private readonly repoFacade: RepositoryFacade
  ) { }

  async execute(request: UpdateCategoryCommand): Promise<void> {
    const category = await this.repoFacade.eventCategory.getById(request.id.value);
    if (!category) throw NotFoundException.create('id', request.id.value);

    if (request.slug != category.slug) {
      const isExistSlug = await this.repoFacade.eventCategory.isExistSlug(request.slug);
      if (isExistSlug) throw BadRequestException.validationError(`Slug (${request.slug}) already exists`);

      category.updateSlug(request.slug);
    }

    await this.unitOfWork.withTransaction(async () => {
      category.updateInfo(
        request.name,
        request.description,
        category.imageUrl);
      category.updateSortOrder(request.sortOrder);

      await this.repoFacade.eventCategory.update(category);
    });
  }
}
