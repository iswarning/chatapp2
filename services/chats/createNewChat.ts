import { db } from '@/firebase';
import * as EmailValidator from 'email-validator';
import firebase from 'firebase';

function createNewChat(senderEmail: string ,recipientEmail: string, photoURL: string) {
    if(EmailValidator.validate(recipientEmail) && recipientEmail !== senderEmail) {
        db.collection('chats').add({
            users: [senderEmail, recipientEmail],
            photoURL: photoURL,
            isGroup: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
    }   
}

export default createNewChat;