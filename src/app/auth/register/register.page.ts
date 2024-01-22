import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { showToast, triggerEscapeKeyPress } from 'src/app/shared/utils/toast-controller';


export interface Survey {
  food: string[],
  foodPrice: string[],
  coffee: string[],
  coffeePrice: string[]
}


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class RegisterPage implements OnInit {

  checkedTerms: boolean = false;
  enableRegister: boolean = false;
  isLoading = false;
  form!: FormGroup;
  showPassword = false;
  passwordControl!: AbstractControl | any;
  confirmPasswordControl!: AbstractControl | any;
  cart: string = '';
  showFood: boolean = false;
  showCoffee: boolean = false;
  register: boolean = true;
  showFoodPrice: boolean = false;
  showCoffeePrice: boolean = false;
  survey: any = []
  iconSrc: string = 'assets/icon/eye-outline.svg'



  constructor(
  private authService: AuthService,
  private router: Router,
  private fb: FormBuilder,
  private toastCtrl: ToastController,
  private modalCtrl: ModalController,
  ) {
    this.form = fb.group({
      email: fb.control('', [Validators.required]),
      name: fb.control('', [Validators.required]),
      tel: fb.control('', [Validators.required]),
      password: fb.control('', [Validators.required]),
      confirmPassword: fb.control('', [Validators.required]),
    });

    this.passwordControl = this.form.get('password');
    this.confirmPasswordControl = this.form.get('confirmPassword');
    this.form.addValidators(
      this.createCompareValidator(this.passwordControl, this.confirmPasswordControl));
   };


     validateForm() {
      this.form.reset();
      const passwordControl = this.form.get('password');
      const confirmPasswordControl = this.form.get('confirmPassword');
      const usernameControl = this.form.get('name');
      const telControl = this.form.get('tel')

      if (passwordControl && confirmPasswordControl && usernameControl && telControl) {

        confirmPasswordControl.setValidators(Validators.required);
        passwordControl.setValidators(Validators.required);
        usernameControl.setValidators(Validators.required);
        telControl.setValidators(Validators.required);

        confirmPasswordControl.updateValueAndValidity();
        passwordControl.updateValueAndValidity();
        usernameControl.updateValueAndValidity();
      }
      if(this.form.valid && this.checkedTerms){
        this.enableRegister = true
      } else {
        this.enableRegister = false
      }
    }


  ngOnInit() {
    this.validateForm();
  };

  triggerEscape(){
    this.modalCtrl.dismiss()
  }

  togglePassword(){
    this.showPassword = !this.showPassword;
    this.iconSrc = this.showPassword ? 'assets/icon/eye-outline.svg' : 'assets/icon/eye-off-outline.svg';
  };

  getInputType() {
    return this.showPassword ? 'text' : 'password';
  };

  onSubmit(){
    const name = this.form.value.name;
    const password = this.form.value.password;
    const email = this.form.value.email;
    const tel = this.form.value.tel;
    const confirmPassword = this.form.value.confirmPassword;
    const survey = JSON.stringify(this.survey)
    this.authService.onRegister(name, email, tel, password, confirmPassword, this.cart, survey).subscribe(res => {
      if(res.message === "Email sent") {
        const data = JSON.stringify({
          name: name,
          email: email,
          id: res.id,
        })
        Preferences.set({key: 'tempUserData', value: data });
        this.router.navigate(['/tabs/tables']);
        triggerEscapeKeyPress();
      } else if(res.message === 'This email allrady exist'){
        this.router.navigate(['/tabs/tables']);
        showToast(this.toastCtrl, res.message, 3000);
        this.modalCtrl.dismiss()
      } else if(res.message === 'Error sending email'){
        const data = JSON.stringify({
          name: name,
          email: email,
          id: res.id,
        });
        Preferences.set({key: 'tempUserData', value: data });
        this.router.navigate(['/email-error']);
        this.modalCtrl.dismiss()
      };
    });

  };

  goTerms(){
    this.router.navigateByUrl('/terms')
    triggerEscapeKeyPress()
  }

  checked(event: any){
    if(this.form.valid && event.detail.checked){
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

};
