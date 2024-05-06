import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BreadcrumbCollapsedClickEventDetail, IonicModule, ModalController, NavParams, ToastController } from '@ionic/angular';
import { triggerEscapeKeyPress, showToast } from 'src/app/shared/utils/toast-controller';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActionSheetService } from 'src/app/shared/action-sheet.service';
import { DatePickerPage } from '../date-picker/date-picker.page';
import { formatedDateToShow } from 'src/app/shared/utils/functions';
import { NirService } from '../../office/CRUD/nir/nir.service';
import { UsersService } from '../../office/users/users.service';

// interface Data {
//   ing: {
//     _id: string,
//     qty: number
//   }[],
//   mode: string,
//   ingId: string,
// }

@Component({
  selector: 'app-add-entry',
  templateUrl: './add-entry.page.html',
  styleUrls: ['./add-entry.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class AddEntryPage implements OnInit {
  form!: FormGroup;
  coffee: boolean = false
  date!:any
  locatie!: string

  operations: string[] = []
  supliers!: any
  users!: any
  admin: any[] = []
  description: string = ''

  usersToShow!: any

  supliersToSend: any[]  = []
  usersNames: any[] = []
  usersId: string[] = []
  bonusName: string[] = []

  hide: {
    date: boolean,
    tip: boolean,
    typeOf: boolean,
    suplier: boolean,
    document: boolean,
    user: boolean,
    docNr: boolean,
    desc: boolean,
    amount: boolean,
    users: boolean,
  } = {
    date: false,
    tip: false,
    typeOf: false,
    suplier: false,
    document: false,
    user: false,
    docNr: false,
    desc: false,
    amount: false,
    users: false
  }

  incomeOp: string[] = [
    'Incasare raport Z',
    'Incasare din banca',
    'Incasare de la administrator',
    'Altele',
  ]

  expenseOp: string[] =[
    'Plata furnizor',
    'Plata catre administrator',
    'Avans',
    'Salariu',
    'Bonus vanzari',
    'Bonus excelenta',
    'Tips Card',
    'Altele'
  ]

  documents: string[] = [
    'Bon fiscal',
    'Chitanta',
    'Dispozitie de plata',
    'Dispozitie de incasare',
    'Fara'
  ]


  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private navPar: NavParams,
    private toastCtrl: ToastController,
    private nirSrv: NirService,
    private usersSrv: UsersService,
    @Inject(ActionSheetService) private actionSheet: ActionSheetService,
  ) { }


  ngOnInit() {
   this.locatie = this.navPar.get('options')
   this.setForm()
   this.startEntryFlow()
   this.getSupliers()
   this.getUsers()
  }



  cancel(){
    this.modalCtrl.dismiss(null)
  }

  setForm(){
    this.form = new FormGroup({
      price: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      typeOfEntry: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      typeOf: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      suplier: new FormControl(null, {
        updateOn: 'change',
      }),
      user: new FormControl(null, {
        updateOn: 'change',
      }),
      document: new FormControl(null, {
        updateOn: 'change',
      }),
      docNr: new FormControl(null, {
        updateOn: 'change',
      }),
      description: new FormControl(null, {
        updateOn: 'change',
      }),

    });
  }

  getSupliers(){
    this.nirSrv.getSuplier('', environment.LOC).subscribe(response => {
      if(response){
        this.supliers = response.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        response.forEach(suplier => {
          this.supliersToSend.push(suplier.name)
        })
        this.supliersToSend.push('Altul')
        this.supliersToSend.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
      }
    })
  }

  getUsers(){
    this.usersSrv.getUsers('employees', '', environment.LOC).subscribe(response => {
      this.users = response
      this.users.forEach((user: any) => {
          if(user.name === 'sergiu' || user.name === 'Adrian Piticariu'){
              this.admin.push(user)
          }
          this.usersNames.push(user.employee.fullName)
      })
      this.usersNames.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    })
  }

  async startEntryFlow(){
    const date = await this.actionSheet.openAuth(DatePickerPage)
    if(date){
      this.hide.date = true
      this.date = date
      const tip = await this.actionSheet.entryAlert(['Încasare', 'Cheltuială'], 'radio', 'Tip de intrare', 'Alege o opțiune', '')
      if(tip){
        this.hide.tip = true
        this.form.get('typeOfEntry')?.setValue(tip === "Încasare" ? 'income' : 'expense' )
        if(tip === "Încasare"){
          this.operations = this.incomeOp
          const typeOf = await this.actionSheet.entryAlert(this.incomeOp, 'radio','Tip de Încasare','Alege o opțiune', '')
            if(typeOf){
              this.hide.typeOf = true
              this.form.get('typeOf')?.setValue(typeOf)
              switch(typeOf){
                case 'Incasare raport Z':
                  this.description = typeOf
                  const sum = await this.actionSheet.numberAlert('Sumă', 'Adaugă suma', 'val', 'Sumă')
                  if(sum){
                    this.hide.amount = true
                    this.form.get('price')?.setValue(sum)
                  }
                  return
                case 'Incasare din banca':
                  this.description = typeOf
                  const val = await this.actionSheet.numberAlert('Sumă', 'Adaugă suma', 'val', 'Sumă')
                  if(val){
                    this.hide.amount = true
                    this.form.get('price')?.setValue(val)
                  }
                  return
                case 'Incasare de la administrator':
                  this.usersToShow = this.admin
                  const admin = await this.actionSheet.entryAlert([this.admin[0].employee.fullName, this.admin[1].employee.fullName], 'radio', 'Administratori', 'Alege o opțiune', '')
                  if(admin){
                    this.hide.user = true
                    const user = this.admin.find(user => user.employee.fullName === admin)
                    this.description = typeOf + ' ' + user.employee.fullName
                    this.form.get('user')?.setValue(user._id)
                    const sum = await this.actionSheet.numberAlert('Sumă', 'Adaugă suma', 'val', 'Sumă')
                    if(sum){
                      this.hide.amount = true
                      this.form.get('price')?.setValue(sum)
                    }
                  }
                  return
                case 'Altele':
                  const desc = await this.actionSheet.textAlert('Descriere', 'Adaugă informații suplimentare', 'nr', 'Descriere')
                  if(desc){
                    this.hide.desc = true
                    this.description = 'Alte încasări: ' + desc
                    this.form.get('description')?.setValue(desc)
                  }
                  const value = await this.actionSheet.numberAlert('Sumă', 'Adaugă suma', 'val', 'Sumă')
                  if(value){
                    this.hide.amount = true
                    this.form.get('price')?.setValue(value)
                  }
                  return
              }
            }
        } else {
          this.operations = this.expenseOp
          const typeOf = await this.actionSheet.entryAlert(this.expenseOp, 'radio','Tip de Încasare','Alege o opțiune','')
          if(typeOf){
            this.hide.typeOf = true
            this.form.get('typeOf')?.setValue(typeOf)
            switch(typeOf){
              case 'Plata furnizor':
                const suplierName = await this.actionSheet.entryAlert(this.supliersToSend, 'radio', 'Furnizori', 'Alege un furnizor','suplier-alert')
                if(suplierName){
                  if(suplierName === "Altul"){
                    const desc = await this.actionSheet.textAlert('Nume furnizor', 'Scrie numele furnizorului', 'nr', 'Descriere')
                    if(desc){
                      this.hide.desc = true
                      this.form.get('description')?.setValue(desc)
                      const document = await this.actionSheet.entryAlert(this.documents, 'radio', 'Tip de Document', 'Alege o opțiune', '')
                      if(document) {
                        this.hide.document = true
                        this.form.get('document')?.setValue(document)
                        if(document === 'Fara'){
                          this.description = typeOf + ' ' + desc + ' Fara document de plata'
                        } else {
                          const docNumber = await this.actionSheet.textAlert('Numar Document', 'Introdu numarul documentului', 'nr', 'Numad document')
                          if(docNumber){
                            this.description = typeOf + ' ' + desc + ' ' + document + ' ' + docNumber
                            this.hide.docNr = true
                            this.form.get('docNr')?.setValue(docNumber)
                        }
                      }
                      const sum = await this.actionSheet.numberAlert('Sumă', 'Adaugă suma', 'val', 'Sumă')
                        if(sum){
                          this.hide.amount = true
                          this.form.get('price')?.setValue(sum)
                        }
                      }
                    }
                  } else {
                    const suplier = this.supliers.find((suplier: any) => suplier.name === suplierName)
                    if(suplier){
                      this.hide.suplier = true
                      this.form.get('suplier')?.setValue(suplier._id)
                    }
                    const document = await this.actionSheet.entryAlert(this.documents, 'radio', 'Tip de Document', 'Alege o opțiune', '')
                    if(document) {
                      if(document === 'Fara'){
                        this.description = typeOf + ' ' + suplier.name + ' Fara document de plata'
                      } else {
                        this.hide.document = true
                        this.form.get('document')?.setValue(document)
                        const docNumber = await this.actionSheet.textAlert('Numar Document', 'Introdu numarul documentului', 'nr', 'Numad document')
                        if(docNumber){
                          this.description = typeOf + ' ' + suplier.name + ' ' + document + ' ' + docNumber
                          this.hide.docNr = true
                          this.form.get('docNr')?.setValue(docNumber)
                      }
                    }
                    const sum = await this.actionSheet.numberAlert('Sumă', 'Adaugă suma', 'val', 'Sumă')
                    if(sum){
                      this.hide.amount = true
                      this.form.get('price')?.setValue(sum)
                    }
                    }
                  }
                }
                return
              case 'Plata catre administrator':
                this.usersToShow = this.admin
                const admin = await this.actionSheet.entryAlert([this.admin[0].employee.fullName, this.admin[1].employee.fullName], 'radio', 'Tip de Document', 'Alege o opțiune', '')
                if(admin){
                  this.hide.user = true
                  const user = this.admin.find(user => user.employee.fullName === admin)
                  this.form.get('user')?.setValue(user._id)
                  this.description = typeOf + ' ' + user.employee.fullName
                  const sum = await this.actionSheet.numberAlert('Sumă', 'Adaugă suma', 'val', 'Sumă')
                  if(sum){
                    this.hide.amount = true
                    this.form.get('price')?.setValue(sum)
                  }
                }
                return
              case 'Avans':
                this.usersToShow = this.users
                const user = await this.actionSheet.entryAlert(this.usersNames, 'radio', 'Angajat', 'Alege Angajat', 'suplier-alert')
                if(user){
                  this.hide.user = true
                  const choise = this.users.find((usr:any) => usr.employee.fullName === user)
                  this.form.get('user')?.setValue(choise._id)
                  this.description = typeOf + " " + choise.employee.fullName
                  const sum = await this.actionSheet.numberAlert('Sumă', 'Adaugă suma', 'val', 'Sumă')
                  if(sum){
                    this.hide.amount = true
                    this.form.get('price')?.setValue(sum)
                  }
                }
                return
              case 'Salariu':
                this.usersToShow = this.users
                const employee = await this.actionSheet.entryAlert(this.usersNames, 'radio', 'Angajat', 'Alege Angajat', 'suplier-alert')
                if(employee){
                  this.hide.user = true
                  const choise = this.users.find((usr:any) => usr.employee.fullName === employee)
                  this.form.get('user')?.setValue(choise._id)
                  this.description = typeOf + ' ' + choise.employee.fullName
                  const sum = await this.actionSheet.numberAlert('Sumă', 'Adaugă suma', 'val', 'Sumă')
                  if(sum){
                    this.hide.amount = true
                    this.form.get('price')?.setValue(sum)
                  }
                }
                return
              case 'Bonus vanzari':
                this.usersToShow = this.users
                const users = await this.actionSheet.entryAlert(this.usersNames, 'checkbox', 'Angajați', 'Alege angajați', 'suplier-alert')
                if(users){
                  this.hide.users = true
                  this.bonusName = users
                  this.description = typeOf + ' ' + users.join(', ');
                  users.forEach((name: string) => {
                    this.users.forEach((user:any) => {
                        if(name === user.employee.fullName){
                          this.usersId.push(user._id)
                        }
                    })
                  })
                  const sum = await this.actionSheet.numberAlert('Sumă', 'Adaugă suma', 'val', 'Sumă')
                  if(sum){
                    this.hide.amount = true
                    this.form.get('price')?.setValue(sum)
                  }
                }
                return
              case 'Bonus excelenta':
                this.usersToShow = this.users
                const lucky = await this.actionSheet.entryAlert(this.usersNames, 'radio', 'Angajat', 'Alege Angajat', 'suplier-alert')
                if(lucky){
                  this.hide.user = true
                  const choise = this.users.find((usr:any) => usr.employee.fullName === lucky)
                  this.form.get('user')?.setValue(choise._id)
                  this.description = typeOf + ' ' + lucky
                  const sum = await this.actionSheet.numberAlert('Sumă', 'Adaugă suma', 'val', 'Sumă')
                  if(sum){
                    this.hide.amount = true
                    this.form.get('price')?.setValue(sum)
                  }
                }
                return
              case 'Tips Card':
                this.description = typeOf
                const sum = await this.actionSheet.numberAlert('Sumă', 'Adaugă suma', 'val', 'Sumă')
                if(sum){
                  this.hide.amount = true
                  this.form.get('price')?.setValue(sum)
                }
                return
              case 'Altele':
                const desc = await this.actionSheet.textAlert('Descriere', 'Adaugă informații suplimentare', 'nr', 'Descriere')
                if(desc){
                  this.hide.desc = true
                  this.description ='Alte plăți: ' + desc
                  this.form.get('description')?.setValue(desc)
                }
                const val = await this.actionSheet.numberAlert('Sumă', 'Adaugă suma', 'val', 'Sumă')
                if(val){
                  this.hide.amount = true
                  this.form.get('price')?.setValue(val)
                }
                return
            }
          }
        }


      } else{
        showToast(this.toastCtrl, 'Trebuie să alegi tipul de cheltuială', 2000)
        this.modalCtrl.dismiss(null)
      }
    }
  }


  async openDateModal(){
    const response = await this.actionSheet.openAuth(DatePickerPage)
    if(response){
      this.date = response
    }

  }
  formatDate(date: any){
    return formatedDateToShow(date).split('ora')[0]
  }



  confirm(){
    if(this.form.valid && this.date){
      const entry = {
        tip: this.form.value.typeOfEntry,
        date: this.date,
        description: this.description,
        amount: this.form.value.price,
        locatie: this.locatie,
        typeOf: this.form.value.typeOf,
        suplier: this.form.value.suplier,
        user: this.usersId.length ? this.usersId : [this.form.value.user],
        document: {
          tip: this.form.value.document ? this.form.value.document : 'Fara',
          number: this.form.value.docNr
        }
      }
      this.http.post(`${environment.BASE_URL}register/add-entry`, entry).subscribe(response => {
        this.modalCtrl.dismiss(response)
      })
    }
  }



}
