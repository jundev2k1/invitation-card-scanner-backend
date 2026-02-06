import { RefreshToken } from "src/domain/entities";

export const mapToRefreshTokenEntity = (refreshToken: any): RefreshToken => {
  return new RefreshToken(
    refreshToken.id,
    refreshToken.user_id,
    refreshToken.token_hash,
    refreshToken.jwt_id,
    refreshToken.is_revoked,
    new Date(refreshToken.expires_at),
    refreshToken.replaced_by_token_id,
    refreshToken.ip_address,
    refreshToken.user_agent,
    refreshToken.device_name,
    new Date(refreshToken.created_at)
  );
};

export const mapToSearchResult = (items: any[]) => {

}