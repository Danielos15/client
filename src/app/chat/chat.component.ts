import { Component, OnInit } from '@angular/core';
import {ChatService} from '../chat.service';
import {Router} from '@angular/router';
import {RoomComponent} from '../room/room.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

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
  }

  onNotify(roomName: string) {
    this.activeRoom = roomName;
    if (roomName !== undefined) {
      this.chatService.getChat(roomName);
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
  }
}
