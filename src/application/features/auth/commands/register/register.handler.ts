import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BadRequestException } from "src/application/common";
import { ApiMessages } from "src/common/constants";
import { AUTH_SERVICE, PASSWORD_HASHER, USER_REPO } from "src/common/tokens";
import { User } from "src/domain/entities";
import { Role } from "src/domain/value-objects";
import { AuthService } from "src/infrastracture/auth/auth.service";
import { UserRepo } from "src/infrastracture/repositories/user.repo";
import { PasswordHasher } from "src/infrastracture/security";
import { RegisterCommand } from "./register.command";

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: AuthService,
    @Inject(USER_REPO) private readonly userRepo: UserRepo,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher
  ) { }

  async execute(request: RegisterCommand): Promise<void> {
    console.log(request);
    // Check if email exists
    const isExistEmail = await this.userRepo.isExistEmail(request.email.value);
    if (isExistEmail) throw BadRequestException.create(ApiMessages.USER_EMAIL_ALREADY_EXISTS);

    // Check if username exists
    const isExistUsername = await this.userRepo.isExistUsername(request.username.value);
    if (isExistUsername) throw BadRequestException.create(ApiMessages.USER_USERNAME_ALREADY_EXISTS);

    // Hash password and create user entity
    const hashPassword = await this.passwordHasher.hash(request.password.value);
    const userEntity = this.createUser(request, hashPassword);

    // Create user from database
    await this.userRepo.create(userEntity);
  }

  private createUser(request: RegisterCommand, hashPassword: string): User {
    const userEntity = User.create({
      username: request.username,
      passwordHash: hashPassword,
      email: request.email,
      role: Role.staff(),
    });
    userEntity.updateUserInfo(request.nickName, request.sex, request.bio);
    userEntity.updatePhoneNumber(request.phoneNumber);

    return userEntity;
  }
}
