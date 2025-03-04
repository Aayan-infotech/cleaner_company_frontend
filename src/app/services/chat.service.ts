import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, query, orderBy, Timestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private firestore: Firestore) {}

  async sendMessage(senderId: string, message: string, empId: string, adminId: string) {
    const chatId = `${empId}_${adminId}`; // Generate a unique chatId
    const chatCollection = collection(this.firestore, `chats/${chatId}/messages`); // Access messages subcollection

    try {
      await addDoc(chatCollection, {
        message,
        senderId,
        receiverId: senderId === empId ? adminId : empId,
        timestamp: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  getMessages(empId: string, adminId: string): Observable<any[]> {
    const chatId = `${empId}_${adminId}`;
    const chatCollection = collection(this.firestore, `chats/${chatId}/messages`);

    const chatQuery = query(chatCollection, orderBy('timestamp', 'asc'));
    return collectionData(chatQuery, { idField: 'messageId' }); // Returns messages with their Firestore document IDs
  }
}
