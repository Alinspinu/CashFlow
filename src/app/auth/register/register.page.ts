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
  baseUrl: string = 'http://localhost:8080/api/';
  newUrl: string = 'https://flow-api-394209.lm.r.appspot.com/api-true/';
  isLoading = false;
  form!: FormGroup;
  showPassword = false;
  iconName: string = 'eye-off-outline';
  passwordControl!: AbstractControl | any;
  confirmPasswordControl!: AbstractControl | any;
  cart: string = '';
  showFood: boolean = false;
  showCoffee: boolean = false;
  register: boolean = false;
  showFoodPrice: boolean = false;
  showCoffeePrice: boolean = false;
  question!: string;
  showQuestion: boolean = false
  hideSurveyButton: boolean = false;
  survey: Survey = {food: [], foodPrice: [], coffee: [], coffeePrice: []}


  foodPrice: string[] = ['Sub 30 lei', 'Între 30 și 60 lei', 'Peste 60 lei'];
  coffeePrice: string[] = ['Sub 10 lei', 'Între 10 și 20 lei', 'Peste 30 lei'];
  foodAnswers: string[] = [ 'Mâncare Românească','Mâncare Orientala', 'Mâncare Asiatica', 'Mâncare Italiană', 'Sandwich', 'Mic Dejun', 'Patiserie', 'Cofetarie', 'Pizza', 'Burgeri', 'Lacto-vegetarian' ,'Vegan', 'Organic',];
  coffeeAnswers: string[] = ['Cu Zahăr', 'Cu Lapte', 'Fără Zahăr', 'Espresso', 'La Filtru', 'Cu Arome', 'Ice Coffee', 'Ibric'];

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
    this.iconName = this.showPassword ? 'eye-outline' : 'eye-off-outline';
  };

  getInputType() {
    return this.showPassword ? 'text' : 'password';
  };

  onSubmit(){
   Preferences.get({key: 'cart'}).then(res => {
    if(res.value){
      this.cart = res.value;
    };
   });

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
        this.router.navigate(['/email-sent']);
        triggerEscapeKeyPress();
      } else if(res.message === 'This email allrady exist'){
        this.router.navigate(['/tabs/cart']);
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

openSurvey(mode: string){
  if(mode === 'survey'){
    this.showQuestion = true
    this.showFood = true
    this.question = 'Ce fel de mâncare îți place? (1/4)'
    this.hideSurveyButton = true
  } else if(mode === 'food'){
    console.log("ceva")
    this.showFoodPrice = true
    this.question = 'Câti bani ai cheltui pentru o masă? (2/4)'
    this.showFood = false
  } else if(mode === 'food-price'){
    this.showCoffee = true
    this.showFoodPrice = false
    this.question = 'Cum îți place să bei cafeaua? (3/4)'
  } else if(mode === 'coffee'){
    this.showCoffee = false;
    this.showCoffeePrice = true;
    this.question = 'Câți bani ai cheltui pentru o cafea? (4/4)'
  } else if(mode === 'coffee-price'){
    this.register = true
    this.showCoffeePrice = false
    this.question = 'Mulțumim frumos pentru timpul acordat!'
  }
}


onChange(event: any, answer: string, mode: string){
  if(mode === 'food'){
    if(event.detail.checked){
      this.survey.food.push(answer)
    } else {
      const index = this.survey.food.findIndex(str => str = answer)
      this.survey.food.splice(index, 1)
    }
  } else if(mode === 'food-price') {
    if(event.detail.checked){
      this.survey.foodPrice.push(answer)
    } else {
      const index = this.survey.food.findIndex(str => str = answer)
      this.survey.foodPrice.splice(index, 1)
    }
  } else if(mode === 'coffee'){
    if(event.detail.checked){
      this.survey.coffee.push(answer)
    } else {
      const index = this.survey.food.findIndex(str => str = answer)
      this.survey.coffee.splice(index, 1)
    }
  } else if(mode = 'coffee-price'){
    if(event.detail.checked){
      this.survey.coffeePrice.push(answer)
    } else {
      const index = this.survey.food.findIndex(str => str = answer)
      this.survey.coffeePrice.splice(index, 1)
    }
  }
}
};
