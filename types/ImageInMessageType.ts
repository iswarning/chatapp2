import firebase from "firebase";

export interface ImageInMessageType {
    id: string,
    url: string,
    key: string,
}

export const MapImageInMessageData = (imageInMessage: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>): ImageInMessageType => {
    let data: ImageInMessageType = {} as ImageInMessageType;
    data.id = imageInMessage.id;
    data.url = imageInMessage?.data()?.url;
    data.key = imageInMessage?.data()?.key;
    return data;
}