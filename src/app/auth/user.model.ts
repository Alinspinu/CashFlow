export default class User {
  constructor(
    public _id: string,
    public name: string,
    public telephone: string,
    public token: string,
    public cashBack: number,
    public admin: number,
    public status: string,
    public email: string,
    public locatie: string,
    public tokenExpirationDate: string,
    public employee: {
      fullName: string,
      position: string,
      user: string,
      access: number,
      salary: {
        inHeand: number,
        onPaper: {
          salary: number,
          tax: number
        }
      }
    },
    public workLog: {
      day: Date,
      checkIn: Date,
      checkOut: Date,
      hours: number,
      earnd: number,
      position: string,
    }[]
  ){}
  };

