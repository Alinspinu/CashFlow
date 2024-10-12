import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-start-url',
  templateUrl: './start-url.page.html',
  styleUrls: ['./start-url.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class StartUrlPage implements OnInit {


  selectedUrl!: string
  constructor(
    private modalCtrl: ModalController
  ) { }


  localUrl: string = 'http://localhost:8080/'
  onlineUrl: string = 'https://cafetish-server.ew.r.appspot.com/'

  ngOnInit() {
  }




  onSubmit(){
    if(this.selectedUrl){
      this.modalCtrl.dismiss(this.selectedUrl)
    } else {
      this.modalCtrl.dismiss(null)
    }
  }
}
