import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable} from "@angular/core";
import { BehaviorSubject, Observable, of, switchMap, take, tap, firstValueFrom, throwError, catchError, subscribeOn } from "rxjs";
import { Preferences } from "@capacitor/preferences"
import { Bill, BillProduct, Table, Topping } from "../models/table.model";
import { environment } from "src/environments/environment";
import { emptyBill, emptyTable } from "../models/empty-models";
import { WebRTCService } from "../content/webRTC.service";
import { round } from "../shared/utils/functions";
import { AuthService } from '../auth/auth.service';
import { handlePrintErrors } from "../shared/utils/errorHandlers";




@Injectable({providedIn: 'root'})



export class TablesService{

  private tableState!: BehaviorSubject<Table[]>;
  public tableSend$!: Observable<Table[]>;
  tables: Table[] = [emptyTable()];
  screenWidth!: number;
  baseUrl: string =  environment.SAVE_URL

  user!: any;

  headers: HttpHeaders = new HttpHeaders().set('bypass-tunnel-reminder', 'true')


  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error)
    const errorMessage = handlePrintErrors(error);
    // Optionally, log the error to an external service here
    return throwError(() => new Error(errorMessage));
  }


  constructor(
    private http: HttpClient,
    private webRtc: WebRTCService,
    private auth: AuthService,
  ){
    this.tableState = new BehaviorSubject<Table[]>([emptyTable()]);
    this.tableSend$ =  this.tableState.asObservable();
    this.screenWidth = window.innerWidth
    // this.screenWidth < 300 ? this.baseUrl = environment.SAVE_URL_MOBILE : this.baseUrl = environment.SAVE_URL
  }

//******************************ORDERS************************* */

getBillIndex(tableIndex: number, billId: string){
  return this.tables[tableIndex].bills.findIndex(obj => obj._id === billId)
}

addNewBill(masa: number, name: string, newOrder: boolean){
  let bill: Bill = emptyBill()
  bill.name = name
  const table = this.tables.find((doc) => doc.index === masa)
  if(table){
    const index = table.bills.findIndex(obj => obj.name === "COMANDA NOUA")
    if(index === -1 || newOrder){
      table.bills.push(bill)
    }
    const tables = JSON.stringify(this.tables);
    Preferences.set({key: 'tables', value: tables});
  }
}

addOnlineOrder(bill: Bill){
    const table = this.tables[53]
    table.bills.push(bill)
    const tables = JSON.stringify(this.tables);
    Preferences.set({key: 'tables', value: tables});
    this.tableState.next([...this.tables])
}

updateOrder(bill: Bill){
  const table = this.tables.find(obj => obj.index === bill.masa)
  const tableIndex = this.tables.findIndex(obj => obj.index === bill.masa)
  if(table){
    const billIndex = table.bills.findIndex(obj => obj.soketId === bill.soketId)
    if(billIndex !== -1){
      table.bills[billIndex] = bill
      const index = table.bills.findIndex(obj => obj.soketId === bill.soketId)
      this.saveOrder(tableIndex, bill._id, index, bill.employee, bill.inOrOut, bill.out)
      this.tableState.next([...this.tables])
    } else {
      table.bills.push(bill)
      this.saveOrder(tableIndex, bill._id, billIndex, bill.employee, bill.inOrOut, bill.out)
      this.tableState.next([...this.tables])
    }
  }
}

async mergeBills(masa: number, data: {billIndex: number, id: string}[], employee: any, locatie: string){
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
    const response = await firstValueFrom(this.saveOrder(masa, 'new', newIndex, employee, '', false))
    if(response) {
      return true
    } else {
      return null
    }
  }
  return null
}

async manageSplitBills(tableIndex: number, billIndex: number, employee: any, locatie: string){
  let bill = this.tables[tableIndex-1].bills[billIndex]
  bill._id.length ? bill._id = bill._id : bill._id = 'new'
  const response = await firstValueFrom(this.saveOrder(tableIndex, bill._id, billIndex, employee, '', false))
  if(response) {
    return true
  } else {
    return null
  }
}

removeBill(masa: number, billIndex: number){
  console.log(masa, billIndex)
  let table = this.tables[masa-1];
  if(billIndex  === -1){
    table.bills.pop()
  } else {
    table.bills.splice(billIndex, 1)
  }
  this.webRtc.sendProductData(JSON.stringify(emptyBill()))
  const tables = JSON.stringify(this.tables);
  Preferences.set({key: 'tables', value: tables});
  this.tableState.next([...this.tables])
}


removeLive(masa: number, billId: string){
  let table = this.tables[masa-1];
  const billIndex = table.bills.findIndex(obj => obj._id === billId)
  if(billIndex !== -1){
    table.bills.splice(billIndex, 1)
    this.webRtc.sendProductData(JSON.stringify(emptyBill()))
    const tables = JSON.stringify(this.tables);
    Preferences.set({key: 'tables', value: tables});
    this.tableState.next([...this.tables])
  }
}

//***************************ORDER-PRODUCTS******************************* */


