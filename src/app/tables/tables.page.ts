import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Table } from './table.model';
import { TablesService } from './tables.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tables.page.html',
  styleUrls: ['tables.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})

export class TablesPage implements OnInit {

  tables!: Table[]

  constructor(
    private router: Router,
    private tableServ: TablesService
    ) {}

ngOnInit(): void {
  this.getTables()
}

getTables(){
  this.tableServ.tableSend$.subscribe(response => {
    this.tables = response
  })
}


  openTable(num: number){
    this.router.navigateByUrl(`table-content/${num}`)
  }

}
