import { EventCategory } from "src/domain/entities";

export interface IEventCategoryRepo {
  search(parentId: string, cateId: string, keyword: string): Promise<EventCategory[]>;

  getAllActive(): Promise<EventCategory[]>;

  getById(id: string): Promise<EventCategory | null>;

  isExistParent(id: string): Promise<boolean>;

  isExistId(id: string): Promise<boolean>;

  isExistSlug(slug: string): Promise<boolean>;

  create(entity: EventCategory): Promise<void>;

  update(entity: EventCategory): Promise<void>;

  delete(id: string): Promise<void>;
}
