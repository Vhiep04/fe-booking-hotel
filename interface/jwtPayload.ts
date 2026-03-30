import type { JwtPayload } from "jwt-decode";
import type { ROLE_CLAIM } from "~/constants/auth";

export interface CustomJwtPayload extends JwtPayload {
  avatar: string;
  name: string;
  phone: string;
  [ROLE_CLAIM]: string | string[];
  iat: number;
  exp: number;
}
