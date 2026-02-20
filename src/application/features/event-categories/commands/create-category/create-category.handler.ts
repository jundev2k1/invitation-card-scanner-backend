import { BadRequestException } from "@/src/application/common";
import { REPO_FACADE, UNIT_OF_WORK } from "@/src/common/tokens";
import { EventCategory } from "@/src/domain/entities";
import { UnitOfWork } from "@/src/infrastracture/database";
import { RepositoryFacade } from "@/src/infrastracture/repositories";
import { Inject } from "@nestjs/common";
import { CreateCategoryCommand } from "./create-category.command";

export class CreateCategoryHandler {
  constructor(
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: UnitOfWork,
    @Inject(REPO_FACADE) private readonly repoFacade: RepositoryFacade
  ) { }

  async execute(request: CreateCategoryCommand) {
    const isExistParentId = await this.repoFacade.eventCategory.isExistParent(request.parentId.value);
    if (!isExistParentId) throw BadRequestException.validationError(`ParentID (${request.parentId.value}) does not exist`);

    const isExistId = await this.repoFacade.eventCategory.isExistId(request.id.value);
    if (isExistId) throw BadRequestException.validationError(`ID (${request.id.value}) already exists`);

    const isExistSlug = await this.repoFacade.eventCategory.isExistSlug(request.slug);
    if (isExistSlug) throw BadRequestException.validationError(`Slug (${request.slug}) already exists`);
    
    const category = EventCategory.create({
      id: request.id,
      name: request.name,
      slug: request.slug,
      parentId: request.parentId,
      description: request.description,
      imageUrl: "",
      sortOrder: request.sortOrder
    });
    await this.unitOfWork.withTransaction(async () => {
      this.repoFacade.eventCategory.create(category);
    });
  }
}
