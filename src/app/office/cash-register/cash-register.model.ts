export  class Day {
  constructor(
    public _id: string,
    public cashIn: number,
    public cashOut: number,
    public date: string,
    public cashBack: number,
    public locatie: string,
    public entry: Entry[],

  ){}
  };

  export class Entry{
    constructor(
      public _id: string,
      public amount: number,
      public date: string,
      public description: string,
      public tip: string,
      public index: number
    ){}
  }
