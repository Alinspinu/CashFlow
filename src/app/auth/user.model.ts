import { Category } from "../models/category.model"
import { Bill } from "../models/table.model"


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
    public cardIndex: number,
    public cardName: string,
    public survey: string,
    public orders: Bill[],
    public discount: {
      general: number,
      category: {
        precent: number,
        name: string,
        cat: Category
      }[]
    },
    public employee: {
      active: boolean,
      fullName: string,
      cnp: number,
      ciSerial: string,
      ciNumber: number,
      address: string,
      position: string,
      user: string,
      access: number,
      zodie: string,
      varsta: string,
      salary: {
        inHeand: number,
        onPaper: {
          salary: number,
          tax: number
        },
        fix: boolean
      }
      payments: {
        date: string,
        amount: number,
        tip: string,
        workMonth: number
      }[],
      workLog: {
        day: Date,
        checkIn: Date,
        checkOut: Date,
        hours: number,
        earnd: number,
        position: string,
        concediu: boolean,
        medical: boolean,
      }[]
    },
  ){}
  };

