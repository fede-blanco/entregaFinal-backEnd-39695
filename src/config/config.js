import dotenv from 'dotenv'

dotenv.config();

export default {
    PORT: process.env.PORT,
    MONGODB_CNX_STR_REMOTE: process.env.MONGODB_CNX_STR_REMOTE,
    MONGODB_CNX_STR_LOCAL: process.env.MONGODB_CNX_STR_LOCAL,
    githubAppId: process.env.GITHUB_APP_ID,
    githubClienteId: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    githubCallbackUrl: process.env.GITHUB_CALLBACK_URL,
    JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
    COOKIE_SECRET: process.env.COOKIE_SECRET,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    NODE_ENV: process.env.NODE_ENV || 'developement'
}