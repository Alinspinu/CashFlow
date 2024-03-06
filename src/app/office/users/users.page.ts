import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UsersService } from './users.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import User from 'src/app/auth/user.model';
import { SpinnerPage } from 'src/app/modals/spinner/spinner.page';


@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SpinnerPage]
})
export class UsersPage implements OnInit, OnDestroy {

  userSearch: string = ''
  users: any = []
  user!: User

  private unsubscribe$ = new Subject<void>();

  constructor(
    private usersSrv: UsersService,
    private router: Router,
    private activatedRoute: ActivatedRoute
      ) {
        this.router.events
        .pipe(
          filter(event => event instanceof NavigationEnd),
          takeUntil(this.unsubscribe$)
        )
        .subscribe(() => {
          if (this.activatedRoute.snapshot.routeConfig?.path === 'users') {
            this.getUsers('', '')
          }
        });

      }

    ngOnDestroy() {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }


getUser(){
  Preferences.get({key: 'authData'}).then(data  => {
    if(data.value) {
     this.user = JSON.parse(data.value)
     console.log(this.user)
    } else{
      this.router.navigateByUrl('/auth')
    }
  })
}


  ngOnInit() {
   this.getUser()
  }

  onSelectUser(ev: CustomEvent){
    this.getUsers(ev.detail.value, '');
  }

  searchProduct(ev: CustomEvent){
   this.getUsers('', ev.detail.value)
  }

  getUsers(filter:string, search: string){
    setTimeout(() => {
      this.usersSrv.getUsers(filter, search, this.user.locatie).subscribe(response => {
        this.users = response
      } )
    }, 200)
  }

  goUserPage(userId: string){
    this.router.navigateByUrl(`/tabs/user-content/${userId}`)
  }

}
