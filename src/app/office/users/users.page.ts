import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UsersService } from './users.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class UsersPage implements OnInit {

  userSearch: string = ''
  users: any = []

  constructor(
    private usersSrv: UsersService,
    private router: Router
      ) { }

  ngOnInit() {
    this.getUsers('', '')
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
