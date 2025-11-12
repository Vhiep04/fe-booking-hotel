import type { RequestLoginPayload } from "../../requestSerialize/auth";

class UserLogin {
  private email;
  private password;

  constructor({ email, password }: RequestLoginPayload) {
    this.email = email;
    this.password = password;
  }

  serialize() {
    return {
      email: this.email,
      password: this.password,
    };
  }
}

export default UserLogin;
