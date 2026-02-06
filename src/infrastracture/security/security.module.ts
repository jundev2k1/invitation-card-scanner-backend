import { Module } from "@nestjs/common";
import { PASSWORD_HASHER, REFRESH_TOKEN_GENERATOR, USER_ACCESSOR } from "src/common/tokens";
import { Argon2PasswordHasher } from "./password/password-hasher";
import { RefreshTokenGenerator } from "./token";
import { UserAccessor } from "./user-accessor/user-accessor";

const passwordProvider = {
  provide: PASSWORD_HASHER,
  useClass: Argon2PasswordHasher,
}

const userAccessorProvider = {
  provide: USER_ACCESSOR,
  useClass: UserAccessor
}

export const refreshTokenGeneratorProvide = {
  provide: REFRESH_TOKEN_GENERATOR,
  useClass: RefreshTokenGenerator,
}

@Module({
  imports: [],
  providers: [passwordProvider, userAccessorProvider, refreshTokenGeneratorProvide],
  exports: [PASSWORD_HASHER, USER_ACCESSOR, REFRESH_TOKEN_GENERATOR],
})
export class SecurityModule { }
