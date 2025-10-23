import type { RequestLoginPayload } from "../../requestSerialize/auth";

class UserLogin {
  private userName;

  private password;

  constructor({ userName, password }: RequestLoginPayload) {
    this.userName = userName;
    this.password = password;
  }

  serialize() {
    return {
      user_name: this.userName,
      password: this.password,
    };
  }
}

export default UserLogin;
