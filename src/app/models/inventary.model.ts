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
