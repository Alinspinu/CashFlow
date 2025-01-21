import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { formatOrderDate, modifyImageURL} from 'src/app/shared/utils/functions';
import { deletetBillProduct } from 'src/app/models/table.model';

@Component({
  selector: 'app-del-prod-view',
  templateUrl: './del-prod-view.page.html',
  styleUrls: ['./del-prod-view.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DelProdViewPage implements OnInit {
  products: any[] = []
  total: number = 0

  constructor(
    @Inject(ActionSheetService) private actSrv: ActionSheetService,
    private navPar: NavParams,
    private modalCtrl: ModalController,
  ) { }

ngOnInit(): void {
    this.getProducts()
}

 getProducts(){
  const data = this.navPar.get('options') as {products: deletetBillProduct[], total: number }
  this.products =data.products
  this.total = data.total
 }


  close(){
    this.products = []
    this.modalCtrl.dismiss(null)
  }

  showOrder(product: any ){
    // this.actSrv.openModal(OrderViewPage, order)
  }

  formatDate(date:any) {
    return formatOrderDate(date)
  }

  modifyImage(url: string) {
    return modifyImageURL(url)
  }

}
