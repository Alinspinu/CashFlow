import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';



@Component({
  selector: 'app-reports',
  templateUrl: 'reports.page.html',
  styleUrls: ['reports.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})


export class ReportsPage {
  constructor() {}
}
