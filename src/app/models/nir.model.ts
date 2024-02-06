import { Suplier } from "./suplier.model";

export class NirIngredient {
  constructor(
    public name:string,
    public price: number,
    public um: string,
    public qty: number,
    public value: number,
    public tva: number,
    public tvaValue: number,
    public total: number,
    public dep: number,
    public gestiune: string,
    public sellPrice: number
  ){}
}

export class Nir{
  constructor(
    public suplier: string,
    public nrDoc: number,
    public documentDate: string,
    public ingredients: NirIngredient[],
    public totalDoc: number,
    public payd: boolean,
    public discount: {tva: number, value: number, procent: number}[]
  ){}
}

export class InvIngredient {
  constructor(
    public name: string,
    public price: number,
    public um: string,
    public qty: number,
    public tvaPrice: number,
    public tva: number,
    public dep: string,
    public gestiune: string,
    public locatie: string,
  ){}
}


