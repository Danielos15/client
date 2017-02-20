import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {ChatService} from '../chat.service';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {
  rooms: string[];
  newRoom: string;
  newPass: string;
  @Output() notify: EventEmitter<string> = new EventEmitter<string>();
  reason: string;

  constructor(
    private chatService: ChatService
  ) { }

  ngOnInit() {
    this.chatService.getRooms().subscribe(lst => {
      this.rooms = lst;
    });
  }

  onNewRoom() {
    // Check if roomname is not empty string
    this.joinRoom(this.newRoom);
  }
  joinRoom(roomName: string) {
    // Check if room exists
    if (roomName.length > 0) {
      this.chatService.joinRoom(roomName, this.newPass).subscribe(ret => {
        if (ret['success']) {
          this.notify.emit(roomName);
        } else {
          if (ret['reason'] === 'banned') {
            this.notification(roomName);
          }
        }
      });
    }
  }

  notification(room: string) {
    // TODO: handle all errors.
    this.reason = 'You are banned from ' + room;
    setTimeout(() => {
      this.reason = '';
    }, 5000);
  }
}
