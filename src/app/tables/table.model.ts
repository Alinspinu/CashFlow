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
    public cashBack: number,
    public payOnSite: boolean,
    public payOnline: boolean,
    public userName: string,
    public userTel: string,
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
   public toppings: string[],
   public payToGo: boolean,
  ){}

}
