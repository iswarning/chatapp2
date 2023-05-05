import { db } from '@/firebase';

function createNewGroupChat(users: Array<string>, photoURL: string, groupName: string, adminEmail: string) {
    try {
        db.collection('chats').add({
            users: users,
            photoURL: photoURL,
            isGroup: true,
            name: groupName,
            admin: adminEmail
        }); 
    } catch(error: any) {
        throw new Error(JSON.parse(error))
    }
}

export default createNewGroupChat;