import {Component, OnInit, Input} from '@angular/core';
import {ChatService} from '../chat.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  @Input() activeRoom: string;
  users: string[];
  ops: string[];
  isOp: boolean;
  currUser: string;

  constructor(
    private chatService: ChatService
  ) { }

  ngOnInit() {
    this.currUser = this.chatService.getCurrentUser();
    this.chatService.getUsersInRoom().subscribe(obj => {
      if (obj.room === this.activeRoom) {
        this.isOp = false;
        this.users = obj.users;
        this.ops = obj.ops;
        if (this.ops.indexOf(this.chatService.getCurrentUser()) > -1) {
          this.isOp = true;
        }
      }
    });
  }

  kick(username: string, event: any) {
    this.chatService.kick(username, this.activeRoom).subscribe();
    event.stopImmediatePropagation();
  }

  ban(username: string, event: any) {
    this.chatService.ban(username, this.activeRoom).subscribe();
    event.stopImmediatePropagation();
  }

}
