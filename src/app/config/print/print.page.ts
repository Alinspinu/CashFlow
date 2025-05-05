import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { ConfigService } from '../config.service';
import { SalePoint } from 'src/app/models/sale-point';
import { SalePointService } from 'src/app/office/sale-point/sale-point.service';
import { environment } from 'src/environments/environment';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { PrintModalPage } from './print-modal/print-modal.page';
import { RandomService } from 'src/app/shared/random.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-print',
  templateUrl: './print.page.html',
  styleUrls: ['./print.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PrintPage implements OnInit, OnDestroy {

  menuOpen: boolean = false
  servers: any[] = []
  name!: string
  salePoint!: SalePoint

  pointsSub!: Subscription
  pointSub!: Subscription
  pointId!: string

  salePoints: SalePoint[] = []

  constructor(
    @Inject(ActionSheetService) private actionSheetService: ActionSheetService,
    @Inject(RandomService) private randomSrv: RandomService,
    private menuCtrl: MenuController,
    private configSrv: ConfigService,
    private salePointSrv: SalePointService,
    private toastCtrl: ToastController,
  ) { }

  ngOnInit() {
    this.menuChange()
    this.getServers()
    this.getSalePoint()
  }

  ngOnDestroy(): void {
    if(this.pointSub) this.pointSub.unsubscribe()
      if(this.pointsSub) this.pointsSub.unsubscribe()
  }



  getSalePoint(){
   this.pointSub = this.salePointSrv.pointSend$.subscribe({
    next: (p) => {
      if(p._id){
        this.pointId = p._id
      }
    }
   })
  }


  getServers(){
    this.configSrv.serversSend$.subscribe({
      next: (response) => {
        this.servers = response
      },
      error: (error) => {
        console.log(error)
      }
    })
  }


    async addServer(){
      const points = this.salePoints.map(s => s.name)
      const data = await this.actionSheetService.openAdd(PrintModalPage, points, 'small-two')
      if(data){
        const server = {
          locatie: environment.LOC,
          salePoint: this.pointId,
          name: data.name,
          key: this.randomSrv.generateRandomHexString(3)
        }
        this.configSrv.savePrintServer(server).subscribe({
          next: (response) => {
            showToast(this.toastCtrl, response.message, 2000)
            this.servers.push(response.server)
          },
          error: (error) => {
            console.log(error)
          }
        })
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
}
