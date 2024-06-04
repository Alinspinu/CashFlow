
import User from "src/app/auth/user.model";
import { Bill, BillProduct, deletetBillProduct, Table } from "src/app/models/table.model";
import { Category, Product } from "./category.model";
import { InvIngredient } from "./nir.model";
import { Shedule, Pontaj } from './shedule.model';
import { environment } from '../../environments/environment';

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
    employee: {
      fullName: '',
      position: '',
      user: '',
      access: 0,
      salary: {
        inHeand: 0,
        onPaper: {
          salary: 0,
          tax: 0
        }
      }
    },
    workLog: []
  };
    return user
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


export function emptyBill(){
   const emptyBill: Bill = {
    _id: '',
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
    inOrOut: '',
    completetime: 0,
    paymentMethod: '',
    onlineOrder: false,
    pending: true,
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
    image: {path: '', filename: ''},
    subProducts: [],
    category: {_id: '', mainCat: '', name: '', product: [], image: {path: '', filename:''}, order: 0},
    available: false,
    total: 0,
    sgrTax: false,
    longDescription: '',
    ingredients: [],
    mainCat: '',
    nutrition: {
      energy:{kJ: 0, kcal: 0},
      fat: {all: 0, satAcids: 0},
      carbs: {all: 0, sugar: 0},
      salts: 0,
      protein: 0,
    },
    additives: [],
    allergens: [],
    paring: [],
    toppings: [],
    ings: [],
    printer: 'main',
    showSub: false,
    discount: 0,
  }
  return emptyProduct
}

export function emptyCategory(){
  const emptyCategory: Category = {
    _id: '',
    mainCat: '',
    name: '',
    product: [],
    image: {path: '', filename:''}, order: 0
  }
  return emptyCategory
}


export function emptyIng(){
  const emptyIng: InvIngredient = {
   _id: '',
   name: '',
   price: 0,
   um: '',
   qty: 0,
   tvaPrice: 0,
   tva: 0,
   dep: '',
   gestiune: '',
   locatie: '',
   ings: [],
   inventary: [],
   uploadLog: [],
   unloadLog: []
  }
  return emptyIng
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



