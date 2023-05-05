import { db } from '@/firebase';

function createNewChat(users: Array<string>) {
    db.collection('chats').add({
        users: users,
        name: '',
        photoURL: '',
        isGroup: false
    }); 
}

export default createNewChat;