import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-shared',
  templateUrl: './shared.page.html',
  styleUrls: ['./shared.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SharedPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
