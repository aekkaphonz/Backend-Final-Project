import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId?: string; // เพิ่ม userId เข้าไปใน SessionData
  }
}
