import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { SecurityModule } from "src/infrastracture/security/security.module";
import { AuthController } from "./auth.controller";
import { EventCardBackofficeController } from "./events/event-card.backoffice.controller";
import { EventCategoryBackofficeController } from "./events/event-category.backoffice.controller";
import { EventBackofficeController } from "./events/event.backoffice.controller";
import { UserBackofficeController } from "./users/user.backoffice.controller";
import { UserClientController } from "./users/user.client.controller";

const controllers = [
  // Auth Controllers
  AuthController,

  // User Controllers
  UserClientController,
  UserBackofficeController,

  // EventCategory Controllers
  EventCategoryBackofficeController,

  // Event Controllers
  EventBackofficeController,

  // EventCard Controllers
  EventCardBackofficeController,
];

@Module({
  imports: [CqrsModule, SecurityModule],
  controllers: controllers,
  exports: [],
})
export class ControllerModule { }
