import type { RequestRegisterPayload } from "../../requestSerialize/auth";

class UserRegister {
  private firstName;
  private lastName;
  private email;
  private phoneNumber;
  private password;
  private confirmPassword;

  constructor({
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    confirmPassword,
  }: RequestRegisterPayload) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.password = password;
    this.confirmPassword = confirmPassword;
  }

  serialize() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      password: this.password,
      confirmPassword: this.confirmPassword,
    };
  }
}

export default UserRegister;
