import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { ActionSheetService } from '../shared/action-sheet.service';
import { showToast } from '../shared/utils/toast-controller';
import { Table } from './table.model';
import { TablesService } from './tables.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tables.page.html',
  styleUrls: ['tables.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})

export class TablesPage implements OnInit {

  tables!: Table[]

  editMode: boolean = false

  constructor(
    private router: Router,
    private tableServ: TablesService,
    private toastCtrl: ToastController,
    private actionSheet: ActionSheetService,
    private authSrv: AuthService,
    ) {}

ngOnInit(): void {
  this.getTables()
}

getTables(){
  this.tableServ.tableSend$.subscribe(response => {
    this.tables = response
  })
}


  openTable(num: number){
    this.router.navigateByUrl(`table-content/${num}`)
  }

  async addTable(){
    await this.actionSheet.addMainCat().then(response => {
       let name  = ''
       if(response){
       name = response[0]
       }
      this.tableServ.addTable(name).subscribe(response => {
        if(response){
          showToast(this.toastCtrl, response.message, 4000)
        }
      }, err => {
        showToast(this.toastCtrl, err, 4000)
      })
    })

  }

  activateEditMode(){
    this.editMode = !this.editMode
  }

   async editTable(tableIndex: number){
    await this.actionSheet.addMainCat().then(response => {
      if(response){
        this.tableServ.editTable(tableIndex, response[0]).subscribe(response => {
          if(response){
            console.log(response)
            showToast(this.toastCtrl, response.message, 4000)
          }
        }, err => {
          console.log(err)
          showToast(this.toastCtrl, err, 4000)
        })
      }
    })
  }

 async deleteTable(table: Table){
   const  message = table.name ? table.name : table.index
    const confirm = await this.actionSheet.deleteAlert(`Ești sigur ca vrei să ștergi masa ${message}`)
    if(confirm){
      this.tableServ.deleteTable(table._id, table.index).subscribe(response => {
        showToast(this.toastCtrl, response.message, 4000)
      })
    }
  }

  logout(){
    this.authSrv.logout()
    this.router.navigate(['/auth'])
  }

}
