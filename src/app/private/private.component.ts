import { Component, OnInit } from '@angular/core';
import {ChatService} from '../chat.service';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.css']
})
export class PrivateComponent implements OnInit {
  pmUsers: any;

  constructor(
    private chatService: ChatService
  ) { }

  ngOnInit() {
    this.pmUsers = this.chatService.getPmUsers();
  }

  openPms(username: string) {
    this.chatService.getPMs(username);
  }
}
