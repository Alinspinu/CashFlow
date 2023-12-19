import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, take, tap } from "rxjs";
import { Preferences } from "@capacitor/preferences"
import { Bill, BillProduct, Table, Topping } from "../models/table.model";
import { environment } from "src/environments/environment";



@Injectable({providedIn: 'root'})



export class TablesService{

  private tableState!: BehaviorSubject<Table[]>;
  public tableSend$!: Observable<Table[]>;
  tables: Table[] = [this.emptyTable()];

  constructor(
    private http: HttpClient,
  ){
    this.tableState = new BehaviorSubject<Table[]>([this.emptyTable()]);
    this.tableSend$ =  this.tableState.asObservable();
  }


//******************************ORDERS************************* */

getBillIndex(tableIndex: number, billId: string){
  return this.tables[tableIndex].bills.findIndex(obj => obj._id === billId)
}

addNewBill(masa: number, name: string){
  let bill: Bill = this.emptyBill()
  bill.name = name
  const table = this.tables.find((doc) => doc.index === masa)
  if(table){
    const index = table.bills.findIndex(obj => obj.name === "COMANDĂ NOUĂ")
    if(index === -1){
      table.bills.push(bill)
    }
  }
}

mergeBills(masa: number, data: {billIndex: number, id: string}[]){
  let mergedBills: Bill = this.emptyBill()
  let productsToMerge: any = []
  let total = 0
  let table = this.tables.find(doc => doc.index === masa)
  if(table){
    let bills = table.bills
    data.forEach(el => {
    total += bills[el.billIndex].total
    bills[el.billIndex].products.forEach(el => {
      productsToMerge.push(el)
    })
    })
    data.forEach(el => {
      let index = bills.findIndex(obj => obj._id = el.id)
      bills.splice(index, 1)
    })
    mergedBills.products = productsToMerge;
    mergedBills.name = 'UNITE';
    mergedBills.total = total;
    table.bills.push(mergedBills);
    let newIndex = bills.findIndex(obj => obj.name === 'UNITE')
    this.saveTablesLocal(masa, 'new', newIndex).subscribe()
  }
}

manageSplitBills(tableIndex: number, billIndex: number){
  let bill = this.tables[tableIndex-1].bills[billIndex]
  bill._id.length ? bill._id = bill._id : bill._id = 'new'
  this.saveTablesLocal(tableIndex, bill._id, billIndex).subscribe()
}

removeBill(masa: number, billIndex: number){
  let table = this.tables[masa-1];
  if(billIndex  === -1){
    table.bills.pop()
  } else {
    table.bills.splice(billIndex, 1)
  }
  this.tableState.next([...this.tables])
}


//***************************ORDER-PRODUCTS******************************* */


addToBill(product: BillProduct, masa: number, billIndex: number){
const table = this.tables.find((doc) => doc.index === masa)
if(table){
  let bill: Bill = this.emptyBill()
  if(table.bills.length){
    bill = table.bills[billIndex]
    bill.productCount++
    const existingProduct = bill.products.find(p =>(p.name === product.name) && this.arraysAreEqual(p.toppings, product.toppings) && p.sentToPrint);
    if (existingProduct) {
      existingProduct.quantity = product.quantity + existingProduct.quantity;
      existingProduct.total = (existingProduct.quantity) * existingProduct.price;
      bill.total = bill.total + existingProduct.price
    } else {
      bill.products.push(product)
      bill.total = bill.total + product.price
    }
    this.tableState.next([...this.tables])
  } else {
    bill.masaRest.index = masa;
    bill.productCount++
    bill.total= bill.total + product.price
    bill.products.push(product)
    table.bills.push(bill)
    this.tableState.next([...this.tables])
  }
}
}

