
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
    public supliesProdBuc: number,
    public supliesMfBuc: number,
    public supliesProdBar: number,
    public supliesMfBar: number,
    public diverse: {
      total: number,
      entry: {
        value: number,
        reason: string,
        index: number,
        date: string
      }[]
    },
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
        users: reportUser[]
        },
    public departaments: {
        total: number,
        procent: number,
        name: string,
        dep: {
          name: string,
          total: number,
          procent: number
        }[],
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


export interface reportUser{
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
    bonus: number,
}

export class reportUsers{
  constructor(
    public totalIncome: number,
    public totalTax: number,
    public totalBonus: number,
    public totalUsers: number,
    public section: {
      name: string,
      totalIncome: number,
      totalTax: number,
      totalBonus: number,
      users: reportUser[]
    }[]
  ){}
}