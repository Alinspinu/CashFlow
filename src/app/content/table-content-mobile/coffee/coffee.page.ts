import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TabContentPage } from '../tab-content/tab-content.page';
import { HeaderContentPage } from '../header-content/header-content.page';

@Component({
  selector: 'app-coffee',
  templateUrl: './coffee.page.html',
  styleUrls: ['./coffee.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TabContentPage, HeaderContentPage]
})
export class CoffeePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
