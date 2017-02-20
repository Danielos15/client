import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ChatService {
  socket: any;
  private currentRoom: string;
  private currentName: string;
  private privateMessages : any;

  constructor() {
    this.socket = io('http://localhost:8080/');
    this.socket.on('connect', function() {
      console.log('Connection');
    });
    this.privateMessages = [];
    this.getPrivateMessage();
  }

  getCurrentUser() {
    return this.currentName;
  }

  login(username: string): Observable<boolean> {
    return new Observable( observer => {
      this.socket.emit('adduser', username, succeded => {
        if (succeded === true) {
          this.currentName = username;
          this.updateAllUsers();
        }
        observer.next(succeded);
      });
    });
  }

  getRooms(): Observable<string[]> {
    return new Observable(observer => {
      this.socket.emit('rooms');
      this.socket.on('roomlist', (lst) => {
        const strArr: string[] = [];
        for (const x in lst) {
          if (lst.hasOwnProperty(x)) {
            strArr.push(x);
          }
        }
        observer.next(strArr);
      });
    });
  }

  UserRoomSubscription(): Observable<string[]> {
    return new Observable(obs => {
      this.socket.on('userlistinroom', lst => {
        const strArr = [];
        for (const name in lst) {
          if (lst.hasOwnProperty(name)) {
            strArr.push(name);
          }
        }
        obs.next(strArr);
      });
    });
  }

  updateUsersInRoom(room) {
    this.socket.emit('displayroom', room);
  }

  getUsersInRoom(): Observable<any> {
    return new Observable(obs => {
      this.socket.on('updateusers', (roomName, users, ops) => {
        const usrs: string[] = [];
        for (const name in users) {
          if (users.hasOwnProperty(name)) {
            usrs.push(name);
          }
        }
        const op: string[] = [];
        for (const name in ops) {
          if (ops.hasOwnProperty(name)) {
            op.push(name);
          }
        }
        const ret = {
          room: roomName,
          users: usrs,
          ops: op
        };
        obs.next(ret);
      });
    });
  }
  getUsers(): Observable<string[]> {
    return new Observable(observer => {
      this.socket.on('userlist', lst => {
        observer.next(lst);
      });
    });
  }
  updateAllUsers() {
    this.socket.emit('users');
  }

  addRoom(roomName: string, pass: string): Observable<boolean> {
    // TODO: check if Room exists.
    return new Observable(observer => {
      const param = {
        room: roomName,
        pass: pass
      };
      this.socket.emit('joinroom', param, (success, b) => {
        observer.next(success);
      });
    });
  }

  joinRoom(roomName: string, pass: string): Observable<boolean> {
    // TODO: check if room Exists
    return this.addRoom(roomName, pass);
  }

  leaveRoom(roomName: string) {
    return new Observable(obs => {
      this.socket.emit('partroom', roomName);
    });
  }

  getUserChannels(): Observable<string[]> {
    return new Observable(observer => {
      this.socket.on('updateuserchannels', (lst) => {
        const strArr = [];
        for (const channel in lst) {
          if (lst.hasOwnProperty(channel)) {
            strArr.push(channel);
          }
        }
        observer.next(strArr);
      });
    });
  }

  sendMessage(data) {
    this.socket.emit('sendmsg', data);
  }

  sendPrivateMessage(data): Observable<boolean> {
    return new Observable(obs => {
      this.socket.emit('privatemsg', data, success => {
        obs.next(success);
      });
    });
  }

  getPrivateMessage() {
    let obs = new Observable(obs => {
      this.socket.on('recv_privatemsg', (username, msg) => {
        const ret = {
          sender: username,
          time: this.getDateTimeFormat(),
          msg: msg
        };
        obs.next(ret);
      });
    });

    obs.subscribe( obj => {
      this.privateMessages.push(obj);
    })
  }

  getPMs() {
    return this.privateMessages;
  }

  updateChat(): Observable<Object> {
    return new Observable(obs => {
      this.socket.on('updatechat', (room, chatHistroy) => {
        const ret = {
          room: room,
          chatHistory: chatHistroy
        };
        obs.next(ret);
      });
    });
  }

  getChat(room) {
    this.socket.emit('getchat', room);
  }

  getDateTimeFormat(d = new Date) {
    const date: string = d.toLocaleString(window.navigator.language, {month: 'short'})
      + '-'
      + d.getDate()
      + ' '
      + d.getHours()
      + ':'
      + d.getMinutes();
    return date;
  }
}
