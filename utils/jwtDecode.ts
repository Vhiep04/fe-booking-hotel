import type { CustomJwtPayload } from "./../interface/jwtPayload";

import { jwtDecode } from "jwt-decode";

export default (token: string) => {
  if (token) return jwtDecode<CustomJwtPayload>(token);
  return null;
};
