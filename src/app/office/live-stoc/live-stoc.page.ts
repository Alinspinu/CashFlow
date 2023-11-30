import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-live-stoc',
  templateUrl: './live-stoc.page.html',
  styleUrls: ['./live-stoc.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LiveStocPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
