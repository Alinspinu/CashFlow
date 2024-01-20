import { CommonModule } from '@angular/common';
import { Component, EnvironmentInjector, inject, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
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

  user!: User | null

  constructor(
    private authSrv: AuthService
  ) {}

ngOnInit(): void {
  getUserFromLocalStorage().then(user => {
    this.user = user
  })
}
}
