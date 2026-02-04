import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";

const controllers = [
  AuthController
];

@Module({
  imports: [],
  controllers: controllers,
  exports: [],
})
export class ControllerModule { }
