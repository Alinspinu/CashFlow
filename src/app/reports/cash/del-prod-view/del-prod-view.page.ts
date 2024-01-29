import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { formatedDateToShow } from 'src/app/shared/utils/functions';

@Component({
  selector: 'app-del-prod-view',
  templateUrl: './del-prod-view.page.html',
  styleUrls: ['./del-prod-view.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DelProdViewPage implements OnInit {
  products: any[] = []

  constructor(
    @Inject(ActionSheetService) private actSrv: ActionSheetService,
    private navPar: NavParams,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.products = this.navPar.get('data')
  }

  close(){
    this.modalCtrl.dismiss(null)
  }

  showOrder(product: any ){
    // this.actSrv.openModal(OrderViewPage, order)
  }

  formatDate(date:any) {
    const strings = formatedDateToShow(date).split('-2024 ora').join('')
    return strings
  }

}
