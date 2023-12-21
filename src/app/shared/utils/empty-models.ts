import User from "src/app/auth/user.model";
import { Bill, BillProduct, deletetBillProduct, Table } from "src/app/models/table.model";

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
    employee: {name: '', position: ''}
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
    sentToPrint: true,
    imgUrl: '',
  }
  return billProduct
 }

 export function  emptyDeletetBillProduct(){
  const deletetBillProduct: deletetBillProduct = {
    billProduct: emptyBillProduct(),
    reason: '',
    employee: {name: '', position: ''},
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
    status: 'open',
    toGo: false,
    pickUp: false,
    completetime: 0,
    paymentMethod: '',
    payment: {
      card: 0,
      cash: 0,
      viva: 0,
      voucher: 0,
    },
    clientInfo: {
      name: '',
      telephone: '',
      userId: '',
      cashBack: 0,
    },
    cashBack: 0,
    payOnSite: false,
    payOnline: false,
    cif: '',
    show: false,
    setName: false,
    name: 'COMANDA',
    products: [],
  }
  return emptyBill
}
