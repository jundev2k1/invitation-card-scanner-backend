import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BadRequestException } from "src/application/common";
import { UUIdHelper } from "src/common";
import { ApiMessages } from "src/common/constants";
import { AUTH_SERVICE, REPO_FACADE, UNIT_OF_WORK } from "src/common/tokens";
import { AuthService } from "src/infrastracture/auth";
import { UnitOfWork } from "src/infrastracture/database/unit-of-work/unit-of-work";
import { RepositoryFacade } from "src/infrastracture/repositories";
import { RefreshTokenCommand, RefreshTokenResult } from "./refresh-token.command";

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler implements ICommandHandler<RefreshTokenCommand, RefreshTokenResult> {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: AuthService,
    @Inject(REPO_FACADE) private readonly repoFacade: RepositoryFacade,
    @Inject(UNIT_OF_WORK) private readonly unitOfWork: UnitOfWork
  ) { }

  async execute(request: RefreshTokenCommand): Promise<RefreshTokenResult> {
    const tokenInfo = await this.authService.validateToken(request.accessToken, request.refreshToken);
    if (!tokenInfo) throw BadRequestException.create(ApiMessages.TOKEN_INVALID);

    let newAccessToken = '';
    let newRefreshToken = '';
    let newTokenId = '';
    const { tokenId, userId, role } = tokenInfo;

    const newJwtId = UUIdHelper.createUUIDv7();
    [newTokenId, newRefreshToken] = await this.authService.generateRefreshToken(userId, newJwtId);

    newAccessToken = await this.authService.signAccessToken(userId, newJwtId, role);
    this.repoFacade.refreshToken.replace(tokenId, newTokenId);

    return new RefreshTokenResult(request.accessToken, request.refreshToken);
  }
}
