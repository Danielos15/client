import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RoomListComponent } from './room-list/room-list.component';
import { RoomComponent } from './room/room.component';
import { ChatService } from './chat.service';
import { ChatComponent } from './chat/chat.component';
import { UserComponent } from './user/user.component';
import { UserListComponent } from './user-list/user-list.component';
import { ModalComponent } from './modal/modal.component';
import { PrivateMsgComponent } from './private-msg/private-msg.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RoomListComponent,
    RoomComponent,
    ChatComponent,
    UserComponent,
    UserListComponent,
    ModalComponent,
    PrivateMsgComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([{
      path: '',
      redirectTo: 'login',
      pathMatch: 'full'
    }, {
      path: 'login',
      component: LoginComponent
    }, {
      path: 'chat',
      component: ChatComponent
    }])
  ],
  providers: [ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
