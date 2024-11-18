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
    public sellPrice: number,
    public logId: string,
    public ing: string,
  ){}
}

export class Nir{
  constructor(
    public _id: string,
    public payd: boolean,
    public suplier: Suplier,
    public nrDoc: string,
    public documentDate: string,
    public receptionDate: string,
    public ingredients: NirIngredient[],
    public document: string,
    public totalDoc: number,
    public val: number,
    public valTva: number,
    public selected: boolean,
    public efacturaId: string,
    public valVanzare: number,
    public discount: {tva: number, value: number, procent: number}[],
    public index?: number,
  ){}
}


export class InvIngredient {
  constructor(
    public _id: string,
    public name: string,
    public price: number,
    public um: string,
    public qty: number,
    public tvaPrice: number,
    public tva: number,
    public dep: string,
    public gestiune: string,
    public locatie: string,
    public ings: InvIngredient[],
    public productIngredient: boolean,
    public inventary: {
      index: number,
      day: string,
      qty: number
    } [],
    public uploadLog: {
      date: string,
      qty: number,
      uploadPrice: number,
      operation: {
        name: string,
        details: string,
      }
    }[],
    public unloadLog: {
      date: string,
      qty: number,
      operation: {
        name: string,
        details: string,
      }
    }[]
  ){}
}


export class EFactura {
  constructor(
    public invoiceNumber: string,
    public dueDate: string,
    public issueDate: string,
    public supplier: {
      name: string,
      vatNumber: string
    },
    public customer: {
      name: string,
      vatNumber: string
    },
    public products: {
      name: string,
      quantity: number,
      price: number,
      totalNoVat: number,
      vatPrecent: number
    }[],
    public vatAmount: number,
    public taxExcusiveAmount: number,
    public taxInclusiveAmount: number,
    public prepaydAmount: number,
    public payableAmount: number,
    public id: string
  ){}
}

export class messageEFactura{
  constructor(
    public mesaje: {
      data_creare: string,
      cif: string,
      detalii: string,
      id: string
    }[]
  ){}
}


