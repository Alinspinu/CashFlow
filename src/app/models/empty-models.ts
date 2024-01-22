
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
    locatie: '',
    employee: {fullName: '', position: '', user: '', access: 0}
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
    comment: '',
    tva: '',
    discount: 0,
    dep: '',
    toppingsToSend: []
  }
  return billProduct
 }

 export function  emptyDeletetBillProduct(){
  const deletetBillProduct: deletetBillProduct = {
    billProduct: emptyBillProduct(),
    reason: '',
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
    status: 'open',
    toGo: false,
    pickUp: false,
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
    locatie: '',
  }
  return emptyBill
}

