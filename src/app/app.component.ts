
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import User from './auth/user.model';
import { ContentService } from './content/content.service';
import { CashRegisterService } from './office/cash-register/cash-register.service';
import { TablesService } from './tables/tables.service';
import { Subscription } from 'rxjs';
import { StartUrlPage } from './modals/start-url/start-url.page';
import { ActionSheetService } from './shared/action-sheet.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']

})
export class AppComponent implements OnInit, OnDestroy {

  user!: User

  private contSub!: Subscription

  constructor(
    private contService: ContentService,
    private tablesService: TablesService,
    private cashReg: CashRegisterService,
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
    private router: Router,
    ) {}


    getUser(){
      Preferences.get({key: 'authData'}).then(data  => {
        if(data.value) {
         this.user = JSON.parse(data.value)
         this.contSub = this.contService.getData(this.user.locatie).subscribe()
         this.tablesService.getTables(this.user.locatie, this.user._id)
         this.cashReg.getDocuments(1, this.user.locatie).subscribe()
        }
      })
    }

    async selectServerUrl(){
      Preferences.get({key: 'serverUrl'}).then( async (data)  => {
        if(!data.value) {
          const url = await this.actionSheet.openAuth(StartUrlPage)
          if(url){
            Preferences.set({key: 'serverUrl', value: url });
            this.getUser()
          }
        } else {


        }
      })
    }


  ngOnInit(): void {
    this.getUser()
  }

  ngOnDestroy(): void {
      if(this.contSub){
        this.contSub.unsubscribe()
      }
  }



}
