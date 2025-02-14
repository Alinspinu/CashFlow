import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { reportUser, reportUsers } from 'src/app/models/report.model';
import { UsersViewPage } from 'src/app/modals/users-view/users-view.page';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { roundOne } from 'src/app/shared/utils/functions';

@Component({
  selector: 'app-empl',
  templateUrl: './empl.page.html',
  styleUrls: ['./empl.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class EmplPage implements OnInit {

  reportUsers!: reportUsers


  constructor(
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
    private navParams: NavParams,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.getSection()
  }


  getSection(){
    const data = this.navParams.get('options')
    if(data) this.reportUsers = data
  }

  close(){
    this.modalCtrl.dismiss(null)
  }


  async showUsers(users: any, mode: string, total: number){
    const data = {
      users,
      mode,
      total
    }
    await this.actionSheet.openAdd(UsersViewPage, data, 'small-one')
  }


  roundInHtml(num: number) {
    return roundOne(num)
  }

}