addToBill(product: BillProduct, masa: number, billIndex: number, userName: string){
const table = this.tables.find((doc) => doc.index === masa)
if(table){
  let bill: Bill = emptyBill()
  if(table.bills.length){
    bill = table.bills[billIndex]
    bill.productCount++
    product.quantity = 1
    bill.products.push(product)
    bill.total = bill.total + product.price
    const tables = JSON.stringify(this.tables);
    Preferences.set({key: 'tables', value: tables});
    this.tableState.next([...this.tables])
    // this.webRtc.sendProductData(JSON.stringify(bill))
  } else {
    bill.masaRest.index = masa;
    bill.name = userName
    bill.productCount++
    bill.total= bill.total + product.price
    product.quantity = 1
    bill.products.push(product)
    bill._id = 'new'
    table.bills.push(bill)
    // this.webRtc.sendProductData(JSON.stringify(bill))
    const tables = JSON.stringify(this.tables);
    Preferences.set({key: 'tables', value: tables});
    this.tableState.next([...this.tables])
  }
}
}

sendBill(bill: Bill){
  this.webRtc.sendProductData(JSON.stringify(bill))
}

 redOne(masa: number, billProdIndex: number, billIdex: number){
  const table = this.tables.find((doc) => doc.index === masa)
  if(table){
    const bill = table.bills[billIdex]
    if(bill){
      const product =  bill.products[billProdIndex]
      product.quantity--
      product.total = product.quantity * product.price
      bill.total = bill.total - product.price
      if(product.quantity === 0){
        bill.products.splice(billProdIndex, 1)
      }
      // this.webRtc.sendProductData(JSON.stringify(bill))
      const tables = JSON.stringify(this.tables);
      Preferences.set({key: 'tables', value: tables});
      this.tableState.next([...this.tables])
    }
    }
}

addOne(masa: number, billProdIndex: number, billindex: number){
  const table = this.tables.find((doc) => doc.index === masa)
  if(table){
    const bill = table.bills[billindex]
    if(bill){
      const product =  bill.products[billProdIndex]
      product.quantity++
      product.total = product.quantity * product.price
      bill.total = bill.total + product.price
      // this.webRtc.sendProductData(JSON.stringify(bill))
      const tables = JSON.stringify(this.tables);
      Preferences.set({key: 'tables', value: tables});
      this.tableState.next([...this.tables])
    }
  }
}


addComment(masa: number, billProdIndex: number, billIndex: number, comment: string){
  const table = this.tables.find((doc) => doc.index === masa)
  if(table){
    const bill = table.bills[billIndex]
    const product =  bill.products[billProdIndex]
    product.comment = comment
    const tables = JSON.stringify(this.tables);
    Preferences.set({key: 'tables', value: tables});
    this.tableState.next([...this.tables])
  }
}

addTopping(masa: number, billProdIndex: number, billIndex: number, product: any){
  const table = this.tables.find((doc) => doc.index === masa)
  if(table){
    const bill = table.bills[billIndex]
    bill.products[billProdIndex] = product
    const tables = JSON.stringify(this.tables);
    Preferences.set({key: 'tables', value: tables});
    this.tableState.next([...this.tables])
    // this.webRtc.sendProductData(JSON.stringify(bill))
}
}

addQty(masa: number, billProdIndex: number, billIndex: number, qty: number){
  const table = this.tables.find((doc) => doc.index === masa)
  if(table){
    const bill = table.bills[billIndex]
    const product =  bill.products[billProdIndex]
    product.quantity = qty
    const total = round(product.quantity * product.price)
    const diference = total - product.total
    product.total = total
    bill.total += diference
    // const tables = JSON.stringify(this.tables);
    // Preferences.set({key: 'tables', value: tables});
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
      // this.webRtc.sendProductData(JSON.stringify(bill))
      const tables = JSON.stringify(this.tables);
      Preferences.set({key: 'tables', value: tables});
      this.tableState.next([...this.tables])
  }
}
}

 async redCustomer(masa: number, billIndex: number, billId: string, employee: any, locatie: string){
  const table = this.tables.find((doc) => doc.index === masa)
  if(table){
    let bill: Bill = emptyBill()
    if(table.bills.length){
      bill = table.bills[billIndex]
      bill.clientInfo = emptyBill().clientInfo
      const response = await firstValueFrom(this.saveOrder(masa, billId, billIndex, employee, '', false))
      if(response) {
        return true
      } else {
        return null
      }
    }
  }
  return null
}


//**********************HTTP REQ******************* */


getTables(locatie: string, id: string){
  Preferences.get({key: 'tables'}).then(response =>{
    if(response && response.value){
      const parsedTables = JSON.parse(response.value)
      this.tables = parsedTables
      this.tableState.next([...this.tables])
    }
  })
  this.http.get<Table[]>(`${this.baseUrl}table/get-tables?loc=${locatie}&user=${id}`).subscribe(response => {
    if(response){
      this.tables = response
      const stringTable = JSON.stringify(this.tables)
      Preferences.set({key: 'tables', value: stringTable})
      this.tableState.next([...this.tables])
    }
  })
}

