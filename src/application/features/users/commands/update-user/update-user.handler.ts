import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { REPO_FACADE, UNIT_OF_WORK } from "src/common/tokens";
import { NotFoundException } from "src/domain/exceptions";
import { Email, PhoneNumber, Sex } from "src/domain/value-objects";
import { UnitOfWork } from "src/infrastracture/database";
import { RepositoryFacade } from "src/infrastracture/repositories";
import { UpdateUserCommand } from "./update-user.command";

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: UnitOfWork,
    @Inject(REPO_FACADE) private readonly repoFacade: RepositoryFacade
  ) { }

  async execute(request: UpdateUserCommand) {
    // Get user information from request
    const { id } = request;
    const { email, nickName, phoneNumber, sex, bio } = request.data;

    // Get old user
    const user = await this.repoFacade.user.getById(id);
    if (!user) throw NotFoundException.create('userId', id);

    // Check if email exists
    if (email !== user.email.value) {
      const isExistEmail = await this.repoFacade.user.isExistEmail(email);
      if (isExistEmail) throw NotFoundException.create('email', email);
    }

    await this.unitOfWork.withTransaction(async () => {
      // Handle update user
      user.updateUserInfo(
        nickName.trim(),
        Sex.of(sex),
        bio.trim());
      user.updatePhoneNumber(PhoneNumber.of(phoneNumber));
      user.updateEmail(Email.of(email));

      // Save user to database
      this.repoFacade.user.update(user);
    });
  }
}
