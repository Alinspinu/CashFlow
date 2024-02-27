import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Bill } from 'src/app/models/table.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-content',
  templateUrl: './header-content.page.html',
  styleUrls: ['./header-content.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink]
})
export class HeaderContentPage implements OnInit {

  tableNumber!: number

  @Output() dataEvent = new EventEmitter<string>();
  @Output() newOrderEv = new EventEmitter<string>();
  @Input() tableBills!: Bill[]
  constructor() { }

  ngOnInit() {
    this.getTableNumber()
    console.log(this.tableBills)
  }


  sendOrder(orderIndex: any){
    this.dataEvent.emit(orderIndex)
  }

  getTableNumber(){
    const url = window.location.href;
    const tabs = url.split('/');
    const tab = tabs[4]
    return this.tableNumber = +tab
  }

  newOrder(){
    this.newOrderEv.emit('new')
  }
}
