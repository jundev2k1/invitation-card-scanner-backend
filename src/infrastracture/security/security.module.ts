import { Module } from "@nestjs/common";
import { PASSWORD_HASHER } from "src/common/tokens";
import { Argon2PasswordHasher } from "./password-hasher";

const passwordProvider = {
  provide: PASSWORD_HASHER,
  useClass: Argon2PasswordHasher,
}

@Module({
  imports: [],
  providers: [passwordProvider],
  exports: [PASSWORD_HASHER],
})
export class SecurityModule { }
