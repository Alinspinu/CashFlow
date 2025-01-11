import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GbtService } from './gbt-image.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-gbt-image',
  templateUrl: './gbt-image.page.html',
  styleUrls: ['./gbt-image.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class GbtImagePage implements OnInit {

  message!: string

  size!: string;

  sizes: string[] = [
   '256x256', '512x512', '1024x1024', '1024x1792', '1792x1024'
  ]

  sendetMessage!: string

  imageUrl!: string

  constructor(
    private gbtSrv: GbtService,
    private http: HttpClient
  ) { }

  ngOnInit() {
  }




  sendMessage(){
    this.sendetMessage = this.message
    this.gbtSrv.getImage(this.message, this.size).subscribe({
      next: (response) => {
        this.imageUrl = response.imageUrl
        console.log(this.imageUrl)
        this.message = ''
      },
      error: (error) => {
        console.log(error)
      }
    })
  }


  @HostListener('document:keydown', ['$event'])
  handleKeyDown(ev: KeyboardEvent){
    if (ev.code === "Enter") {
      this.sendMessage()
    }

  }


  onSizeSelect(ev: any){
    if(ev.detail.value){
      this.size = ev.detail.value
    }
  }
}
