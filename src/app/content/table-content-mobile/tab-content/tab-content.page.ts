import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ContentService } from '../../content.service';
import { Category } from 'src/app/models/category.model';
import { Subscription } from 'rxjs';
import User from 'src/app/auth/user.model';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-tab-content',
  templateUrl: './tab-content.page.html',
  styleUrls: ['./tab-content.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink]
})
export class TabContentPage implements OnInit {

  isLoadding: boolean = true;
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  socialUrl!: string;
  categories!: Category[];
  isDarkMode!: boolean;
  currentCategory!: string;
  tabSubscription!: Subscription;
  userSub!: Subscription;
  user!: User;
  tableNumber!: number


  constructor(
    private contSrv: ContentService,
    private authSrv: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getTableNumber()
    this.getCurrentTab()
    this.getUser()
    this.fetchCategory()
  }

  getTableNumber(){
    const url = window.location.href;
    const tabs = url.split('/');
    const tab = tabs[4]
    return this.tableNumber = +tab
  }

  getCurrentTab() {
    const currentTab = window.location.href;
    const indexTab = currentTab.lastIndexOf('/');
    const tab = currentTab.slice(indexTab +1);
    return this.currentCategory = tab;
  };

  fetchCategory(){
    this.isLoadding = true;
    this.tabSubscription = this.contSrv.categorySend$.subscribe(res => {
      this.categories = [];
      console.log(this.currentCategory)
      if(res) {
        for(let category of res){
          if(category.mainCat === this.currentCategory){
            this.categories.push(category);
          }
        };
        this.isLoadding = false;
      }
    });
  };

  getUser(){
    this.userSub = this.authSrv.user$.subscribe((res: any ) => {
      if(res){
        res.subscribe((userData: any) => {
            this.user = userData;
            this.isLoggedIn = this.user.status === 'active' ? true : false;
            this.isAdmin = this.user.admin === 1 ? true : false;
        });
      };
    });
    };

  ngOnDestroy(): void {
    this.tabSubscription.unsubscribe();
  };

  detectColorScheme() {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.isDarkMode = darkModeMediaQuery.matches;
    console.log("is dark mode",this.isDarkMode);
    darkModeMediaQuery.addListener((event) => {
      this.isDarkMode = event.matches;
    });
  };


}
