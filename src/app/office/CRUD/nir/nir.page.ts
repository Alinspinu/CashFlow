import { Component, OnInit} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AddIngPage } from './add-ing/add-ing.page';
import { AddNirPage } from './add-nir/add-nir.page';


@Component({
  selector: 'app-nir',
  templateUrl: './nir.page.html',
  styleUrls: ['./nir.page.scss'],
  standalone: true,
  imports: [IonicModule, AddIngPage, AddNirPage]
})
export class NirPage implements OnInit {



  constructor() { }

  ngOnInit() {}


}
