// Declare types for expected environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT?: string;
      USE_HTTPS_COOKIES?: string;
      TRUST_PROXY_COUNT?: string;
      SQL_PORT?: string;
      SQL_HOST?: string;
      SQL_USER?: string;
      SQL_PWD?: string;
      REDIS_URL?: string;
      LOG_DIR?: string;
    }
  }
}
export {};
