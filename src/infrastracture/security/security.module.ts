import { Module } from "@nestjs/common";
import { PASSWORD_HASHER, USER_ACCESSOR } from "src/common/tokens";
import { Argon2PasswordHasher } from "./password-hasher";
import { UserAccessor } from "./user-accessor";

const passwordProvider = {
  provide: PASSWORD_HASHER,
  useClass: Argon2PasswordHasher,
}

const userAccessorProvider = {
  provide: USER_ACCESSOR,
  useClass: UserAccessor
}

@Module({
  imports: [],
  providers: [passwordProvider, userAccessorProvider],
  exports: [PASSWORD_HASHER, USER_ACCESSOR],
})
export class SecurityModule { }
