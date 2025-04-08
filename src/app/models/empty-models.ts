
import User from "src/app/auth/user.model";
import { Bill, BillProduct, deletetBillProduct, Table } from "src/app/models/table.model";
import { Category, Product, SubProduct } from "./category.model";
import { Dep, Gestiune, ImpSheet, InvIngredient, messageEFactura, Nir, NirIngredient } from './nir.model';
import { Shedule, Pontaj } from './shedule.model';
import { environment } from '../../environments/environment';
import { cigarsInv, Inventary, line, productionReport } from "./inventary.model";
import { reportUsers } from "./report.model";
import { Suplier } from "./suplier.model";
import { SalePoint } from "./sale-point";

export function emptyUser(){
  const user: User = {
    _id: '',
    name:'',
    token:'',
    cashBack: -1,
    admin: 0,
    email:'',
    tokenExpirationDate: '',
    status: '',
    telephone: '',
    locatie: '',
    cardIndex: 0,
    cardName: '',
    survey: '',
    orders: [],
    discount: {
      general: 0,
      category: []
    },
    employee: {
      active: false,
      fullName: '',
      cnp: 0,
      ciSerial: '',
      ciNumber: 0,
      address: '',
      position: '',
      zodie: '',
      varsta: '',
      user: '',
      access: 0,
      salary: {
        inHeand: 0,
        onPaper: {
          salary: 0,
          tax: 0
        },
        fix: false,
        norm: 176,
      },
      workLog: [],
      payments: []
    },

  };
    return user
}


export function emptyProductionReport(){
  const emptyRep: productionReport= {
      intrari: emptyLine(),
      iesiri: emptyLine(),
      dif: {
        marfaBuc: 0,
        prodBuc: 0,
        marfaBar: 0,
        prodBar: 0,
      },
      totals: {
        firstInv: 0,
        intrari: 0,
        iesiri: 0,
        secondInv: 0,
        dif: 0,
      }
  }
  return emptyRep
}


function emptyLine(){
  const line: line = {
    buc: {
      marfa: 0,
      prod: 0
    },
    bar: {
      marfa: 0,
      prod: 0
    },
    inv: {
      marfaBuc: 0,
      marfaBar: 0,
      prodBar: 0,
      prodBuc: 0
    }
  }
  return line
}


export function  emptyBillProduct(){
  const billProduct: BillProduct = {
    _id: '',
    name: '',
    price: 0,
    quantity: 0,
    total: 0,
    imgPath: '',
    category: '',
    mainCat: '',
    sub: false,
    toppings: [],
    payToGo: false,
    newEntry: true,
    ings: [],
    printer: 'main',
    section: '',
    sentToPrint: true,
    imgUrl: '',
    comment: '',
    tva: '',
    discount: 0,
    dep: '',
    toppingsToSend: [],
    sentToPrintOnline: true,
    qty: '',
    cantitate: '',
    sgrTax: false,
    description: '',
    printOut: false,
    subProductId: '',
    productId: ''
  }
  return billProduct
 }

 export function  emptyDeletetBillProduct(){
  const deletetBillProduct: deletetBillProduct = {
    billProduct: emptyBillProduct(),
    reason: '',
    admin: '',
    employee: {fullName: '', position: '', user: ''},
    locatie: '',
    inv: '',
  }
  return deletetBillProduct
 }


 export function emptyTable(){
  const emptyTable: Table = {_id: '', bills: [], index: 0, name: ''}
  return emptyTable
}


export function emptyInv(){
  const inv: Inventary = {
     date: '',
     ingredients: [],
     locatie: '',
     _id: '',
     updated: false,
  }
  return inv
}


export function emptyBill(){
   const emptyBill: Bill = {
    _id: 'new',
    soketId: '',
    production: true,
    index: 0,
    masaRest: emptyTable(),
    masa: 0,
    productCount: 0,
    tips: 0,
    totalProducts: 0,
    total: 0,
    discount: 0,
    voucher: 0,
    status: 'open',
    toGo: false,
    pickUp: false,
    inOrOut: 'INTERIOR',
    completetime: 0,
    paymentMethod: '',
    onlineOrder: false,
    pending: true,
    out: false,
    salePoint: environment.POINT,
    payment: {
      card: 0,
      cash: 0,
      viva: 0,
      voucher: 0,
      online: 0,
    },
    clientInfo: {
      name: '',
      telephone: '',
      userId: '',
      cashBack: 0,
      email: '',
      discount: {
        general: 0,
        category: [],
      }
    },
    employee: {
      access: 0,
      fullName: '',
      position: '',
      user: '',
    },
    cashBack: 0,
    payOnSite: false,
    payOnline: false,
    cif: '',
    show: false,
    setName: false,
    name: 'COMANDA',
    products: [],
    createdAt: '',
    updatedAt: '',
    locatie: '',
    prepStatus: 'open'
  }
  return emptyBill
}


