import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { SalePointService } from '../sale-point.service';
import { SalePoint } from 'src/app/models/sale-point';
import { environment } from 'src/environments/environment';
import { showToast } from 'src/app/shared/utils/toast-controller';

@Component({
  selector: 'app-add-point-modal',
  templateUrl: './add-point-modal.page.html',
  styleUrls: ['./add-point-modal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AddPointModalPage implements OnInit {

  name!: string;
  address!: string;

  constructor(
    private modalCtrl: ModalController,
    private pointService: SalePointService,
    private toastCtrl: ToastController,
  ) { }

  ngOnInit() {
  }


  cancel(){
    this.modalCtrl.dismiss(null)
  }

  saveSalePoint(){
    const point: SalePoint = {
      name: this.name,
      address: this.address,
      locatie: environment.LOC
    }
    this.pointService.addSalePoint(point).subscribe({
      next: (point) => {
        showToast(this.toastCtrl, `Punctul de lucru ${point.name} a fost savat cu sucess!`, 3000)
        this.modalCtrl.dismiss(point)
      },
      error: (error) => {
        showToast(this.toastCtrl, error.message, 5000)
        console.log(error)
      }
    })
  }


}