import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-logo-page',
  templateUrl: './logo-page.page.html',
  styleUrls: ['./logo-page.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LogoPagePage implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('inside a logo page')
  }

}
