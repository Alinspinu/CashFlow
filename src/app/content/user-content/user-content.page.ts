import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/office/users/users.service';

@Component({
  selector: 'app-user-content',
  templateUrl: './user-content.page.html',
  styleUrls: ['./user-content.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class UserContentPage implements OnInit {

  userId: string = ''
  user!: any

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userSrv: UsersService,
  ) { }

  ngOnInit() {
    this.getUserId()
    this.getUser()
  }



  goBack(){
    this.router.navigateByUrl('/tabs/office/users')
  }

  getUser(){
    console.log(this.userId)
    this.userSrv.getUser(this.userId).subscribe(response => {
      this.user = response
      console.log(this.user)
    })
  }


  getUserId(){
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if(id){
        this.userId = id;
      }
    })
  }

}
