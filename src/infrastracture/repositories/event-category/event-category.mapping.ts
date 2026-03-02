import { EventCategorySummaryDto } from "@/src/application/features/event-categories/dtos/event-category-summary.dto";
import { EventCategory } from "src/domain/entities";
import { EventCategoryStatus } from "src/domain/enums";
import { CategoryId } from "src/domain/value-objects";

export const mapToEventCategoryEntity = (data: any): EventCategory | null => {
  if (!data) return null;

  return new EventCategory(
    CategoryId.of(data.id),
    CategoryId.of(data.parent_id),
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

export const mapToEventCategorySummary = (data: any): EventCategorySummaryDto => {
  return new EventCategorySummaryDto(
    data.parent_id,
    data.id,
    data.name,
    data.slug,
    data.image_url
  );
}

export const mapToEventCategorySummaries = (data: readonly any[]): EventCategorySummaryDto[] => {
  return data.map(mapToEventCategorySummary);
}
