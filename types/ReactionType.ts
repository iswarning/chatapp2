import firebase from "firebase";

export interface ReactionType {
    id: string,
    senderEmail: string,
    emoji: string
}

export const MapReactionData = (react: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>): ReactionType => {
    let data: ReactionType = {} as ReactionType;
    data.id = react.id;
    data.senderEmail = react?.data()?.senderEmail;
    data.emoji = react?.data()?.emoji;
    return data;
}