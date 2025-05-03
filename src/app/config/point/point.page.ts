import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { PointService } from 'src/app/shared/point.service';
import { SalePoint } from 'src/app/models/sale-point';
import { SalePointService } from 'src/app/office/sale-point/sale-point.service';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { Preferences } from '@capacitor/preferences';
import { AddPointModalPage } from 'src/app/office/sale-point/add-point-modal/add-point-modal.page';

@Component({
  selector: 'app-point',
  templateUrl: './point.page.html',
  styleUrls: ['./point.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PointPage implements OnInit {

  menuOpen: boolean = false

  points: SalePoint[] = []

  constructor(
    private menuCtrl: MenuController,
    private pointService: SalePointService,
    @Inject(ActionSheetService) private actionService: ActionSheetService,
  ) { }

  ngOnInit() {
    this.menuChange() 
    this.getPoints()
  }


  getPoints(){
    this.pointService.pointsSend$.subscribe({
      next: (points) => {
        this.points = points
      }
    })
  }

  async action(point: SalePoint){
    const response = await this.actionService.entryAlert(['Activează', 'Modifică'], 'radio', '', 'Alege o opțiune', '', '')
    if(response === 'Activează') {
      this.pointService.actvatePoint(point)
    }
    if(response === 'Modifică'){
      const response = await this.actionService.openPayment(AddPointModalPage, point)
    }
  }


  private async menuChange(){
    const menu = await this.menuCtrl.get('start');
    if (menu) {
      menu.addEventListener('ionDidClose', () => {
        this.menuOpen = false
      });
      menu.addEventListener('ionDidOpen', () => {
           this.menuOpen = true
      });
    }
  }

  async addSalePoint(){

  }

}
