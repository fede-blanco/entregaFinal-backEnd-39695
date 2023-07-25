export class User {
  constructor({ email, password, first_name, last_name, age, role, last_connection }) {
      this.email = email
      this.password = password
      this.first_name= first_name
      this.last_name = last_name
      this.age = age
      this.role = role
      this.last_connection = last_connection
  }
}