import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, NgZone } from "@angular/core";
import { BehaviorSubject, Observable, take, tap } from "rxjs";
import { Preferences } from "@capacitor/preferences"
import { Bill, BillProduct, Table, Topping } from "../models/table.model";
import { environment } from "src/environments/environment";
import { emptyBill, emptyTable } from "../models/empty-models";
import {AuthService} from "../auth/auth.service"



@Injectable({providedIn: 'root'})



export class TablesService{

  private tableState!: BehaviorSubject<Table[]>;
  public tableSend$!: Observable<Table[]>;
  tables: Table[] = [emptyTable()];

  user!: any;

  constructor(
    private http: HttpClient,
    private authSrv: AuthService,
    private ngZone: NgZone
  ){
    this.tableState = new BehaviorSubject<Table[]>([emptyTable()]);
    this.tableSend$ =  this.tableState.asObservable();
  }

  private eventSource!: EventSource

//******************************ORDERS************************* */

getBillIndex(tableIndex: number, billId: string){
  return this.tables[tableIndex].bills.findIndex(obj => obj._id === billId)
}

addNewBill(masa: number, name: string, newOrder: boolean){
  let bill: Bill = emptyBill()
  bill.name = name
  const table = this.tables.find((doc) => doc.index === masa)
  if(table){
    const index = table.bills.findIndex(obj => obj.name === "COMANDĂ NOUĂ")
    if(index === -1 || newOrder){
      table.bills.push(bill)
    }
  }
}

mergeBills(masa: number, data: {billIndex: number, id: string}[], employee: any, locatie: string){
  let mergedBills: Bill = emptyBill()
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
    this.saveOrder(masa, 'new', newIndex, employee, locatie).subscribe()
  }
}

manageSplitBills(tableIndex: number, billIndex: number, employee: any, locatie: string){
  let bill = this.tables[tableIndex-1].bills[billIndex]
  bill._id.length ? bill._id = bill._id : bill._id = 'new'
  this.saveOrder(tableIndex, bill._id, billIndex, employee, locatie).subscribe()
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
  let bill: Bill = emptyBill()
  if(table.bills.length){
    bill = table.bills[billIndex]
    bill.productCount++
    product.quantity = 1
    bill.products.push(product)
      bill.total = bill.total + product.price
      console.log(this.tables)
    this.tableState.next([...this.tables])
  } else {
    bill.masaRest.index = masa;
    bill.productCount++
    bill.total= bill.total + product.price
    product.quantity = 1
    bill.products.push(product)
    table.bills.push(bill)
    console.log(this.tables)
    this.tableState.next([...this.tables])
  }
}
}

 redOne(masa: number, billProdIndex: number, billIdex: number){
  console.log(billIdex)
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


addComment(masa: number, billProdIndex: number, billIndex: number, comment: string){
  const table = this.tables.find((doc) => doc.index === masa)
  if(table){
    const bill = table.bills[billIndex]
    const product =  bill.products[billProdIndex]
    product.comment = comment
    this.tableState.next([...this.tables])
  }
}

//*********************CLIENTS**************************** */

addCustomer(customer: any, masa: number, billIndex: number){
  const table = this.tables.find((doc) => doc.index === masa)
  if(table){
    let bill: Bill = emptyBill()
    if(table.bills.length){
      bill = table.bills[billIndex]
      bill.clientInfo = customer;
      this.tableState.next([...this.tables])
  }
}
}

redCustomer(masa: number, billIndex: number, billId: string, employee: any, locatie: string){
  const table = this.tables.find((doc) => doc.index === masa)
  if(table){
    let bill: Bill = emptyBill()
    if(table.bills.length){
      bill = table.bills[billIndex]
      bill.clientInfo = emptyBill().clientInfo
      this.saveOrder(masa, billId, billIndex, employee, locatie).subscribe()
  }
}
}


//**********************HTTP REQ******************* */



getTables(locatie: string, id: string){
  const headers = new HttpHeaders().set("ngrok-skip-browser-warning", "69420");
  Preferences.get({key: 'tables'}).then(response =>{
    if(response && response.value){
      const parsedTables = JSON.parse(response.value)
      this.tables = parsedTables
      this.tableState.next(this.tables)
    }
  })
  this.http.get<Table[]>(`${environment.BASE_URL_CLOUD}table/get-tables?loc=${locatie}&user=${id}`).subscribe(response => {
    if(response){
      this.tables = response
      const stringTable = JSON.stringify(this.tables)
      Preferences.set({key: 'tables', value: stringTable})
      this.tableState.next([...this.tables])
    }
  })
}

getOrderMessage (locatie: string, id: string): Observable<MessageEvent>{
  this.eventSource = new EventSource(`${environment.BASE_URL}table/get-order-message`)
    return new Observable((observer) => {
      this.eventSource.onmessage = (event) => {
        this.ngZone.run(() => {
        const data = JSON.parse(event.data)
        if(data && data.message === "New Order"){
          console.log('hit inside event')
        this.getTables(locatie, id)
        observer.next(event);
        }
        });
      };

      this.eventSource.onerror = (error) => {
        this.ngZone.run(() => {
          observer.error(error);
        });
      };
    });
}


stopSse() {
if (this.eventSource) {
  this.eventSource.close();
}
}


addTable(name: string, locatie: string){
  return this.http.post<{message: string, table: Table}>(`${environment.BASE_URL}table?loc=${locatie}`, {name: name})
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

saveOrder(tableIndex:number, billId: string, billIndex: number, employee: any, locatie: string){
  const table = this.tables[tableIndex-1];
  const bill = this.tables[tableIndex-1].bills[billIndex];
  bill.masa = tableIndex;
  bill.masaRest = table._id;
  bill.production = true;
  bill.employee = employee
  bill.locatie = locatie
  bill.onlineOrder = false
  bill.pending = true
  bill.prepStatus = 'open'
  const billToSend = JSON.stringify(bill);
  const tables = JSON.stringify(this.tables);
  Preferences.set({key: 'tables', value: tables});
  return this.http.post<{billId: string, index: number, products: any, masa: any}>(`${environment.BASE_URL}orders/bill?index=${tableIndex}&billId=${billId}`,  {bill: billToSend} ).pipe(take(1), tap(res => {
    bill._id = res.billId;
    bill.index = res.index;
    bill.products = res.products
    bill.products.forEach(product => {
      product.sentToPrint = false
      product.sentToPrintOnline = false
    })
    bill.masaRest = res.masa
    this.tableState.next([...this.tables])
 }));
};

uploadIngs(ings: any, quantity: number, operation: any, locatie: string){
  return this.http.post<{message: string}>(`${environment.BASE_URL}orders/upload-ings?loc=${locatie}`, {ings, quantity, operation})
}

deleteOrders(data: any[]){
  return this.http.put<{message: string}>(`${environment.BASE_URL}orders/bill`, {data: data})
}

registerDeletetProduct(product: any){
  return this.http.post(`${environment.BASE_URL}orders/register-del-prod`, {product: product})
}

sendBillToPrint(bill: Bill){
  return this.http.post(`${environment.BASE_URL}pay/print-bill`, {bill: bill})
}

setOrderTime(orderId: string, time: number){
  return this.http.get(`${environment.BASE_URL}orders/set-order-time?orderId=${orderId}&time=${time}`)
}

//********************EMPTY MODELS**************************** */



arraysAreEqual = (arr1: Topping[], arr2: Topping[]) => arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);

}
