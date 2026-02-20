import { EventCategoryDto } from "./event-category.dto";

export class EventCategoryNode extends EventCategoryDto {
  public items: EventCategoryNode[] = [];
}
