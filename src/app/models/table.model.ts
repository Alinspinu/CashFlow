

export class Table{
  constructor(
    public name: string,
    public _id: string,
    public index: number,
    public bills: Bill[]
  ){}
}

export class Bill{
  constructor(
    public _id: string,
    public soketId: string,
    public index: number,
    public masaRest: any,
    public production: boolean,
    public masa: number,
    public productCount: number,
    public tips: number,
    public totalProducts: number,
    public total: number,
    public discount: number,
    public voucher: number,
    public status: string,
    public toGo: boolean,
    public pickUp: boolean,
    public completetime: number,
    public paymentMethod: string,
    public onlineOrder: boolean,
    public inOrOut: string,
    public prepStatus: string,
    public out: boolean,
    public payment: OrderPayments,
    public employee: {
      access: number,
      fullName: string,
      position: string,
      user: string,
    },
    public cashBack: number,
    public payOnSite: boolean,
    public payOnline: boolean,
    public clientInfo: {
      name: string,
      telephone: string,
      userId: string,
      cashBack: number,
      email: string,
      discount: {
        general: number,
        category: {
          precent: number,
          cat: string,
          name: string,
          _id: string,
        }[]
      }
    },
    public cif: string,
    public show: boolean,
    public setName: boolean,
    public name: string,
    public products: BillProduct[],
    public createdAt: any,
    public updatedAt: string,
    public locatie: string,
    public pending: boolean
  ){}
}

export interface OrderPayments{
  cash: number,
  card: number,
  viva: number,
  voucher: number,
  online: number,
}


export class BillProduct{
  constructor(
   public _id: string,
   public name: string,
   public price: number,
   public quantity: number,
   public total: number,
   public imgPath: string,
   public category: string | undefined,
   public mainCat: string,
   public newEntry: boolean,
   public discount: number,
   public sub: boolean,
   public toppings: Topping[],
   public ings: Ing[],
   public payToGo: boolean,
   public section: string,
   public imgUrl: string,
   public printer: string,
   public sentToPrint: boolean,
   public comment: string,
   public tva: string,
   public dep: string,
   public toppingsToSend: Topping[],
   public sentToPrintOnline: boolean,
   public qty: string,
   public cantitate: string,
   public sgrTax: boolean,
   public description: string,
   public printOut: boolean,
   public subProductId: string,
   public productId: string,
  ){}
}


export class Topping {
  constructor(
    public name: string,
    public price: number,
    public qty: number,
    public ingPrice: number,
    public um: string,
    public ing: string
  ){}
}

export class Ing{
  constructor(
    public qty: number,
    public ing: {_id: string, name: string, qty: number},
  ){}
}

export class deletetBillProduct{
  constructor(
   public billProduct: BillProduct,
   public employee: {
    fullName: string,
    position: string,
    user: string,
    name?: string
   },
   public reason: string,
   public admin: string,
   public locatie: string,
   public inv: string,
   public _id?: string,
   public createdAt?: string
  ){}
}

