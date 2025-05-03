export  class Day {
  constructor(
    public _id: string,
    public cashIn: number,
    public cashOut: number,
    public date: string,
    public cashBack: number,
    public locatie: string,
    public entry: Entry[],
    public salePoint: string,

  ){}
  };

  export class Entry{
    constructor(
      public _id: string,
      public amount: number,
      public date: string,
      public description: string,
      public tip: string,
      public index: number,
      public salePoint: string,
    ){}
  }


  export function emptyDay(){
    const day: Day = {
      _id: '',
      cashIn: 0,
      cashOut: 0,
      date: '',
      cashBack: 0,
      locatie: '',
      entry: [],
      salePoint: '',
    }
    return day
  }