export class JwtPayload {
  constructor(
    public readonly sub: string | null,
    public readonly jti: string | null,
    public readonly role: string | null,
    public readonly iat: Date | null,
    public readonly exp: Date | null
  ) { }
}
