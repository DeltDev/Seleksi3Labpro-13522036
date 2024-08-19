export class GenerateUser {
  private username: string;
  private email: string;
  private password: string;
  private role: string;
  private firstName: string;
  private lastName: string;
  public constructor(username: string, email: string, password: string, role: string, firstName: string, lastName: string) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.role = role;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}

export class GeneratedAdmin extends GenerateUser {
  constructor(index:number) {
    super(`admin${index}`,`admin${index}@admin.com`,"admin123","admin",`Administrator${index}`,`admin${index}`);
  }
}

export class GeneratedRegular extends GenerateUser {
  constructor(index:number) {
    super(`dummy${index}`,`dummy${index}@dummy.com`,"dummy123","regular",`Dummy${index}`,`dummy${index}`);
  }
}
//Design pattern: Factory method untuk seeding daftar user init
export class UserFactory{
  public static createUser(index: number, userType:string):GenerateUser {
    if(userType === "admin"){
      return new GeneratedAdmin(index);
    } else if(userType === "regular"){
      return new GeneratedRegular(index);
    } else {
      throw new Error("Invalid user type");
    }
  }
}