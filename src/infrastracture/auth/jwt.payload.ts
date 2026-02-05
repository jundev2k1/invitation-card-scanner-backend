export class JwtPayload {
  constructor(
    public readonly sub: string,
    public readonly jti: string,
    public readonly role: string
  ) { }
}
