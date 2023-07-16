import firebase from "firebase";

export interface ImageAttachType {
    id: string,
    url: string,
    key: string,
    path: string,
}

export const MapImageAttachData = (imageAttach: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>): ImageAttachType => {
    let data: ImageAttachType = {} as ImageAttachType;
    data._id = imageAttach._id;
    data.url = imageAttach?.data()?.url;
    data.key = imageAttach?.data()?.key;
    data.path = imageAttach?.data()?.path;
    return data;
}