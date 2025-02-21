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
    const chatId = `${empId}_${adminId}`; // Generate a unique chatId
    const chatRef = ref(this.db, `chats/${chatId}`); // Use chatId for messages
    const newMessageRef = push(chatRef);
    return set(newMessageRef, {
      sender,
      message,
      timestamp: Date.now(),
    }).catch((error) => {
      console.error('Error sending message:', error);
    });
  }
  
  getMessages(empId: string, adminId: string): Observable<any[]> {
    const chatId = `${empId}_${adminId}`; // Use the same chatId
    return new Observable((observer) => {
      const chatRef = ref(this.db, `chats/${chatId}`);
      onValue(chatRef, (snapshot) => {
        const messages: any[] = [];
        snapshot.forEach((childSnapshot) => {
          messages.push({ key: childSnapshot.key, ...childSnapshot.val() });
        });
        observer.next(messages);
      });
    });
  }
  
}
