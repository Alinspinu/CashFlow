
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import User from './auth/user.model';
import { ContentService } from './content/content.service';
import { WebRTCService } from './content/webRTC.service';
import { ActionSheetService } from './shared/action-sheet.service';
import { TablesService } from './tables/tables.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']

})
export class AppComponent implements OnInit, OnDestroy {

  user!: User


  private contentSub!: Subscription;


  constructor(
    private contService: ContentService,
    private tablesService: TablesService,
    @Inject(ActionSheetService) private actSrv: ActionSheetService,
    private webRTC: WebRTCService
    ) {}


    getUser(){
      Preferences.get({key: 'authData'}).then(data  => {
        if(data.value) {
         this.user = JSON.parse(data.value)
        this.contentSub = this.contService.getData(this.user.locatie).subscribe()
        this.tablesService.getTables(this.user.locatie, this.user._id)
        //  this.getIncommingOrders()
         this.getUpdatedOrder()
         this.removeLive()
        //  this.tablesService.getOrderMessage(this.user.locatie, this.user._id)
        }
      })
    }




    getUpdatedOrder(){
      this.webRTC.getUpdatedOrderObservable().subscribe(order => {
        if(order){
          const parsedOrder = JSON.parse(order)
          this.tablesService.updateOrder(parsedOrder)
        }
      })
    }



    removeLive(){
      this.webRTC.getTableBillIdObservable().subscribe(response => {
        if(response) {
          const pasedData = JSON.parse(response)
          this.tablesService.removeLive(pasedData.number, pasedData.id)
        }
      })
    }

    getThemeStatus(){
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      this.toggleTheme(prefersDark.matches);
      prefersDark.addListener((mediaQuery) => this.toggleTheme(mediaQuery.matches));
    }

    toggleTheme(isDarkMode: boolean) {
      document.body.classList.toggle('dark-theme', isDarkMode);
      document.body.classList.toggle('light-theme', !isDarkMode);
    }

    ngOnInit(): void {
      this.getThemeStatus()
      this.getUser()
    }

    ngOnDestroy(): void {
        if(this.contentSub){
          this.contentSub.unsubscribe()
        }
    }



}
