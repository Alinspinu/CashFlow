import { InvIngredient } from "./nir.model";



export class Inventary {
  constructor(
    public date: string,
    public ingredients: ing[],
    public locatie: string,
    public _id: string,
    public updated: boolean,

  ){}
}

export class ing {
  constructor(
    public ing: InvIngredient,
    public  name: string,
    public  faptic: number,
    public  scriptic: number,
    public gestiune: string,
    public dep: string

  ){}
}


export class CompareInv {
  constructor(
    public dateFirst: string,
    public dateSecond: string,
    public ingredients: CompareIng[],
  ){}
}

 class CompareIng{
  constructor(
    public  name: string,
    public  um: string,
    public  first: number,
    public  second: number,
    public  scripticUnload: number,
    public  saleUnload: number,
    public gestiune: string,
    public dep: string,
    public  upload: {
      value: 0,
      entries: log[]
    }

  ){}
}

class log{
  constructor(
    public  date: string,
    public  qty: number,
    public  operation: {
      name: string,
      details: string,
      }
  ){}
}


export interface line {
  buc: {
    marfa: number,
    prod: number
  },
  bar: {
    marfa: number,
    prod: number,
  }
  inv: {
    marfaBuc: number,
    prodBuc: number,
    marfaBar: number,
    prodBar: number,
  }
}



export class productionReport{
  constructor(
    public intrari: line,
    public iesiri: line,
    public dif: {
      marfaBuc: number,
      prodBuc: number,
      marfaBar: number,
      prodBar: number,
    },
    public totals: {
      firstInv: number,
      intrari: number,
      iesiri: number,
      secondInv: number,
      dif: number,
    }
  ){}
}
