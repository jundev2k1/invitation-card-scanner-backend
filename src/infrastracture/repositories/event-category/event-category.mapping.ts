import { EventCategory } from "src/domain/entities";
import { EventCategoryStatus } from "src/domain/enums";

export const mapToEventCategoryEntity = (data: any): EventCategory | null => {
  if (!data) return null;

  return new EventCategory(
    data.id,
    data.parent_id,
    data.name,
    data.slug,
    data.description,
    data.image_url,
    data.status as EventCategoryStatus,
    data.sort_order,
    data.level,
    new Date(data.created_at),
    new Date(data.updated_at)
  );
};
