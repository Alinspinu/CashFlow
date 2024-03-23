
import { Component,  OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import User from './auth/user.model';
import { ContentService } from './content/content.service';
import { CashRegisterService } from './office/cash-register/cash-register.service';
import { IngredientService } from './office/ingredient/ingredient.service';
import { TablesService } from './tables/tables.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']

})
export class AppComponent implements OnInit {

  user!: User

  constructor(
    private contService: ContentService,
    private tablesService: TablesService,
    private cashReg: CashRegisterService,
    private ingsSrv: IngredientService,
    private router: Router,
    ) {}


    getUser(){
      Preferences.get({key: 'authData'}).then(data  => {
        if(data.value) {
         this.user = JSON.parse(data.value)
         this.contService.getData(this.user.locatie).subscribe()
         this.tablesService.getTables(this.user.locatie, this.user._id)
         this.cashReg.getDocuments(1, this.user.locatie).subscribe()
          this.ingsSrv.getIngredients({}, this.user.locatie).subscribe()
        //  this.tablesService.getOrderMessage(this.user.locatie, this.user._id)
        } else{
          this.router.navigateByUrl('/auth')
        }
      })
    }

  ngOnInit(): void {
   this.getUser()

  }



}
