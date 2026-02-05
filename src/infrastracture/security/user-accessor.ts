import { Global, Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import type { Request } from "express";
import { UnauthorizedException } from "src/application/common";
import { UUID } from "uuidv7";

@Global()
@Injectable({ scope: Scope.REQUEST })
export class UserAccessor {
  constructor(
    @Inject(REQUEST) private readonly request: Request
  ) { }

  get userId(): UUID {
    if (!this.request.user) UnauthorizedException.throw();
    return this.request.user!['sub'] as UUID || this.request.user!['id'] as UUID;
  }

  get role(): string {
    if (!this.request.user) UnauthorizedException.throw();
    return this.request.user?.['role'];
  }

  get ipAddress(): string {
    return (
      (this.request.headers['x-forwarded-for'] as string) ||
      this.request.socket.remoteAddress ||
      ''
    );
  }

  get userAgent(): string {
    return this.request.headers['user-agent'] as string || '';
  }
}
