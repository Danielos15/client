import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import {ChatService} from '../chat.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  activeRoom: string;
  message: string;
  chat: any;

  constructor(
    private chatService: ChatService,
    private router: Router
  ) { }

  ngOnInit() {
    if (!this.chatService.getCurrentUser()) {
      this.router.navigate(['login']);
    }

    this.chatService.updateChat().subscribe( obj => {
      if (obj['room'] === this.activeRoom) {
        const ret = [];
        for (let msg in obj['chatHistory']) {
          if (obj['chatHistory'].hasOwnProperty(msg)) {
            msg = obj['chatHistory'][msg];
            const d = new Date(msg['timestamp']);
            const date: string = d.toLocaleString(window.navigator.language, {month: 'short'})
              + '-'
              + d.getDate()
              + ' '
              + d.getHours()
              + ':'
              + d.getMinutes();
            ret.push({
              timestamp: date,
              nick: msg['nick'],
              message: msg['message']
            });
          }
        }
        this.chat = ret;
      }
    });
    this.scrollToBottom();
  }

  onNotify(roomName: string) {
    this.activeRoom = roomName;
    if (roomName !== undefined) {
      this.chatService.getChat(roomName);
      this.scrollToBottom();
    } else {
      // Clear chat since there is no active room
      this.chat = [];
    }
  }

  sendMessage() {
    const params = {
      msg: this.message,
      roomName: this.activeRoom
    };
    this.chatService.sendMessage(params);
    this.message = '';
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
