import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UsersService } from './users.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subject, takeUntil, firstValueFrom } from 'rxjs';
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
  users: User[] = []
  user!: User
  localUsers: User[] = []

  select: string = ''


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
            if(this.select === 'employees'){
              this.localUsers = this.users.filter(users => users.employee.active === true)
            } else if(this.select === 'users'){
              this.localUsers = this.users.filter(users => users.employee.active === false)
            } else {
              this.localUsers = this.users
            }
          }
        });

      }

    ngOnDestroy() {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }


    filter(){

    }

    addUser(){

    }


getUser(){
  Preferences.get({key: 'authData'}).then(data  => {
    if(data.value) {
     this.user = JSON.parse(data.value)
    } else{
      this.router.navigateByUrl('/auth')
    }
  })
}


  ngOnInit() {
   this.getUser()
   this.getUsers()
  }

  onSelectUsers(ev: CustomEvent){
    const select = ev.detail.value
    this.select = select
    if(select === 'employees'){
      this.localUsers = this.users.filter(users => users.employee.active === true)
    } else if(select === 'users'){
      this.localUsers = this.users.filter(users => users.employee.active === false)
    } else {
      this.localUsers = this.users
    }
  }

  searchUsers(ev: CustomEvent){
    const searchInput = ev.detail.value
    this.localUsers = this.users.filter(users => users.name.toLowerCase().includes(searchInput.toLowerCase()))
  }

  getUsers(){
    this.usersSrv.usersSend$.subscribe(response => {
      if(response){
        this.users = response
        this.localUsers = this.users
      }
    })
  }

  goUserPage(userId: string){
    this.router.navigateByUrl(`/user-content/${userId}`)
  }

}
