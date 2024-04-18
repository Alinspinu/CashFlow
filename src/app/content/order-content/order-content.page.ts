import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BillPage } from './bill/bill.page';
import { MeniuPage } from './meniu/meniu.page';
// import { ActivatedRoute } from '@angular/router';
// import { Subscription } from 'rxjs';
// import { Bill, BillProduct, Table } from 'src/app/models/table.model';
// import { emptyBill, emptyTable } from 'src/app/models/empty-models';
// import { TablesService } from 'src/app/tables/tables.service';
// import { WebRTCService } from '../webRTC.service';
// import { round } from '../../../../../../CashFlow/src/app/shared/utils/functions';




@Component({
  selector: 'app-order-content',
  templateUrl: './order-content.page.html',
  styleUrls: ['./order-content.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, BillPage, MeniuPage]
})
export class OrderContentPage implements OnInit {


  constructor(
    // private route: ActivatedRoute,
    // private tableSrv: TablesService,
    // private webRTC: WebRTCService,
  ) { }

  ngOnInit() {
  }



}
