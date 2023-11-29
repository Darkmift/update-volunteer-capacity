import { cleanEnv, str } from 'envalid';
import logger from '../utils/logger-winston';

export const { GLASSIX_BASIC_AUTH_KEY, GLASSIX_BASIC_AUTH_SECRET, GLASSIX_USERNAME } = process.env;

const env = cleanEnv(
    process.env,
    {
        MONDAY_API_KEY: str(),
    },
    {
        reporter: ({ errors }) => {
            logger.info(`There are errors in the environment variables:`, { errors });
        },
    },
);

export default env;
