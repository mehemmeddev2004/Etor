import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || '', // Change this to a strong secret in production
  signOptions: {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d', // Token expires in 1 day by default
  },
}));
