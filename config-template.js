const DB_HOST = '';
const DB_PORT = '27017';
const DB_NAME = '';
const DB_USER = '';
const DB_PASS = '';
// config redis
const REDIS_HOST = 'localhost';
const REDIS_PORT = 6379;
const REDIS_PASS = '';
const redisConfig = {
  host: REDIS_HOST,
  port: REDIS_PORT,
  auth: REDIS_PASS
};


export default {
  mongoURL: process.env.MONGO_URL || `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`,
}
