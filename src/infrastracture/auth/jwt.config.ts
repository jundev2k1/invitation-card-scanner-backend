export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'default_secret_key',
  signOptions: {
    expiresIn: process.env.JWT_EXPIRES_IN || '3600s',
  },
}