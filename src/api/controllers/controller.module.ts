import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { SecurityModule } from "src/infrastracture/security/security.module";
import { AuthController } from "./auth.controller";
import { EventCategoryBackofficeController } from "./events/event-category.backoffice.controller";
import { UserBackofficeController } from "./users/user.backoffice.controller";
import { UserClientController } from "./users/user.client.controller";

const controllers = [
  // Auth Controllers
  AuthController,

  // User Controllers
  UserClientController,
  UserBackofficeController,

  // EventCategory Controllers
  EventCategoryBackofficeController
];

@Module({
  imports: [CqrsModule, SecurityModule],
  controllers: controllers,
  exports: [],
})
export class ControllerModule { }
