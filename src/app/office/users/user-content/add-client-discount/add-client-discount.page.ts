import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import User from 'src/app/auth/user.model';
import { Router } from '@angular/router';
import { AddClientDiscountService } from './add-client-discount.service';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';

@Component({
  selector: 'app-add-client-discount',
  templateUrl: './add-client-discount.page.html',
  styleUrls: ['./add-client-discount.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class AddClientDiscountPage implements OnInit {


  form!: FormGroup
  data!: any
  user!: User

  categoriesSearch: string = ''
  discountsCats: any[] = []
  discountsToSave: any[] = []
  generalDiscount!: number
  cashBackProcent: number = 5

  setDiscountForAll: boolean = false

  deletedDiscounts: any [] = []
  categories: any [] = []


  baseDiscounts: {
    general: number,
    category: {
      cat: string,
      name: string,
      precent: number
    }[]
  } = {
    general: 50,
    category: [
      {
        cat: "64c8071c378605eb04628210",
        name: "BLACK COFFEE",
        precent: 100
      },
      {
        cat: "64c8074e378605eb04628212",
        name: "WITH MILK",
        precent: 100
      },
      {
        cat: "64be6a3e3ef7bd6552c84608",
        name: "PATISERIE",
        precent: 0
      },
      {
        cat: "64e08e29b8172e11bbd2eb80",
        name: "SOFT DRINKS",
        precent: 0
      },
      {
        cat: "64c8e34248b61f91a0d45e60",
        name: "BEER",
        precent: 0
      },
      {
        cat: "64e0ffdbed3e938e2230747a",
        name: "MERCH",
        precent: 0
      },
      {
        cat: "64e0ffbded3e938e22307477",
        name: "CIOCOLATA",
        precent: 0
      },
      {
        cat: "64e0fecaed3e938e22307471",
        name: "CAFEA ȘI CEAI PENTRU ACASĂ",
        precent: 0
      },
      {
        cat: "66103400a872beae03ee4913",
        name: "IQOS",
        precent: 0
      },
      {
        cat: "64be6a593ef7bd6552c8460a",
        name: "DESERT",
        precent: 0
      }
    ]
  }

  constructor(
    @Inject(ActionSheetService) private actioSrv: ActionSheetService,
    private modalCtrl: ModalController,
    private navPar: NavParams,
    private router: Router,
    private addDiscSrv: AddClientDiscountService,
  ) { }

  ngOnInit() {
  this.getData()
    this.getUser()
    this.setUpForm()
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
  getData(){
    const data = this.navPar.get('options');
    console.log(data)
    if(data && data.user){
      this.discountsCats = data.data.discount.category
      this.generalDiscount = data.data.discount.general
      this.cashBackProcent = data.data.cashBackProcent
    }
    if(data && !data.user) {
      this.setDiscountForAll = true
      this.discountsCats = data.data
    }
  }


  adBasDsicounts(){
    this.generalDiscount = this.baseDiscounts.general
    this.discountsCats = this.baseDiscounts.category
    this.form.get('generalDiscount')?.setValue(this.generalDiscount);
  }

  searchCategory(ev: any){
    let search = ev.detail.value
    this.addDiscSrv.searchCat(search, this.user.locatie).subscribe((response:any) => {
      if(response) {
        this.categories = response
      }
    })
  }

  deleteDiscount(index: number){
    this.deletedDiscounts.push(this.discountsCats[index])
    this.discountsCats.splice(index, 1)
  }


  setCat(){
    this.selectCat(this.categories[0])
  }

 async selectCat(cat: any){
   this.categoriesSearch = ''
   this.categories = []
   const qty = await this.actioSrv.pickDiscountValue()
   if(qty){
    const discountCat = {
      precent: +qty.discount,
      cat: cat._id,
      name: cat.name,
    }
    this.discountsCats.push(discountCat)
   }
  }

  setUpForm(){
    this.form = new FormGroup({
      generalDiscount: new FormControl(null, {
        updateOn: 'change',
      }),
      cashBackProcent: new FormControl(null, {
        updateOn: 'change',
      }),
    });
    if(this.generalDiscount){
      this.form.get('generalDiscount')?.setValue(this.generalDiscount);
    }
    if(this.cashBackProcent){
      this.form.get('cashBackProcent')?.setValue(this.cashBackProcent);
    }
  }

  onSubmit(){
    if(this.deletedDiscounts.length) {
      this.deletedDiscounts.forEach(el => el.precent = 0)
      const dataToSend = {
        category: this.deletedDiscounts
      }
      this.modalCtrl.dismiss(dataToSend)
    } else {
      const dataToSend = {
        general: +this.form.value.generalDiscount,
        category: this.discountsCats,
        cashBackProcent: this.form.value.cashBackProcent,
      }
      this.modalCtrl.dismiss(dataToSend)
    }
  }

  close(){
    this.modalCtrl.dismiss(null)
  }

}
