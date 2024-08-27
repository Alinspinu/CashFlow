import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { WebSocketService } from './test-web.service';

@Component({
  selector: 'app-test-web',
  templateUrl: './test-web.page.html',
  styleUrls: ['./test-web.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class TestWebPage implements OnInit {

  messages: string[] = [];
  message!: string;

  constructor(@Inject(WebSocketService) private wsService: WebSocketService) {}

  ngOnInit() {
    this.wsService.connect('wss://www.flowmanager.ro:8070');
    this.wsService.getMessages().subscribe(message => {
      this.messages.push(`Server: ${message}`);
    });
  }

  sendMessage() {
    this.wsService.sendMessage(this.message);
    this.messages.push(`You: ${this.message}`);
    this.message = '';
  }

}
