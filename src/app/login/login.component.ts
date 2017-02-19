import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  error: boolean;
  username: string;

  constructor(
    private chatService: ChatService,
    private router: Router
  ) { }

  ngOnInit() {
    this.error = false;
  }

  onLogin() {
    this.chatService.login(this.username).subscribe(succeeded => {
      this.error = !succeeded;
      if (succeeded) {
        this.router.navigate(['/chat']);
      }
    });
  }
}
