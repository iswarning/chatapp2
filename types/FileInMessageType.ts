import firebase from "firebase";
import { ChunkFileType } from "./ChunkFileType";

export interface FileInMessageType {
    id: string,
    name: string,
    key: string,
    size: string,
}

export const MapFileInMessageData = (fileInMessage: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>): FileInMessageType => {
    let data = {} as FileInMessageType;
    data._id = fileInMessage?._id;
    data.key = fileInMessage?.data()?.key;
    data.name = fileInMessage?.data()?.name;
    data.size = fileInMessage?.data()?.size;
    return data;
}