export function emptyProduct(){
  const emptyProduct: Product = {
    _id: '',
    name: '',
    qty: '',
    price: 0,
    tva: '',
    dep: '',
    order: 0,
    description: '',
    quantity: 0,
    image: [],
    subProducts: [],
    category: emptyCategory(),
    available: false,
    total: 0,
    sgrTax: false,
    longDescription: '',
    ingredients: [],
    mainCat: '',
    printOut: false,
    recipe: '',
    nutrition: {
      energy:{kJ: 0, kcal: 0},
      fat: {all: 0, satAcids: 0},
      carbs: {all: 0, sugar: 0},
      salts: 0,
      protein: 0,
    },
    saleLog: [],
    additives: [],
    allergens: [],
    paring: [],
    toppings: [],
    ings: [],
    printer: 'main',
    showSub: false,
    discount: 0,
    section: '',
  }
  return emptyProduct
}

export function emptySubProduct(){
  const sub: SubProduct = {
       name: '',
       price: 0,
       order: 0,
       quantity: 0,
       qty: '',
       product: '',
       available: true,
       recipe: '',
       description: '',
       tva: 19,
       locatie: environment.LOC,
       toppings: [],
       printOut: false,
       ings:[],
       saleLog: [],
       nutrition: {
        energy:{kJ: 0, kcal: 0},
        fat: {all: 0, satAcids: 0},
        carbs: {all: 0, sugar: 0},
        salts: 0,
        protein: 0,
      },
      additives: [],
      allergens: [],
  }
  return sub
}

export function emptyCategory(){
  const emptyCategory: Category = {
    mainCat: '',
    name: '',
    product: [],
    locatie: environment.LOC,
    image: {path: '', filename:''},
    order: 0
  }
  return emptyCategory
}

export function emptyeFacturaMessage(){
  const message: messageEFactura = {
         mesaje: []
  }
  return message
}



export function emptyNirIng(){
  const emptyNirIng: NirIngredient = {
   name: '',
   price: 0,
   um: '',
   qty: 0,
   value: 0,
   tva: 0,
   dep: '',
   gestiune: '',
   tvaValue: 0,
   sellPrice: 0,
   total: 0,
   logId: '',
   ing: '',
  }
  return emptyNirIng
}

export function emptyNir(){
  const nir: Nir ={
    _id: '',
    index: 0,
    payd: false,
    suplier: emptySuplier(),
    nrDoc: '',
    documentDate: '',
    receptionDate: '',
    ingredients: [],
    document: '',
    selected: false,
    eFacturaId: '',
    totalDoc: 0,
    val: 0,
    valTva: 0,
    valVanzare: 0,
    discount: [],
  }
  return nir
}

export function emptySuplier(){
  const sup: Suplier = {
     _id: '',
     bussinessName: '',
     name: '',
     vatNumber: '',
     register: '',
     account: '',
     bank: '',
     VAT: true,
     address: '',
     sold: 0,
     records: []
  }
  return sup
}


export function  emptyShedule(){
  const emptyShedule: Shedule = {
    _id: '',
    locatie: environment.LOC,
    period: '',
    days: []
  }
  return emptyShedule
}


export function emptyPontaj(){
  const emptyPont: Pontaj = {
    _id: '',
    locatie: '',
    month: '',
    workValue: '',
    days: []
  }
  return emptyPont
}


export function emptyReportUsers(){
  const users: reportUsers = {
    totalBonus: 0,
    totalIncome: 0,
    totalTax: 0,
    totalUsers: 0,
    section: []
  }
  return users
}

export function emptyIng(){
  const emptyIng: InvIngredient = {
   _id: '',
   name: '',
   price: 0,
   um: '',
   qty: 0,
   tvaPrice: 0,
   eFactura: [],
   sellPrice: 0,
   tva: 0,
   dep: '',
   dept: emptyDep(),
   gest: emptyGest(),
   gestiune: '',
   locatie: environment.LOC,
   ings: [],
   salePoint: environment.POINT,
   productIngredient: false,
   inventary: [],
   uploadLog: [],
   unloadLog: []
  }
  return emptyIng
}


export function emptySalePoint(){
  const point: SalePoint = {
    name: '',
    address: '',
    locatie: environment.LOC
  }
  return point
}


export function emptyGest(){
  const gest: Gestiune = {
    name: '',
    locatie: environment.LOC,
    salePoint: '',
  }
  return  gest
}
export function emptyDep(){
  const dep: Dep = {
    name: '',
    locatie: environment.LOC,
    salePoint: '',
  }
  return dep
}

export function emptySheet(){
  const sheet: ImpSheet = {
    date: new Date().toISOString(),
    ings: [],
    user: undefined,
    locatie: environment.LOC,
    salePoint: environment.POINT,
  }
  return sheet
}

export function emptyCigaretsInv(){
  const sheet: cigarsInv = {
    date: new Date(),
    products: [],
    valid: false,
    user: '',
    locatie: environment.LOC,
    salePoint: environment.POINT
  }
  return sheet
}





