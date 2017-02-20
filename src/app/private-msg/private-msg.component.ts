import { Component, OnInit } from '@angular/core';
import {ChatService} from '../chat.service';

@Component({
  selector: 'app-private-msg',
  templateUrl: './private-msg.component.html',
  styleUrls: ['./private-msg.component.css']
})
export class PrivateMsgComponent implements OnInit {

  constructor(
    private chatService: ChatService
  ) { }

  ngOnInit() {
  }

}
