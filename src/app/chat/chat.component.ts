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
  activePm: string;
  message: string;
  pMessage: string;
  chat: any;
  pm: any;
  notification: string;

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

    this.chatService.kicked().subscribe(obj => {
      if (obj['kicked'] === this.chatService.getCurrentUser()) {
        if (obj['room'] === this.activeRoom) {
          this.activeRoom = undefined;
        }

        this.displayNotification('You where kicked by ' + obj['kicker'] + ' from ' + obj['room']);
      }
    });

    this.chatService.banned().subscribe(obj => {
      if (obj['banned'] === this.chatService.getCurrentUser()) {
        if (obj['room'] === this.activeRoom) {
          this.activeRoom = undefined;
        }

        this.displayNotification('You where banned by ' + obj['banner'] + ' from ' + obj['room']);
      }
    });

    this.pm = this.chatService.pm;

    this.scrollToBottom();
  }

  displayNotification(notification: string) {
    this.notification = notification;
    setTimeout( () => {
      this.notification = '';
    }, 5000);
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

  sendPrivateMessage() {
    const data = {
      nick: this.activePm,
      message: this.pMessage
    };
    this.chatService.sendPrivateMessage(data).subscribe( success => {
      if (success) {
        this.pMessage = '';
      }
    });
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
}
