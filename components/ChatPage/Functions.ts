import { db, storage } from "@/firebase";
import { toast } from "react-toastify";
import firebase from "firebase";
import { MessageType } from "@/types/MessageType";
import { ChatType } from "@/types/ChatType";
import sendNotificationFCM from "@/utils/sendNotificationFCM";
import { getImageTypeFileValid } from "@/utils/getImageTypeFileValid";
import { v4 as uuidv4 } from 'uuid'


export function setSeenMessage(
  messages: Array<MessageType>,
  userEmail: string | null | undefined,
  chatId: string
) {
  messages?.forEach((m) => async () => {
    const msgRef = db
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .doc(m.id);
    const res = await msgRef.get();
    if (res?.data()?.user === userEmail) return;
    if (res?.data()?.seen?.includes(userEmail)) return;
    let result = res?.data()?.seen;
    result.push(userEmail);
    await msgRef.update({ seen: result });
  });
}

export function sendNotification(
  snap: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>,
  chat: ChatType,
  userFullName: string | null | undefined,
  recipientFcmToken: string
) {
  let bodyNotify = "";
  if (chat.isGroup) {
    if (snap?.data()?.type === "text-image") {
      bodyNotify = chat.name + " sent you a message ";
    } else {
      bodyNotify = chat.name + " : " + snap?.data()?.message;
    }
  } else {
    if (snap?.data()?.type === "text-image") {
      bodyNotify = userFullName + " sent a message ";
    } else {
      bodyNotify = userFullName + " : " + snap?.data()?.message;
    }
  }
  sendNotificationFCM("New message !", bodyNotify, recipientFcmToken).catch(
    (err) => console.log(err)
  );
}

export function pushUrlImageToFirestore(
  messId: string,
  chatId: string,
  scrollToBottom: any,
  key: string,
  path: string
) {
  storage
    .ref(path)
    .getDownloadURL()
    .then(async (url) => {
      await db
        .collection("chats")
        .doc(chatId)
        .collection("messages")
        .doc(messId)
        .collection("imageInMessage")
        .add({
          url: url,
          key: key,
        });
      scrollToBottom();
    })
    .catch((err) => console.log(err));
}

export function handleImageInMessage() {
  const inputMsgElement = document.getElementById("input-message");
  const listImage = inputMsgElement?.getElementsByTagName("img") ?? [];
  let sizeInput = inputMsgElement?.childNodes?.length ?? 0;

  let message = "";
  let countImg = 0;
  let listElementImg: any = {};
  
  for (let i = 0; i < sizeInput; i++) { 
    let key = uuidv4();
    switch (inputMsgElement?.childNodes[i].nodeName) {
      case "#text":
        message += inputMsgElement?.childNodes[i].nodeValue;
        break;
      case "IMG":
        message += `<br>${key}<br>`;
        listElementImg[key] = listImage[countImg]
        countImg++;
        break;
      case "BR":
        message += "<br><br>";
        break;
      case "DIV":
        let childNodeDiv: any = inputMsgElement?.childNodes[i].childNodes;
        for (const element of childNodeDiv) {
          switch (element.nodeName) {
            case "#text":
              message += element.nodeValue + "<br>";
              break;
            case "IMG":
              message += `<br>${key}<br>`;
              listElementImg[key] = listImage[countImg]
              countImg++;
              break;
            case "BR":
              message += "<br><br>";
              break;
          }
        }
        break;
    }
  }

  return { listElementImg, message };
}

export function addFileChunkToStorage(
  messId: string,
  chatId: string,
  scrollToBottom: any,
  key: string,
  size: number,
  path: string,
  fileId: string
) {
  storage
    .ref(path)
    .getDownloadURL()
    .then(async (url) => {
      await db
        .collection("chats")
        .doc(chatId)
        .collection("messages")
        .doc(messId)
        .collection("fileInMessage")
        .doc(fileId)
        .collection("chunks")
        .add({
          url: url,
          key: key,
          size: size
        });
      scrollToBottom();
    })
    .catch((err) => console.log(err));
}

export async function addMessageToFirebase(
  message: string, 
  typeMessage: string, 
  userEmail: string | null | undefined, 
  chatId: string) {
  const messageDoc = await db
    .collection("chats")
    .doc(chatId)
    .collection("messages")
    .add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: message,
      user: userEmail,
      type: typeMessage,
      photoURL: "",
      seen: [],
    });
  return { messageDoc };
};

export const onAttachFile = async (
  event: any,
  userEmail: string | null | undefined,
  chat: ChatType,
  scrollToBottom: any) => {
  event.preventDefault()
  if (event.target.files && event.target.files[0]) {
    let file: Blob = event.target.files[0];
    let fileType = file.name.split(".").pop();
    let validImageTypes = getImageTypeFileValid();
    let fileSize = file.size / 1024 / 1024;
    if (!validImageTypes.includes(fileType ?? "")) {
      toast("File upload invalid !", {
        hideProgressBar: true,
        type: "error",
        autoClose: 5000,
      });
      return;
    }
    if (fileSize > 100) {
      toast("Size file no larger than 100 MB !", {
        hideProgressBar: true,
        type: "error",
        autoClose: 5000,
      });
      return;
    }
    let chunkSize = 5 * 1024 * 1024; // 5 MB chunk size
    let chunks = [];
    let start = 0;
    let end = chunkSize;
    while (start < file.size) {
      chunks.push(file.slice(start, end));
      start = end;
      end = start + chunkSize;
    }
    
    const { messageDoc } = await addMessageToFirebase("", "file", userEmail, chat.id);

    const fileDoc = await db
      .collection("chats")
      .doc(chat.id)
      .collection("messages")
      .doc(messageDoc.id)
      .collection("fileInMessage")
      .add({
        size: fileSize,
        name: file.name,
        type: fileType
    });

    if (fileDoc) {
      await Promise.all(
        Array.prototype.map.call(chunks, async (chunk: Blob, index) => {
          let key = uuidv4();
          let path = `public/chat-room/${chat.id}/files/${fileDoc.id}/chunks/${key}`
          storage
            .ref(path)
            .put(chunk)
            .on(
              "state_changed",
              (snapshot) => {
                const prog = Math.round(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                console.log(prog)
              },
              (err) => console.log(err),
              () => {
                addFileChunkToStorage(
                  messageDoc.id,
                  chat.id,
                  scrollToBottom,
                  key,
                  chunk.size / 1024 / 1024,
                  path,
                  fileDoc.id
                );
              }
            );
        })
      );

    // const messageSnap = await messageDoc.get();

    // let bodyNotify;

    // if (messageSnap?.data()?.type === "text-image") {
    //     bodyNotify = chat.name + " sent you a message ";
    //   } else {
    //     bodyNotify = chat.name + " : " + messageSnap?.data()?.message;
    //   }
    // } else {
    //   if (messageSnap?.data()?.type === "text-image") {
    //     bodyNotify = userEmail + " sent a message ";
    //   } else {
    //     bodyNotify = userEmail + " : " + messageSnap?.data()?.message;
    //   }
    // }

    // sendNotificationFCM("New message !", "Send file success", recipientFcmToken).catch(
    //   (err) => console.log(err)
    // );
      }
  }
};