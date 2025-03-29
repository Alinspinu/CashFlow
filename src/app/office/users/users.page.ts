import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController, ToastController } from '@ionic/angular';
import { UsersService } from './users.service';
import User from 'src/app/auth/user.model';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { UserContentPage } from './user-content/user-content.page';
import { NewPage } from './new/new.page';
import { showToast } from 'src/app/shared/utils/toast-controller';


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

  menuOpen: boolean = false



  constructor(
    private usersSrv: UsersService,
    @Inject(ActionSheetService) private actionSheetService: ActionSheetService,
    @Inject(MenuController) private menuCtrl: MenuController,
    private toastCtrl: ToastController,
      ) {}

    ngOnDestroy() {

    }

    async showUser(userId: string){
      const usr = await this.actionSheetService.openAdd(UserContentPage, userId, 'add-modal')
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

   async addUser(){
      const data = await this.actionSheetService.openAdd(NewPage, 'register', 'small-two')
      this.usersSrv.addUser(data).subscribe({
        next: (response) => {
          showToast(this.toastCtrl, response.message, 2000)
          console.log(response.user)
        },
        error: (error) => {
          console.log(error)
        }
      })
    }




  ngOnInit() {
   this.getUsers()
   this.menuChange()
  }

  private async menuChange(){
    const menu = await this.menuCtrl.get('start');
    if (menu) {
      menu.addEventListener('ionDidClose', () => {
        this.menuOpen = false
      });
      menu.addEventListener('ionDidOpen', () => {
           this.menuOpen = true
      });
    }
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
