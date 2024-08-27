import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-select-data',
  templateUrl: './select-data.page.html',
  styleUrls: ['./select-data.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SelectDataPage implements OnInit {

  title: string = '';
  searchPlaceholder: string = 'Caută'
  choise: string[] = []
  mode!: string;

  selectedValue!: string

  data: string[] = []
  users: any[] = []
  dataa: string[] = []
  userss: any[] = []

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.getData()
  }

  getData(){
   this.mode = this.navParams.get('mode')
   if(this.mode === 'bonus'){
   const names = this.navParams.get('options')
    names.forEach((name: any) => {
      const user = {
        name: name,
        checked: false
      }
      this.users.push(user)
    })
    this.userss = this.users
    // this.users = this.userss

   } else {
    this.dataa = this.navParams.get('options')
    this.data = this.dataa
   }
  }

  searchData(ev: any){
    const input = ev.detail.value
    if(this.mode === 'bonus'){
      this.users = this.userss.filter(user => user.name.toLowerCase().includes(input.toLowerCase()))
    } else {
      this.data = this.dataa.filter(name => name.toLowerCase().includes(input.toLowerCase()))
    }
  }

  onChange(ev: any, user: any){
    if(ev.detail.checked){
      user.checked = true
      const index = this.userss.findIndex(usr => usr.name === user.name)
      this.userss[index].checked = true
      this.choise.push(user.name)
    } else {
      const index = this.choise.findIndex(str => str = user.name)
      this.choise.splice(index, 1)
    }
  }

  onSubmit(){
    if(this.mode === 'bonus'){
      this.modalCtrl.dismiss(this.choise)
    } else{
      this.modalCtrl.dismiss(this.selectedValue)
    }
  }

  close(){
    this.modalCtrl.dismiss(null)
  }
}
