import { CommonModule } from '@angular/common';
import { Component, EnvironmentInjector, HostListener, Inject, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, Platform, IonRouterOutlet, NavController} from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import User from '../auth/user.model';
import { getUserFromLocalStorage } from '../shared/utils/functions';


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class TabsPage implements OnInit{
  public environmentInjector = inject(EnvironmentInjector);
  screenWidth!: number

  user!: User | null

  constructor(
    private authSrv: AuthService,
    private router: Router,
     private navCtrl: NavController
  ) {
  }

  ngOnInit(): void {
  this.screenWidth = window.innerWidth
  getUserFromLocalStorage().then(user => {
    this.user = user
  })
}

@HostListener('document:keydown', ['$event'])
handleKeyDown(ev: KeyboardEvent){
  if (ev.altKey &&  ev.code === "KeyC") {
    this.router.navigateByUrl('/tabs/cash-control')
  }
  if (ev.altKey &&  ev.code === "KeyA") {
    this.router.navigateByUrl('/tabs/office/nir/new')
  }
  if(ev.altKey && ev.code === "KeyV"){
    this.router.navigateByUrl('/tabs/tables')
  }
  if(ev.altKey && ev.code === "KeyP"){
    this.router.navigateByUrl('/tabs/office/products')
  }
  if(ev.altKey && ev.code === "KeyN"){
    this.router.navigateByUrl('/tabs/office/nirs')
  }
  if(ev.altKey && ev.code === "KeyM"){
    this.router.navigateByUrl('/tabs/office/ingredient')
  }
  if(ev.altKey && ev.code === "KeyR"){
    this.router.navigateByUrl('/tabs/office/cash-register')
  }
  if(ev.altKey && ev.code === "KeyU"){
    this.router.navigateByUrl('/tabs/office/users')
  }
  if(ev.ctrlKey && ev.code === "KeyA"){
    this.router.navigateByUrl('/tabs/add-product/1')
  }
  if(ev.altKey && ev.code === "Backspace"){
    this.navCtrl.back()
  }

}


}
