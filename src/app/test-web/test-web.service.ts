import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket!: WebSocket;
  private subject = new Subject<string>();

  connect(url: string) {
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    this.socket.onmessage = (event) => {
      this.subject.next(event.data);
    };

    this.socket.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };
  }

  sendMessage(message: string) {
    this.socket.send(message);
  }

  getMessages() {
    return this.subject.asObservable();
  }
}
