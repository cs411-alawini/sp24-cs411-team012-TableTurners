declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT?: string;
      SQL_HOST?: string;
      SQL_USER?: string;
      SQL_PWD?: string;
    }
  }
}
export {};
