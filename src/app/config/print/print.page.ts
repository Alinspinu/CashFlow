import { Component, Inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-print',
  templateUrl: './print.page.html',
  styleUrls: ['./print.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PrintPage implements OnInit {

  menuOpen: boolean = false
  servers: any[] = []
  name!: string
  salePoint!: SalePoint

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
    this.getSalePoints()
    this.getServers()
  }

  getSalePoints(){
    this.salePointSrv.getPoints().subscribe({
      next: (points) => {
        this.salePoints = points
        console.log(points)
      },
      error: (error) => {
        console.log(error)
      }
    })
  }


  getServers(){
    this.configSrv.getPrintServers().subscribe({
      next: (response) => {
        this.servers = response.servers
        console.log(this.servers)
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

getSalePoint(id: string){
  return this.salePoints.find(s => s._id === id)?.name
}

    async addServer(){
      const points = this.salePoints.map(s => s.name)
      console.log(points)
      const data = await this.actionSheetService.openAdd(PrintModalPage, points, 'small-two')
      console.log(data)
      if(data){
        const server = {
          locatie: environment.LOC,
          salePoint: this.salePoints.find(s => s.name === data.salePoint)?._id,
          name: data.name,
          key: this.randomSrv.generateRandomHexString(3)
        }
        console.log(server)
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
