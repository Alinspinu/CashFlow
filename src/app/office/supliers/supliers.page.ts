import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController, ToastController } from '@ionic/angular';
import { SupliersService } from './supliers.service';
import { Suplier } from 'src/app/models/suplier.model';
import { formatedDateToShow, round } from '../../shared/utils/functions';
import { showToast } from 'src/app/shared/utils/toast-controller';
import { ActionSheetService } from '../../shared/action-sheet.service';
import { SuplierPage } from '../CRUD/suplier/suplier.page';
import { SuplierRecordsPage } from './suplier-records/suplier-records.page';

@Component({
  selector: 'app-supliers',
  templateUrl: './supliers.page.html',
  styleUrls: ['./supliers.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SupliersPage implements OnInit {

  supliers!: Suplier[]
  localSupliers!: Suplier[]
  suplierSearch!: string

  menuOpen: boolean = false

  constructor(
    private suplierSrv: SupliersService,
    private menuCtrl: MenuController,
    private toastCtrl: ToastController,
    @Inject(ActionSheetService) private actionSht: ActionSheetService
  ) { }

  ngOnInit() {
    this.menuChange()
    this.getSupliers()
    this.addSuplier()
  }


  getSupliers(){
    this.suplierSrv.getSupliers().subscribe(supliers => {
      if(supliers){
        this.supliers = supliers
        this.localSupliers = supliers.sort((a,b) => a.name.localeCompare(b.name))
      }
    })
  }




  addSuplier(){

  }



  searchSuplier(ev: any){
    const input = ev.detail.value
    let filterData = this.localSupliers.filter((object) =>
    object.name.toLocaleLowerCase().includes(input.toLocaleLowerCase()))
    this.localSupliers = filterData
    if(!input.length){
      this.localSupliers = [ ...this.supliers]
    }
  }

  async openRecords(id: string){
    await this.actionSht.openAdd(SuplierRecordsPage, id, 'medium')

  }

 async editSuplier(suplier: Suplier, index: number){
    const newSuplier = await this.actionSht.openModal(SuplierPage, {suplier: suplier}, false)
    if(newSuplier){
      this.suplierSrv.editSuplier(suplier._id, newSuplier).subscribe(response => {
        if(response){
          showToast(this.toastCtrl, response.message, 3000)
          this.localSupliers[index] = response.suplier
        }
      })
    }
  }


  async deleteSuplier(id: string, index: number){
    const response = await this.actionSht.deleteAlert('Ești sigur că vrei să ștergi furnozorul?', 'Șterge furnizor')
    if(response){
      this.suplierSrv.deleteSuplier(id).subscribe(response => {
        if(response){
          showToast(this.toastCtrl, response.message, 3000)
          this.localSupliers.splice(index, 1)
        }
      })
    }

  }

  formatedDate(date: string){
    return formatedDateToShow(date).split('ora')[0]
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

  roundInHtml(num: number){
    return round(num)
  }

}
