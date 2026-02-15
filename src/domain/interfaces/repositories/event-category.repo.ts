import { EventCategory } from "src/domain/entities";

export interface IEventCategoryRepo {
  getById(id: string): Promise<EventCategory | null>;

  create(entity: EventCategory): Promise<void>;

  update(entity: EventCategory): Promise<void>;
}
