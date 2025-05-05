import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { CashControlService } from '../../cash-control.service';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { cigarsInv } from 'src/app/models/inventary.model';
import { formatedDateToShow } from 'src/app/shared/utils/functions';
import { InvPage } from './inv/inv.page';

@Component({
  selector: 'app-invs',
  templateUrl: './invs.page.html',
  styleUrls: ['./invs.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class InvsPage implements OnInit {

  constructor(
    @Inject(ActionSheetService) private actionService: ActionSheetService,
    private cashService: CashControlService,
    private modalCtrl: ModalController,
    private navParams: NavParams,
  ) { }

  invs: cigarsInv[] = []

  ngOnInit() {
    const pointId = this.navParams.get('options')
    if(pointId){
      this.getInvs(pointId)
    }
  }



  close(){
    this.modalCtrl.dismiss(null)
  }


  getInvs(p: string){
    this.cashService.getLastCigInv('all', p).subscribe({
      next: (response) => {
        this.invs = response
        let name = ''
        let sum = 0
        for(let inv of this.invs){
          sum += inv.products[2].sale
          name = inv.products[2].name
        }
      }
    })
  }

  async showInvs(inv: any){
    const rsp = await this.actionService.openAdd(InvPage, inv, 'medium-two')
  }

  formatDate(date: any) {
    return formatedDateToShow(date)
  }

}
