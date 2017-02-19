import {Component, OnInit, ViewChild} from '@angular/core';
import {ChatService} from '../chat.service';
import {Router} from '@angular/router';
import {ModalComponent} from '../modal/modal.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: string[];
  pmUsers: any;
  message: string;
  pmName: string;

  @ViewChild(ModalComponent)
  public readonly modal: ModalComponent;

  constructor(
    private chatService: ChatService,
    private router: Router
  ) { }

  ngOnInit() {
    this.pmUsers = {};
    this.chatService.updateAllUsers();
    this.chatService.getUsers().subscribe(lst => {
      this.users = lst;
    });

    this.chatService.getPrivateMessage().subscribe(obj => {
      this.addPMUser(obj['sender']);

      let msg = {
        timestamp: new Date(),
        msg: obj['msg']
      };
      // this.pmUsers[this.pmUsers.indexOf(obj['sender'])].messages.push(msg);
    });
  }

  openDialog(username: string) {
    this.pmName = username;
    this.modal.show();
  }

  sendPrivateMessage() {
    const data = {
      nick: this.pmName,
      message: this.message
    };

    this.chatService.sendPrivateMessage(data).subscribe( success => {
      if (success) {
        this.addPMUser(this.pmName);
        this.modal.hide();
        this.message = '';
      }
    })
  }

  private addPMUser(username) {
    if (this.pmUsers[username] === undefined) {
      let user = {
        name: username,
        messages: []
      };
      this.pmUsers[username] = user;
    }
  }

}
