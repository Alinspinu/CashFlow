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
    public tokenExpirationDate: string,
  ){}
  };

