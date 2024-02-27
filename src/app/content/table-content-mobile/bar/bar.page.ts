import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TabContentPage } from '../tab-content/tab-content.page';
import { HeaderContentPage } from '../header-content/header-content.page';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.page.html',
  styleUrls: ['./bar.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TabContentPage, HeaderContentPage]
})
export class BarPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
