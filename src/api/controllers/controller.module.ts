import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { CqrsModule } from "@nestjs/cqrs";

const controllers = [
  AuthController
];

@Module({
  imports: [CqrsModule],
  controllers: controllers,
  exports: [],
})
export class ControllerModule { }
