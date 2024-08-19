export class GeneratedUser {
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

export class SeededAdmin extends GeneratedUser {
  constructor(index:number) {
    super(`admin${index}`,`admin${index}@admin.com`,"admin123","admin",`Administrator${index}`,`admin${index}`);
  }
}

export class SeededRegular extends GeneratedUser {
  constructor(index:number) {
    super(`dummy${index}`,`dummy${index}@dummy.com`,"dummy123","regular",`Dummy${index}`,`dummy${index}`);
  }
}
//Design pattern: Factory method untuk seeding daftar user init
export class SeededUserFactory{
  public static createSeededUser(index: number, userType:string):GeneratedUser {
    if(userType === "admin"){
      return new SeededAdmin(index);
    } else if(userType === "regular"){
      return new SeededRegular(index);
    } else {
      throw new Error("Invalid user type");
    }
  }
}
