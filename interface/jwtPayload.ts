import type { JwtPayload } from "jwt-decode";

export interface CustomJwtPayload extends JwtPayload {
  avatar: string;
  name: string;
  phone: string;
  iat: number;
  exp: number;
}
