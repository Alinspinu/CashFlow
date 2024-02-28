import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TabContentPage } from '../tab-content/tab-content.page';
import { HeaderContentPage } from '../header-content/header-content.page';
import { TablesService } from 'src/app/tables/tables.service';
import { Subscription } from 'rxjs';
import { Bill, Table } from 'src/app/models/table.model';

@Component({
  selector: 'app-food',
  templateUrl: './food.page.html',
  styleUrls: ['./food.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TabContentPage, HeaderContentPage]
})
export class FoodPage implements OnInit, OnDestroy {

  tabSub!: Subscription
  table!: Table
  tableNumber: number = 0

  constructor(
    private tableSrv: TablesService
  ) { }


ngOnDestroy(): void {
  if(this.tabSub){
    this.tabSub.unsubscribe()
  }
}

  ngOnInit() {
    this.getTableNumber()
    this.getTable()
  }

  getTableNumber(){
    const url = window.location.href;
    const tabs = url.split('/');
    const tab = tabs[4]
    return this.tableNumber = +tab
  }


  getTable(){
    this.tabSub = this.tableSrv.tableSend$.subscribe(response => {
      if(response){
        const table = response.find(obj => obj.index === this.tableNumber)
        if(table){
        this.table = table;
      }
    }
    })
  }

}
