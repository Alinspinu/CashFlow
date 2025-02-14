import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavParams, ModalController } from '@ionic/angular';
import { roundOne } from '../../shared/utils/functions';
import { CapitalizePipe } from 'src/app/shared/utils/capitalize.pipe';


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
  imports: [IonicModule, CommonModule, FormsModule, CapitalizePipe]
})
export class UsersViewPage implements OnInit {

  total: number = 0
  users!: user[]
  mode: string = ''

  constructor(
    private navPar: NavParams,
    private modalCtrl: ModalController
  ) { }



  ngOnInit() {
    const data =  this.navPar.get('options')
   this.users =  data.users
   this.total = data.total
   this.mode = data.mode
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
