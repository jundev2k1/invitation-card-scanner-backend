import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { APP_CONFIG } from 'src/common/tokens';
import { AppConfigService } from '../config/app-config.service';
import { JwtPayload } from './jwt.payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(@Inject(APP_CONFIG) private readonly config: AppConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwtSecret,
    });
  }

  async validate(payload: any): Promise<JwtPayload> {
    console.log(payload);
    return new JwtPayload(
      payload?.sub,
      payload?.jti,
      payload?.role,
      (payload?.iat) != null ? new Date(payload.iat * 1000) : null,
      (payload?.exp) != null ? new Date(payload.exp * 1000) : null
    );
  }
}
