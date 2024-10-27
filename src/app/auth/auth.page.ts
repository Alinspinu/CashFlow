import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';

import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';
import { Preferences } from '@capacitor/preferences';
import { showToast, triggerEscapeKeyPress } from '../shared/utils/toast-controller';
import { ActionSheetService } from '../shared/action-sheet.service';
import { RegisterPage } from './register/register.page';
import { TablesService } from '../tables/tables.service';
import { jwtDecode } from 'jwt-decode';
import { SpinnerPage } from '../modals/spinner/spinner.page';


export interface AuthResData {
  token: string,
  name: string,
};



@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, SpinnerPage]
})
export class AuthPage implements OnInit {

  isLoading = false;
  form!: FormGroup;
  showPassword = false;
  tab!: string;
  resetPassword: boolean = false;
  resetPasswordMode: boolean = false;
  emailValue!: string;
  validEmail: boolean = false;
  disableLogIn: boolean = false;

  returnUrl: string = '/sale/tables'

  iconSrc: string = 'assets/icon/eye-outline.svg'

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private tableSrv: TablesService,
    private route: ActivatedRoute,
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
  ) { }


  triggerEscape(){
    this.modalCtrl.dismiss()
  }
  getCurrentTab() {
    const currentTab = window.location.href;
    const indexTab = currentTab.lastIndexOf('/');
    const tab = currentTab.slice(indexTab +1);
    return this.tab = tab;
  }

  togglePassword(){
    this.showPassword = !this.showPassword;
    this.iconSrc = this.showPassword ? 'assets/icon/eye-outline.svg' : 'assets/icon/eye-off-outline.svg';
  }

  getInputType() {
    return this.showPassword ? 'text' : 'password';
  }



  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/tabs/tables';
    this.getCurrentTab();
    this.form = new FormGroup({
      email: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      password: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
    });
  };


  onSubmit(){
    this.isLoading = true
    const email = this.form.value.email;
    const password = this.form.value.password;
    this.disableLogIn = true
    this.authService.onLogin(email, password).subscribe(res => {
      if(res){
        this.form.reset()
        this.isLoading = false
      }
      if(res.message === 'Email sent'){
        const data = JSON.stringify({
          name: res.user.name,
          email: res.user.email,
          id: res.user.id,
          message: 'Adresa de email nu a fost verificată!',
          text: 'confirmare',
        });
        Preferences.set({key: 'tempUserData', value: data });
        this.disableLogIn = false
        this.router.navigateByUrl('/tabs/tables');
      } else {
        const id: any = jwtDecode(res.token);
        this.tableSrv.getTables(res.locatie, id.userId)
        this.disableLogIn = false
        this.router.navigateByUrl(this.returnUrl);
      }
    }, error => {
      this.disableLogIn = false
      if(error.status === 401){
        this.isLoading = false
        showToast(this.toastCtrl, 'Nume sau parola incorectă!', 5000);
        setTimeout(() => {
          this.resetPassword = true;
        }, 600);
      };
    });

  };

  onResetPassword(){
    this.resetPasswordMode = true;
  }


  isEmailValid(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  validateEmail(){
    this.isEmailValid(this.emailValue) ? this.validEmail = true : this.validEmail = false;
  }

  sendNewPassword(){
    this.isLoading = true
    this.authService.sendResetEmail(this.emailValue).subscribe(res => {
      if(res){
        const data = JSON.stringify({
          name: res.user.name,
          email: res.user.email,
          id: res.user.id,
          message: 'Resetare Parola',
          text: 'resetare a parolei',
        })
        this.isLoading = false
        Preferences.set({key: 'tempUserData', value: data });
        this.router.navigateByUrl('/email-sent');
        triggerEscapeKeyPress();
      }
    }, error => {
      this.isLoading = false
      console.log('error', error);
      if(error.status === 404){
        showToast(this.toastCtrl, error.error.message, 4000 );
      };
    });
  };


  onRegister(){
    this.actionSheet.openAuth(RegisterPage);
  };
};
