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
    const forwarded = this.request?.headers?.['x-forwarded-for'];
    if (forwarded)
      return typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : forwarded[0];

    return this.request?.ip || this.request?.socket?.remoteAddress || '';
  }

  get userAgent(): string {
    return this.request?.headers?.['user-agent'] || '';
  }

  get device(): string {
    return this.request?.headers?.['device'] as string || 'unknown';
  }

  get metaData() {
    return {
      ip: this.ipAddress,
      userAgent: this.userAgent,
      device: this.device
    };
  }
}
