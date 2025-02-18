import { Injectable } from '@angular/core';
import { Database, ref, push, set, onValue, query, orderByChild, equalTo } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private chatRef;

  constructor(private db: Database) {
    this.chatRef = ref(this.db, 'chats'); // Initialize the chatRef here
  }

  sendMessage(sender: string, message: string, empId: string, adminId: string) {
    const newMessageRef = push(this.chatRef);
    return set(newMessageRef, {
      sender,
      message,
      empId,
      adminId,
      timestamp: Date.now(),
    }).catch((error) => {
      console.error('Error sending message:', error);
    });
  }

  getMessages(empId: string): Observable<any[]> {
    return new Observable((observer) => {
      const q = query(this.chatRef, orderByChild('empId'), equalTo(empId));
      onValue(q, (snapshot) => {
        const messages: any[] = [];
        snapshot.forEach((childSnapshot) => {
          messages.push({ key: childSnapshot.key, ...childSnapshot.val() });
        });
        observer.next(messages);
      });
    });
  }
}
