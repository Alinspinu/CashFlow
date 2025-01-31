import { SalePoint } from "./sale-point";
import { Suplier } from "./suplier.model";



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
    public eFacturaId: string,
    public valVanzare: number,
    public discount: {tva: number, value: number, procent: number}[],
    public index?: number,
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
    public products: EProduct[],
    public vatAmount: number,
    public taxExclusiveAmount: number,
    public taxInclusiveAmount: number,
    public prePaydAmount: number,
    public payableAmount: number,
    public currencyId: string,
    public id: string
  ){}
}

export class messageEFactura{
  constructor(
    public mesaje: {
      data_creare: string,
      cif: string,
      detalii: string,
      id: string,
      done: boolean
    }[]
  ){}
}

export interface EProduct {
  name: string,
  quantity: number,
  price: number,
  unitCode: string,
  totalNoVat: number,
  vatPrecent: number,
  ingName: string,
  ingQty: number,
  ingUm: string,
  ingDep: string,
  ingGestiune: string,
  ingSellPrice: number,
  ingLogId: string,
  ingID: string,
}

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
    public dep: string,
    public gestiune: string,
    public sellPrice: number,
    public logId: string,
    public ing: string,
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
    public dept: Dep,
    public gest: Gestiune,
    public gestiune: string,
    public locatie: string,
    public ings: {qty: number, ing: InvIngredient}[],
    public productIngredient: boolean,
    public sellPrice: number,
    public salePoint:string,
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
    public eFactura: {
      suplier: string,
      name: string,
      qtyCorector: number
    }[],
    public unloadLog: {
      date: string,
      qty: number,
      operation: {
        name: string,
        details: string,
      }
    }[],
    public _id: string,
  ){}
}


export class ImpSheet{
  constructor(
    public date: Date,
    public ings: {qty: number, ing: any}[],
    public user: any,
    public locatie: string,
    public _id?: string,
  ){}
}



export class Gestiune{
  constructor(
    public locatie: string,
    public salePoint: string | undefined,
    public name: string,
    public _id?: string,
  ){}
}


export class Dep{
  constructor(
    public locatie: string,
    public salePoint: string | undefined,
    public name: string,
    public _id?: string,
  ){}
}

