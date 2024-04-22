import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BillPage } from './bill/bill.page';
import { MeniuPage } from './meniu/meniu.page';





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
