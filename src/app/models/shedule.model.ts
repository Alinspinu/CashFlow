import User from '../auth/user.model';


export class Shedule{
  constructor(
    public _id: string,
    public locatie: string,
    public period: string,
    public days: Day[] ,
  ){};

}

export class Day{
  constructor(
    public date: Date,
    public day: string,
    public users: {
        workPeriod: {
          start: Date,
          end: Date,
          hours: number,
          concediu: boolean,
          medical: boolean 
        },
        employee: User
    }[] ,
  ){};

}

export class Pontaj{
  constructor(
    public _id: string,
    public locatie: string,
    public month: string,
    public workValue: string,
    public days: PDay[] ,
  ){};

}

export class PDay{
  constructor(
    public date: Date,
    public number: number,
    public workValue: number,
    public users: {
        value: number,
        hours: number,
        employee: User,
        position: string,
        medical: boolean,
        concediu: boolean
    }[]
  ){};

}


