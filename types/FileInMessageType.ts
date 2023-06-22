import firebase from "firebase";
import { ChunkFileType } from "./ChunkFileType";

export interface FileInMessageType {
    id: string,
    size: number,
    name: string,
    type: string,
    key: string,
    url: string,
}

export const MapFileInMessageData = (fileInMessage: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>): FileInMessageType => {
    let data = {} as FileInMessageType;
    data.id = fileInMessage?.id;
    data.size = fileInMessage?.data()?.size;
    data.name = fileInMessage?.data()?.name;
    data.type = fileInMessage?.data()?.type;
    data.key = fileInMessage?.data()?.key;
    data.url = fileInMessage?.data()?.url;
    return data;
}