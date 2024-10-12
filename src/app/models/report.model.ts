
export class Report {
  constructor(
    public period: string,
    public cashIn: number,
    public cashInNoVat: number,
    public vatValue: number,
    public ingsValue: number,
    public rentValue: number,
    public supliesValue: number,
    public serviceValue: number,
    public marketingValue: number,
    public inventarySpendings: number,
    public gasValue: number,
    public constructionsValue: number,
    public rent: number,
    public utilities: number,
    public impairment: {
        total: number,
        products: {
                name: string,
                cost: number,
                qty: number,
            }[]
        },
    public workValue: {
        total: number,
        tax: number,
        users:{
                name: string,
                hours: number,
                position: string,
                monthHours: number,
                baseIncome: number,
                baseTax: number,
                hourIncome: number,
                totalIncome: number,
                taxValue: number,
                user: string,
        }[]
        },
    public departaments: {
        total: number,
        procent: number,
        name: string,
        products: {
                name: string,
                qty: number,
                dep: string,
                price: number,
            }[]
        }[],
    public paymentMethods: {
        name: string,
        value: number,
        procent: number,
        bills: {
                index: number,
                masa: number,
                tips: number,
                total: number,
                discount: number,
                voucher: number,
                cashBack: number,
                paymentMethod: String,
                clientInfo: {
                  name: string,
                },
                employee:{
                  fullName: string,
                },
                products: {
                  name: string,
                  discount: number,
                  quantity: number,
                  price: number,
                  total: number,
                  imgUrl: string
              }[]
        }
        }[],
    public hours: {
        hour: number,
        procent: number,
        total: number
        }[],
    public users:{
        name: string,
        procent: number,
        total: number,
        user: string,
    }[]
  ){}
}
