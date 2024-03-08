import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { Suplier } from '../../../models/suplier.model';
import { SuplierService } from './suplier.service';
import { showToast, triggerEscapeKeyPress } from 'src/app/shared/utils/toast-controller';
import { ActivatedRoute, Router } from '@angular/router';
import { getUserFromLocalStorage } from 'src/app/shared/utils/functions';
import User from 'src/app/auth/user.model';
import { NirService } from '../nir/nir.service';

@Component({
  selector: 'app-suplier',
  templateUrl: './suplier.page.html',
  styleUrls: ['./suplier.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, FormsModule]
})
export class SuplierPage implements OnInit {

  suplierForm!: FormGroup
  suplier!: Suplier
  iconSrc: string = 'assets/icon/eye-outline.svg'

  mode!: any
  size: string = '12'
  user!: User
  supliers!: any
  furnizorSearch: string = ''

  saveSuplier: boolean = true
  suplierId: string = ''

  showPassword = false;
  checkedTerms: boolean = false;
  enableRegister: boolean = false;
  passwordControl!: AbstractControl | any;
  confirmPasswordControl!: AbstractControl | any;

  constructor(
   private suplierSrv: SuplierService,
   private toastCtrl: ToastController,
   private modalCtrl: ModalController,
   private fb: FormBuilder,
   private router: Router,
   private route: ActivatedRoute,
   private nirSrv: NirService,
  ) {
    this.suplierForm = fb.group({
      ownerEmail: fb.control('', [Validators.required]),
      ownerName: fb.control('', [Validators.required]),
      tel: fb.control('', [Validators.required]),
      password: fb.control('', [Validators.required]),
      confirmPassword: fb.control('', [Validators.required]),
      name: fb.control('', [Validators.required]),
      bussinessName: fb.control('', [Validators.required]),
      vatNumber: fb.control('', [Validators.required]),
      register: fb.control('', [Validators.required]),
      address: fb.control('', [Validators.required]),
      VAT: fb.control('', [Validators.required]),
      bank: fb.control('', [Validators.required]),
      account: fb.control('', [Validators.required]),
    });

    this.passwordControl = this.suplierForm.get('password');
    this.confirmPasswordControl = this.suplierForm.get('confirmPassword');
    this.suplierForm.addValidators(
      this.createCompareValidator(this.passwordControl, this.confirmPasswordControl));
   };

   selectSuplier(suplier: any){
    console.log(suplier)
    if(suplier){
      this.suplierForm.get('bussinessName')?.setValue(suplier.name)
      this.suplierForm.get('vatNumber')?.setValue(suplier.vatNumber)
      this.suplierForm.get('register')?.setValue(suplier.register)
      this.suplierForm.get('address')?.setValue(suplier.address)
      this.suplierForm.get('bank')?.setValue(suplier.bank)
      this.suplierForm.get('account')?.setValue(suplier.account)
      this.suplierId = suplier._id
      this.supliers = []
      this.furnizorSearch = ''
      this.saveSuplier = false
    }
  }


     validateForm() {
      this.suplierForm.reset();
      const passwordControl = this.suplierForm.get('password');
      const confirmPasswordControl = this.suplierForm.get('confirmPassword');
      const usernameControl = this.suplierForm.get('ownerName');
      const telControl = this.suplierForm.get('tel');
      const name = this.suplierForm.get('name');
      const email = this.suplierForm.get('ownerEmail');

      if (passwordControl && confirmPasswordControl && usernameControl && telControl && name && email) {
        confirmPasswordControl.setValidators(Validators.required);
        passwordControl.setValidators(Validators.required);
        if(!this.mode){
        confirmPasswordControl.setValidators([]);
        passwordControl.setValidators([]);
        usernameControl.setValidators([]);
        telControl.setValidators([]);
        name.setValidators([])
        email.setValidators([])
      }
      confirmPasswordControl.updateValueAndValidity();
      passwordControl.updateValueAndValidity();
      usernameControl.updateValueAndValidity();
      telControl.updateValueAndValidity();
      name.updateValueAndValidity()
      }

      if(this.suplierForm.valid && this.checkedTerms){
        this.enableRegister = true
      } else {
        this.enableRegister = false
      }
    }


  togglePassword(){
    this.showPassword = !this.showPassword;
    this.iconSrc = this.showPassword ? 'assets/icon/eye-outline.svg' : 'assets/icon/eye-off-outline.svg';
  };

    goTerms(){
      // this.router.navigateByUrl('/terms')
      triggerEscapeKeyPress()
    }

    checked(event: any){
      if(this.suplierForm.valid && event.detail.checked){
        this.enableRegister = true
        this.checkedTerms = true
      } else if(event.detail.checked){
        this.checkedTerms = true
      } else {
        this.enableRegister= false
        this.checkedTerms = false
      }
    }

    createCompareValidator(control: AbstractControl, controlTwo: AbstractControl) {
      return () => {
      if (control.value !== controlTwo.value)
        return { match_error: 'Value does not match' };
      return null;
    };

  };

  getInputType() {
    return this.showPassword ? 'text' : 'password';
  };

  ngOnInit() {
    this.getUser()
    this.getMode()
    this.validateForm()
  }

  getUser(){
    getUserFromLocalStorage().then(user => {
      if(user){
        this.user = user
      } else{
        this.router.navigateByUrl('/auth')
      }
    })
  }

  getMode(){
    const mode = this.route.snapshot.paramMap.get('value')
    console.log(mode)
    if(mode){
      this.mode = mode
      this.size = '6'
    }

  }
  searchSuplier(){
    const vatNumber = this.suplierForm.value.vatNumber
    if(vatNumber){
      this.suplierSrv.getSuplierInfo(vatNumber).subscribe((response: any) => {
        if(response){
          if(response.status === 200){
            this.suplierForm.get('bussinessName')?.setValue(response.data.nume);
            this.suplierForm.get('register')?.setValue(response.data.cod_inmatriculare);
            this.suplierForm.get('address')?.setValue(response.data.adresa);
          } else if(response.status === 402){
            showToast(this.toastCtrl, response.message, 4000)
          }
          }
      }, (err: any) => {
        console.log(err)
      })
    }
  }

  addSuplier(){
    if(this.suplierForm.valid && this.saveSuplier){
      const suplier: Suplier = {
        name: this.suplierForm.value.name,
        bussinessName: this.suplierForm.value.bussinessName,
        vatNumber: this.suplierForm.value.vatNumber,
        register: this.suplierForm.value.register,
        address: this.suplierForm.value.address,
        bank: this.suplierForm.value.bank ? this.suplierForm.value.bank : '',
        account: this.suplierForm.value.account ? this.suplierForm.value.account : '',
        VAT: this.suplierForm.value.VAT === 'yes'? true : false,
      }

        this.suplierSrv.saveSuplier(suplier, this.mode, this.user.locatie).subscribe((response: any) => {
          if(response){
            if(this.mode ){
              const user = {
                name: this.suplierForm.value.ownerName,
                email: this.suplierForm.value.ownerEmail,
                telephone: this.suplierForm.value.tel,
                admin: 1,
                locatie: response.id,
                status: 'active',
                employee: {
                  fullName: this.suplierForm.value.ownerName,
                  position: "Administrator",
                  access: 3
                }
              }
              const second = {
                password: this.suplierForm.value.password,
                confirmPassword: this.suplierForm.value.confirmPassword
              }
              this.suplierSrv.saveAdmin(user, second).subscribe(response => {
                if(response){
                  showToast(this.toastCtrl, response.message, 2000)
                }
              })
            } else {
              showToast(this.toastCtrl, response.message, 400)
              this.suplierForm.reset()
              this.modalCtrl.dismiss(response.suplier)
            }
          }
        }, (err: any) =>{
          console.log(err)
          showToast(this.toastCtrl, err.message, 4000)
        })

    } else if(!this.saveSuplier) {
      const suplier = {
        name: this.suplierForm.value.name,
        bussinessName: this.suplierForm.value.bussinessName,
        vatNumber: this.suplierForm.value.vatNumber,
        register: this.suplierForm.value.register,
        address: this.suplierForm.value.address,
        bank: this.suplierForm.value.bank ? this.suplierForm.value.bank : '',
        account: this.suplierForm.value.account ? this.suplierForm.value.account : '',
        _id: this.suplierId
      }
      this.modalCtrl.dismiss(suplier)

    }

  }

  searchSuplierInDb(ev: any){
    const input = ev.detail.value
    this.nirSrv.getSuplier(input, this.user.locatie).subscribe(response => {
      this.supliers = response
      if(input === ''){
        this.supliers = []
      }
    })
  }




  //  setUpForm(){
  //   this.suplierForm = new FormGroup({
  //     name: new FormControl(null, {
  //       updateOn: 'change',
  //     }),
  //     bussinessName: new FormControl(null, {
  //       updateOn: 'change',
  //       validators: [Validators.required]
  //     }),
  //     vatNumber: new FormControl(null, {
  //       updateOn: 'change',
  //       validators: [Validators.required]
  //     }),
  //     register: new FormControl(null, {
  //       updateOn: 'change',
  //       validators: [Validators.required]
  //     }),
  //       address: new FormControl(null, {
  //       updateOn: 'change',
  //       validators: [Validators.required]
  //     }),
  //       VAT: new FormControl(null, {
  //       updateOn: 'change',
  //       validators: [Validators.required]
  //     }),
  //       bank: new FormControl(null, {
  //       updateOn: 'change',
  //     }),
  //       account: new FormControl(null, {
  //       updateOn: 'change',
  //     }),
  //   })
  // }

}
