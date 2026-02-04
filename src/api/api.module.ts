import { Module } from "@nestjs/common";
import { ControllerModule } from "./controllers/controller.module";

@Module({
  imports: [ControllerModule],
  providers: [],
  exports: [ControllerModule],
})
export class ApiModule { }
