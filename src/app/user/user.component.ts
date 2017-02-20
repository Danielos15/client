import {Component, OnInit, Input} from '@angular/core';
import {ChatService} from '../chat.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  @Input() activeRoom: string;
  users: string[];
  ops: string[];

  constructor(
    private chatService: ChatService,
    private router: Router
  ) { }

  ngOnInit() {
    this.chatService.getUsersInRoom().subscribe(obj => {
      if (obj.room === this.activeRoom) {
        this.users = obj.users;
        this.ops = obj.ops;
      }
    });
  }

}
