declare namespace Express {
  export interface Request {
    user?: any; // ideal trocar pelo tipo do payload do JWT
    validated?: any;
  }
}
