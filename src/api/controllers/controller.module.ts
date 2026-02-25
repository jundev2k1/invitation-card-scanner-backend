import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { SecurityModule } from "src/infrastracture/security/security.module";
import { AuthController } from "./auth.controller";
import { EventCardBackofficeController } from "./events/event-card.backoffice.controller";
import { EventCardClientController } from "./events/event-card.client.controller";
import { EventCategoryBackofficeController } from "./events/event-category.backoffice.controller";
import { EventBackofficeController } from "./events/event.backoffice.controller";
import { EventClientController } from "./events/event.client.controller";
import { ScanClientController } from "./scans/scan.client.controller";
import { UserBackofficeController } from "./users/user.backoffice.controller";
import { UserClientController } from "./users/user.client.controller";

const controllers = [
  // Auth Controllers
  AuthController,

  // Scan Controllers
  ScanClientController,

  // User Controllers
  UserClientController,
  UserBackofficeController,

  // EventCategory Controllers
  EventCategoryBackofficeController,

  // Event Controllers
  EventClientController,
  EventBackofficeController,

  // EventCard Controllers
  EventCardBackofficeController,
  EventCardClientController,
];

@Module({
  imports: [CqrsModule, SecurityModule],
  controllers: controllers,
  exports: [],
})
export class ControllerModule { }
