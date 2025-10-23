import type { CustomJwtPayload } from "../../../../interface/jwtPayload";
import { jwtDecode } from "jwt-decode";

class AuthToken {
  private token;

  constructor(token: string) {
    this.token = token;
  }

  deserialize() {
    const decodedData = <CustomJwtPayload>jwtDecode(this.token);
    return decodedData;
  }
}

export default AuthToken;
