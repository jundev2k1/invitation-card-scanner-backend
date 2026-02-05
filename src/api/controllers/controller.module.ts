import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { AuthController } from "./auth.controller";

const controllers = [
  AuthController,
];

@Module({
  imports: [CqrsModule],
  controllers: controllers,
  exports: [],
})
export class ControllerModule { }
