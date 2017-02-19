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

  constructor(
    private chatService: ChatService
  ) { }

  ngOnInit() {
    this.chatService.getRooms().subscribe(lst => {
      this.rooms = lst;
    });
  }

  onNewRoom() {
    this.chatService.addRoom(this.newRoom, this.newPass).subscribe(success => {
      if (success) {
        this.notify.emit(this.newRoom);
      }
    });
  }
  joinRoom(roomName: string) {
    this.chatService.joinRoom(roomName, this.newPass).subscribe(success => {
      if (success) {
        this.notify.emit(roomName);
      }
    });
  }
}
