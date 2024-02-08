import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ConfigService } from './config.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ConfigPage implements OnInit {

  locatie!: any;
  locId!: any;

  constructor(
    private configSrv: ConfigService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.getUser()

  }

  getUser(){
    this.auth.user$.subscribe(response => {
      if(response){
        response.subscribe(user => {
          if(user){
            this.locId = user.locatie
            this.getLoc()
          }
        })
      }
    })
  }


  getLoc(){
    if(this.locId){
      this.configSrv.fetchLocatie(this.locId).subscribe(response => {
        this.locatie = response
        console.log(this.locatie)
      })
    }
  }

}
