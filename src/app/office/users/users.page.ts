import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UsersService } from './users.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subject, takeUntil, firstValueFrom } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import User from 'src/app/auth/user.model';
import { SpinnerPage } from 'src/app/modals/spinner/spinner.page';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { UserContentPage } from './user-content/user-content.page';


@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class UsersPage implements OnInit, OnDestroy {

  userSearch: string = ''
  users: User[] = []
  localUsers: User[] = []

  select: string = ''



  constructor(
    private usersSrv: UsersService,
    @Inject(ActionSheetService) private actionSheetService: ActionSheetService

      ) {}

    ngOnDestroy() {
  
    }

    async showUser(user: User){
      const usr = await this.actionSheetService.openAdd(UserContentPage, user, 'add-modal')
    }


    async filter(){
      const type = await this.actionSheetService.entryAlert(['Toți', 'Clienți', 'Angajați'], 'radio', 'Filtrează', 'Alege o opțiune', '', '')
      if(type === 'Angajați'){
        this.localUsers = this.users.filter(users => users.employee.active === true)
      } else if(type === 'Clienți'){
        this.localUsers = this.users.filter(users => users.employee.active === false)
      } else {
        this.localUsers = this.users
      }
    }

    addUser(){

    }




  ngOnInit() {
   this.getUsers()
  }


  searchUsersName(ev: CustomEvent){
    const searchInput = ev.detail.value
    this.localUsers = this.users.filter(users => users.name.toLowerCase().includes(searchInput.toLowerCase()))
  }

  searchUsersEmail(ev: CustomEvent){
    const searchInput = ev.detail.value
    this.localUsers = this.users.filter(users => users.email.toLowerCase().includes(searchInput.toLowerCase()))
  }


  getUsers(){
    this.usersSrv.usersSend$.subscribe(response => {
      if(response){
        this.users = response
        this.localUsers = this.users
      }
    })
  }



}
