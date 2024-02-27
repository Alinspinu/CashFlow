import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Bill, Table } from 'src/app/models/table.model';
import { Subscription } from 'rxjs';
import { TablesService } from 'src/app/tables/tables.service';
import { emptyTable } from 'src/app/models/empty-models';
import { MobileService } from './table-content-service';

@Component({
  selector: 'app-table-contet-mobile',
  templateUrl: './table-content-mobile.page.html',
  styleUrls: ['./table-content-mobile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class TableContentMobilePage implements OnInit, OnDestroy {

  isCart: boolean = false;

  tabSub!: Subscription
  mobSub!: Subscription

  tableNumber: number = 0
  billProducts!: any
  bill!: Bill
  table: Table = emptyTable()
  tables!: Table[]


  constructor(
    private tableSrv: TablesService,
    @Inject(MobileService) private mobSrv: MobileService,
  ) { }


ngOnDestroy(): void {
  if(this.tabSub){
    this.tabSub.unsubscribe()
  }
  if(this.mobSub){
    this.mobSub.unsubscribe()
  }
}

  ngOnInit() {
    this.getTableNumber()
  }

  getTableNumber(){
    const url = window.location.href;
    const tabs = url.split('/');
    const tab = tabs[4]
    this.tableNumber = +tab
    this.getTable()
  }


  getTable(){
    this.tabSub = this.tableSrv.tableSend$.subscribe(response => {
      if(response){
        this.tables = response
        const index =  this.tables.findIndex(obj => obj.index === this.tableNumber)
        this.table = this.tables[index]
        this.getBill()
    }
    })
  }

  getBill(){
    this.mobSub = this.mobSrv.orderIndexSend$.subscribe(response => {
      if(response){
        if(this.table && this.table.bills){
          this.bill = this.table.bills[response -1]
          if(this.bill && this.bill.products){
            this.billProducts = this.bill.products
          }
        }
      }
    })
  }


  isTab(tab: string){
    if(tab === 'cart'){
      this.isCart = true;
    } else{
      this.isCart = false;
    };
  };

}
