import { User } from "src/domain/entities";

export const mapToUserEntity = (data: any) => {
  return data != null
    ? new User(data.id, data.name, data.email, data.hash_password, data.created_at, data.updated_at)
    : null;
}
