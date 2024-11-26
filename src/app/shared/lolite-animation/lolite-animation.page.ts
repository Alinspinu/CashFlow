import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-lolite-animation',
  templateUrl: './lolite-animation.page.html',
  styleUrls: ['./lolite-animation.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoliteAnimationPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
