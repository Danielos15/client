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
  pmUsers: string[];
  message: string;
  pmName: string;

  @ViewChild(ModalComponent)
  public readonly modal: ModalComponent;

  constructor(
    private chatService: ChatService,
    private router: Router
  ) { }

  ngOnInit() {
    this.chatService.updateAllUsers();
    this.chatService.getUsers().subscribe(lst => {
      this.users = lst;
    });

    this.pmUsers = this.chatService.getPMs();
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
        this.modal.hide();
        this.message = '';
      }
    })
  }

}
