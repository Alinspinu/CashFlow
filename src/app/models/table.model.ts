

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
    public payment: {
        cash: number,
        card: number,
        viva: number,
        voucher: number,
    },
    public cashBack: number,
    public payOnSite: boolean,
    public payOnline: boolean,
    public clientInfo: {
      name: string,
      telephone: string,
      userId: string,
      cashBack: number,
    },
    public cif: string,
    public show: boolean,
    public setName: boolean,
    public name: string,
    public products: BillProduct[]
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
   public sub: boolean,
   public toppings: Topping[],
   public ings: Ing[],
   public payToGo: boolean,
   public imgUrl: string,
   public printer: string,
   public sentToPrint: boolean,
  ){}
}


export class Topping {
  constructor(
    public name: string,
    public price: number,
    public qty: number,
    public ingPrice: number,
    public um: string
  ){}
}

export class Ing{
  constructor(
    public name: String,
    public qty: Number,
    public price: number,
    public um: string
  ){}
}

export class deletetBillProduct{
  constructor(
   public billProduct: BillProduct,
   public employee: {
    name: string,
    position: string,
   },
   public reason: string,
   public locatie: string,
   public inv: string,
  ){}
}


export class ProductIngredient{
  constructor(
    public name: string,
    public um: string,
    public qty: number,
    public ings: Ing[],
    public price: Number,
    public locatie: string,
  ){}
}
