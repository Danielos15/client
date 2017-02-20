import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  error: string;
  username: string;
  password: string;

  constructor(
    private chatService: ChatService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onLogin() {
    this.chatService.login(this.username, this.password).subscribe(obj => {
      this.error = obj.reason;
      if (obj.succeded) {
        this.router.navigate(['/chat']);
      }
    });
  }
}