addTable(name: string, locatie: string){
  return this.http.post<{message: string, table: Table}>(`${this.baseUrl}table?loc=${locatie}`, {name: name})
    .pipe(take(1), tap(response => {
    if(response){
      this.tables.push(response.table)
      const tables = JSON.stringify(this.tables);
      Preferences.set({key: 'tables', value: tables});
      this.tableState.next([...this.tables])
    }
  }))
}

editTable(tableIndex: number, name: string){
  const table = this.tables[tableIndex-1];
  return this.http.put<{message: string, table: Table}>(`${this.baseUrl}table`,{name: name, tableId: table._id})
  .pipe(take(1), tap(response => {
    if(response){
      const table = this.tables[response.table.index-1]
      table.name = response.table.name
      const tables = JSON.stringify(this.tables);
      Preferences.set({key: 'tables', value: tables});
      this.tableState.next([...this.tables])
    }
  }))
}


deleteTable(tableId: string, index: number){
  return this.http.delete<{message: string}>(`${this.baseUrl}table?tableId=${tableId}`)
  .pipe(take(1), tap(response => {
    if(response){
      const indexToDelete = this.tables.findIndex(obj => obj.index === index)
      this.tables.splice(indexToDelete, 1)
      const tables = JSON.stringify(this.tables);
      Preferences.set({key: 'tables', value: tables});
      this.tableState.next([...this.tables])
    }
  }))
}

 saveOrder(
  tableIndex:number,
  billId: string,
  billIndex: number,
  employee: any,
  inOrOut: string,
  outside: boolean
  ){

  const table = this.tables[tableIndex-1];
  const bill = this.tables[tableIndex-1].bills[billIndex];
  bill.out = outside
  bill.masa = tableIndex;
  bill.masaRest = table._id;
  bill.production = true;
  bill.inOrOut = inOrOut
  if(bill.employee){
    bill.employee.user.length ? bill.employee = bill.employee : bill.employee = employee
  } else {
    bill.employee = employee
  }
  bill.locatie = environment.LOC
  bill.onlineOrder = false
  bill.pending = true
  bill.prepStatus = 'open'
  const billToSend = JSON.stringify(bill);
  return this.http.post<{billId: string, index: number, products: any, billTotal: number, masa: any}>(`${this.baseUrl}orders/bill?index=${tableIndex}&billId=${billId}`,  {bill: billToSend})
      .pipe(take(1),
        switchMap(res => {
        bill._id = res.billId;
        bill.index = res.index;
        bill.products = res.products;
        bill.products.forEach(product => {
          product.sentToPrint = false;
          product.sentToPrintOnline = false;
        });
        bill.total = res.billTotal
        bill.masaRest = res.masa;
        this.tableState.next([...this.tables]);
        const tables = JSON.stringify(this.tables);
        Preferences.set({key: 'tables', value: tables});
        return of(res);
      })
);
};


saveBillToCloud(bill: Bill){
  this.http.post(`${environment.BASE_URL}pay/save-bill-cloud`, {bill: bill}).subscribe(res => {
    console.log(res)
  })
}



sendBillToPrint(bill: Bill){
  const headers = new HttpHeaders().set('bypass-tunnel-reminder', 'true')
  return this.http.post<{message: string, bill: Bill}>(`${this.baseUrl}pay/print-bill`, {bill: bill}, {headers})
}


uploadIngs(ings: any, quantity: number, operation: any, locatie: string){
  const headers = new HttpHeaders().set('bypass-tunnel-reminder', 'true')
  return this.http.post<{message: string}>(`${environment.BASE_URL}orders/upload-ings?loc=${locatie}`, {ings, quantity, operation}, {headers})
}

unloadIngs(ings: any, quantity: number, operation: any, locatie: string){
  const headers = new HttpHeaders().set('bypass-tunnel-reminder', 'true')
  return this.http.post<{message: string}>(`${environment.BASE_URL}orders/unload-ings?loc=${locatie}`, {ings, quantity, operation}, {headers})
}

deleteOrders(data: any[]){
  const headers = new HttpHeaders().set('bypass-tunnel-reminder', 'true')
  return this.http.put<{message: string}>(`${this.baseUrl}orders/bill`, {data: data}, {headers})
}

registerDeletetProduct(product: any){
  const headers = new HttpHeaders().set('bypass-tunnel-reminder', 'true')
  return this.http.post(`${environment.BASE_URL}orders/register-del-prod`, {product: product}, {headers})
}


setOrderTime(orderId: string, time: number){
  const headers = new HttpHeaders().set('bypass-tunnel-reminder', 'true')
  return this.http.get(`${environment.BASE_URL}orders/set-order-time?orderId=${orderId}&time=${time}`, {headers})
}

//********************EMPTY MODELS**************************** */



arraysAreEqual = (arr1: Topping[], arr2: Topping[]) => arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);

}


