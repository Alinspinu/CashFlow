import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, take, tap } from "rxjs";
import { Preferences } from "@capacitor/preferences"
import { Bill, BillProduct, Table } from "./table.model";
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

getTables(){
  this.http.get<Table[]>(`${environment.BASE_LOCAL_URL}api-true/get-tables`).subscribe(response => {
    if(response){
      this.tables = response
      this.tableState.next([...this.tables])
    }
  })
}


editTable(tableIndex: number, name: string){
  console.log(tableIndex)
  const table = this.tables[tableIndex-1];
  console.log(table)
  return this.http.put<{message: string, table: Table}>(`${environment.BASE_LOCAL_URL}table`,{name: name, tableId: table._id})
  .pipe(take(1), tap(response => {
    if(response){
      console.log(response)
      const table = this.tables[response.table.index-1]
      table.name = response.table.name
      this.tableState.next([...this.tables])
    }
  }))
}

addTable(name: string){
  return this.http.post<{message: string, table: Table}>(`${environment.BASE_LOCAL_URL}table`, {name: name})
    .pipe(take(1), tap(response => {
    if(response){
      this.tables.push(response.table)
      this.tableState.next([...this.tables])
    }
  }))
}


deleteTable(tableId: string, index: number){
  return this.http.delete<{message: string}>(`${environment.BASE_LOCAL_URL}table?tableId=${tableId}`)
  .pipe(take(1), tap(response => {
    if(response){
      const indexToDelete = this.tables.findIndex(obj => obj.index === index)
      this.tables.splice(indexToDelete, 1)
      this.tableState.next([...this.tables])
    }
  }))
}




addToBill(product: BillProduct, masa: number, billIndex: number){
const table = this.tables.find((doc) => doc.index === masa)
if(table){
  let bill: Bill = this.emptyBill()
  if(table.bills.length){
    bill = table.bills[billIndex]
    bill.productCount++
    const existingProduct = bill.products.find(p =>(p.name === product.name) && this.arraysAreEqual(p.toppings, product.toppings));
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

redOne(masa: number, billProdIndex: number){
  const table = this.tables.find((doc) => doc.index === masa)
  if(table){
    const bill = table.bills[0]
    const product =  table.bills[0].products[billProdIndex]
    product.quantity--
    product.total = product.quantity * product.price
    bill.total = bill.total - product.price
    if(product.quantity === 0){
      table.bills[0].products.splice(billProdIndex, 1)
    }
    this.tableState.next([...this.tables])
  }
}

addOne(masa: number, billProdIndex: number){
  const table = this.tables.find((doc) => doc.index === masa)
  if(table){
    const bill = table.bills[0]
    const product =  table.bills[0].products[billProdIndex]
    product.quantity++
    product.total = product.quantity * product.price
    bill.total = bill.total + product.price
    this.tableState.next([...this.tables])
  }
}

addNewBill(masa: number){
  let bill: Bill = this.emptyBill()
  const table = this.tables.find((doc) => doc.index === masa)
  if(table){
    table.bills.push(bill)
  }

}

saveTablesLocal(tableIndex:number, billId: string, billIndex: number){
  const table = this.tables[tableIndex-1];
  console.log(tableIndex)
  const bill = this.tables[tableIndex-1].bills[billIndex];
  bill.masa = tableIndex;
  bill.masaRest = table._id;
  bill.production = true
  const billToSend = JSON.stringify(bill)
  const tables = JSON.stringify(this.tables)
  Preferences.set({key: 'tables', value: tables})
 return this.http.post<{billId: string, index: number}>(`${environment.BASE_LOCAL_URL}api-true/add-bill?index=${tableIndex}&billId=${billId}`,  {bill: billToSend} ).pipe(take(1), tap(res => {
     bill._id = res.billId
     bill.index = res.index
 }))
}

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
    cashBack: 0,
    payOnSite: false,
    payOnline: false,
    cif: '',
    userName: '',
    userTel: '',
    show: false,
    setName: false,
    name: 'COMANDA',
    products: []
  }
  return emptyBill
}

arraysAreEqual = (arr1: string[], arr2: string[]) => arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);

}
