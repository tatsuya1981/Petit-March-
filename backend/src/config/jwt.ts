const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error('JWT_SECRET is not defined. Please set it in the environment variables.');
}

export const JWT_SECRET: string = jwtSecret;