 redOne(masa: number, billProdIndex: number, billIdex: number){
  const table = this.tables.find((doc) => doc.index === masa)
  if(table){
    const bill = table.bills[billIdex]
    const product =  bill.products[billProdIndex]
    product.quantity--
    product.total = product.quantity * product.price
    bill.total = bill.total - product.price
    if(product.quantity === 0){
      bill.products.splice(billProdIndex, 1)
    }
    this.tableState.next([...this.tables])
  }
}

addOne(masa: number, billProdIndex: number, billindex: number){
  const table = this.tables.find((doc) => doc.index === masa)
  if(table){
    const bill = table.bills[billindex]
    const product =  bill.products[billProdIndex]
    product.quantity++
    product.total = product.quantity * product.price
    bill.total = bill.total + product.price
    this.tableState.next([...this.tables])
  }
}

//*********************CLIENTS**************************** */

addCustomer(customer: any, masa: number, billIndex: number){
  const table = this.tables.find((doc) => doc.index === masa)
  if(table){
    let bill: Bill = this.emptyBill()
    if(table.bills.length){
      bill = table.bills[billIndex]
      bill.clientInfo = customer;
      this.tableState.next([...this.tables])
  }
}
}

redCustomer(masa: number, billIndex: number, billId: string){
  const table = this.tables.find((doc) => doc.index === masa)
  if(table){
    let bill: Bill = this.emptyBill()
    if(table.bills.length){
      bill = table.bills[billIndex]
      bill.clientInfo = this.emptyBill().clientInfo
      this.saveTablesLocal(masa, billId, billIndex).subscribe()
  }
}
}




//**********************HTTP REQ******************* */


getTables(){
  this.http.get<Table[]>(`${environment.BASE_URL}table/get-tables`).subscribe(response => {
    if(response){
      this.tables = response
      this.tableState.next([...this.tables])
    }
  })
}

addTable(name: string){
  return this.http.post<{message: string, table: Table}>(`${environment.BASE_URL}table`, {name: name})
    .pipe(take(1), tap(response => {
    if(response){
      this.tables.push(response.table)
      this.tableState.next([...this.tables])
    }
  }))
}

editTable(tableIndex: number, name: string){
  const table = this.tables[tableIndex-1];
  return this.http.put<{message: string, table: Table}>(`${environment.BASE_URL}table`,{name: name, tableId: table._id})
  .pipe(take(1), tap(response => {
    if(response){
      const table = this.tables[response.table.index-1]
      table.name = response.table.name
      this.tableState.next([...this.tables])
    }
  }))
}


deleteTable(tableId: string, index: number){
  return this.http.delete<{message: string}>(`${environment.BASE_URL}table?tableId=${tableId}`)
  .pipe(take(1), tap(response => {
    if(response){
      const indexToDelete = this.tables.findIndex(obj => obj.index === index)
      this.tables.splice(indexToDelete, 1)
      this.tableState.next([...this.tables])
    }
  }))
}

saveTablesLocal(tableIndex:number, billId: string, billIndex: number){
  const table = this.tables[tableIndex-1];
  const bill = this.tables[tableIndex-1].bills[billIndex];
  bill.masa = tableIndex;
  bill.masaRest = table._id;
  bill.production = true;
  const billToSend = JSON.stringify(bill);
  const tables = JSON.stringify(this.tables);
  Preferences.set({key: 'tables', value: tables});
  return this.http.post<{billId: string, index: number, products: any, masa: any}>(`${environment.BASE_URL}orders/bill?index=${tableIndex}&billId=${billId}`,  {bill: billToSend} ).pipe(take(1), tap(res => {
    bill._id = res.billId;
    bill.index = res.index;
    bill.products = res.products
    bill.masaRest = res.masa
    this.tableState.next([...this.tables])
 }));
};

uploadIngs(ings: any, quantity: number){
  return this.http.post<{message: string}>(`${environment.BASE_URL}orders/upload-ings`, {ings, quantity})
}

deleteOrders(data: any[]){
  return this.http.put<{message: string}>(`${environment.BASE_URL}orders/bill`, {data: data})
}


//********************EMPTY MODELS**************************** */

emptyTable(){
  const emptyTable: Table = {_id: '', bills: [], index: 0, name: ''}
  return emptyTable
}


emptyBill(){
   const emptyBill = {
    _id: '',
    production: true,
    index: 0,
    masaRest: this.emptyTable(),
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

arraysAreEqual = (arr1: Topping[], arr2: Topping[]) => arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);

}
