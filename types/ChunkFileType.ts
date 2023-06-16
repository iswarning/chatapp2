import firebase from "firebase";

export interface ChunkFileType {
    id: string,
    key: string,
    url: string,
    path: string,
}

export const MapChunkFileData = (chunkFile: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>): ChunkFileType => {
    let data = {} as ChunkFileType;
    data.id = chunkFile.id;
    data.key = chunkFile?.data()?.key;
    data.url = chunkFile?.data()?.url;
    data.path = chunkFile?.data()?.path;
    return data;
}