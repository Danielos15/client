import {Component, OnInit, EventEmitter, Output, Input} from '@angular/core';
import {Router} from '@angular/router';
import {ChatService} from '../chat.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  activeRooms: string[];
  @Input() activeRoom: string;
  @Output() notify: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private chatService: ChatService,
    private router: Router) { }

  ngOnInit() {
    this.chatService.getUserChannels().subscribe(lst => {
      this.activeRooms = lst;
    });
  }

  openRoom(roomName: string) {
    this.activeRoom = roomName;
    this.notify.emit(roomName);
  }

  leaveRoom(roomName: string) {
    this.chatService.leaveRoom(roomName).subscribe();
    if (roomName === this.activeRoom) {
      this.seeRooms();
    }
  }

  seeRooms() {
    this.chatService.updateAllUsers();
    this.activeRoom = undefined;
    this.notify.emit(undefined);
  }
}
