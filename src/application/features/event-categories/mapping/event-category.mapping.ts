import { EventCategory } from "@/src/domain/entities";
import { EventCategoryNode } from "../dtos";

export function mapCategoriesTree(
  categories: EventCategory[],
  rootParentId: string = 'ROOT'
): EventCategoryNode[] {
  const childrenMap = new Map<string, EventCategory[]>();

  for (const cate of categories) {
    if (!childrenMap.has(cate.parentId.value)) {
      childrenMap.set(cate.parentId.value, []);
    }
    childrenMap.get(cate.parentId.value)!.push(cate);
  }

  const buildTree = (parentId: string): EventCategoryNode[] => {
    const children = childrenMap.get(parentId) ?? [];

    return children.map((child) => {
      const cate = new EventCategoryNode(
        child.parentId.value,
        child.id.value,
        child.name,
        child.slug,
        child.description,
        child.imageUrl,
        child.status,
        child.sortOrder,
        child.level
      );
      cate.items = buildTree(child.id.value);
      return cate;
    });
  };

  return buildTree(rootParentId);
}
