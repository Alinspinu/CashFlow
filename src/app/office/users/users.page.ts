import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UsersService } from './users.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class UsersPage implements OnInit, OnDestroy {

  userSearch: string = ''
  users: any = []

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


  ngOnInit() {
    // this.getUsers('', '')
  }

  onSelectUser(ev: CustomEvent){
    this.getUsers(ev.detail.value, '');
  }

  searchProduct(ev: CustomEvent){
   this.getUsers('', ev.detail.value)
  }

  getUsers(filter:string, search: string){
    this.usersSrv.getUsers(filter, search).subscribe(response => {
      this.users = response
    } )
  }

  goUserPage(userId: string){
    this.router.navigateByUrl(`/tabs/user-content/${userId}`)
  }

}
