

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
    public index: number,
    public masaRest: any,
    public production: boolean,
    public masa: number,
    public productCount: number,
    public tips: number,
    public totalProducts: number,
    public total: number,
    public discount: number,
    public status: string,
    public toGo: boolean,
    public pickUp: boolean,
    public completetime: number,
    public paymentMethod: string,
    public onlineOrder: boolean,
    public prepStatus: string,
    public payment: {
        cash: number,
        card: number,
        viva: number,
        voucher: number,
        online: number,
    },
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
    public locatie: string,
    public pending: boolean
  ){}
}


export class BillProduct{
  constructor(
   public _id: string,
   public name: string,
   public price: number,
   public quantity: number,
   public total: number,
   public imgPath: string,
   public category: string,
   public mainCat: string,
   public newEntry: boolean,
   public discount: number,
   public sub: boolean,
   public toppings: Topping[],
   public ings: Ing[],
   public payToGo: boolean,
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
    public ing: string,
  ){}
}

export class deletetBillProduct{
  constructor(
   public billProduct: BillProduct,
   public employee: {
    fullName: string,
    position: string,
    user: string,
   },
   public reason: string,
   public locatie: string,
   public inv: string,
  ){}
}

