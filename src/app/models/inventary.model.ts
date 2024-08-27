import { InvIngredient } from "./nir.model";



export class Inventary {
  constructor(
    public date: string,
    public ingredients: ing[],
    public locatie: string,

  ){}
}

export class ing {
  constructor(
    public ing: InvIngredient,
    public  name: string,
    public  faptic: number,
    public  scriptic: number

  ){}
}
