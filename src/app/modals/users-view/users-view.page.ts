import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavParams, ModalController } from '@ionic/angular';
import { roundOne } from '../../shared/utils/functions';


 interface user {
  baseIncome: number
  baseTax: number,
  bonus: number,
  hourIncome: number,
  hours: number,
  monthHours: number,
  name: string,
  position: string,
  taxValue: number,
  totalIncome: number,
}

@Component({
  selector: 'app-users-view',
  templateUrl: './users-view.page.html',
  styleUrls: ['./users-view.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class UsersViewPage implements OnInit {


  users!: user[]
  mode!: boolean

  constructor(
    private navPar: NavParams,
    private modalCtrl: ModalController
  ) { }



  ngOnInit() {
   this.users =  this.navPar.get('options')
   this.mode = this.navPar.get('sub')
  }



  close(){
    this.modalCtrl.dismiss()
  }

  showUser(user: user){

  }

  roundInHtml(num: number){
    return roundOne(num)
  }

}
