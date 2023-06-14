import { db, storage } from "@/firebase";
import { toast } from "react-toastify";
import firebase from "firebase";
import { MessageType } from "@/types/MessageType";
import { ChatType } from "@/types/ChatType";
import sendNotificationFCM from "@/utils/sendNotificationFCM";
import { getImageTypeFileValid } from "@/utils/getImageTypeFileValid";

export function onImageChange(event: any) {
  if (event.target.files && event.target.files.length > 0) {
    for (const file of event.target.files) {
      let img = file;
      let imgType = img["type"];
      let validImageTypes = ["image/jpeg", "image/png"];
      let fileSize = img.size / 1024 / 1024;
      if (!validImageTypes.includes(imgType)) {
        toast("Image upload invalid !", {
          hideProgressBar: true,
          type: "error",
          autoClose: 5000,
        });
        return;
      }
      if (fileSize > 5) {
        toast("Size image no larger than 5 MB !", {
          hideProgressBar: true,
          type: "error",
          autoClose: 5000,
        });
        return;
      }
      const imageElement = document.createElement("img");
      imageElement.src = URL.createObjectURL(img);
      document.getElementById("input-message")?.append(imageElement);
    }
  }
}

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
  index: number,
  chatId: string,
  scrollToBottom: any
) {
  storage
    .ref(`public/images/message/${messId}/#img-msg-${index}`)
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
          key: `#img-msg-${index}`,
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
  for (let i = 0; i < sizeInput; i++) {
    switch (inputMsgElement?.childNodes[i].nodeName) {
      case "#text":
        message += inputMsgElement?.childNodes[i].nodeValue;
        break;
      case "IMG":
        message += `<br>#img-msg-${countImg}<br>`;
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
              message += `<br>#img-msg-${countImg}<br>`;
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

  return { listImage, message };
}

export function pushUrlFileToFirestore(
  messId: string,
  chatId: string,
  scrollToBottom: any,
  key: string,
  size: number,
) {
  storage
    .ref(
      `public/files/message/${messId}/#file-msg-0/${key}`
    )
    .getDownloadURL()
    .then(async (url) => {
      await db
        .collection("chats")
        .doc(chatId)
        .collection("messages")
        .doc(messId)
        .collection("fileInMessage")
        .add({
          url: url,
          key: key,
          size: size,
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
  chatId: string,
  scrollToBottom: any) => {
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
    const { messageDoc } = await addMessageToFirebase("#file-msg-0", "file", userEmail, chatId);

    await db
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .doc(messageDoc.id)
      .collection("fileInMessage")
      .add({
        key: "#file-msg-0",
        size: fileSize,
        name: file.name,
    });

    await Promise.all(
      Array.prototype.map.call(chunks, async (chunk: Blob, index) => {
        let key = `chunk-${index}`;
        storage
          .ref(`public/files/message/${messageDoc.id}/#file-msg-0/${key}`)
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
              pushUrlFileToFirestore(
                messageDoc.id,
                chatId,
                scrollToBottom,
                key,
                chunk.size
              );
            }
          );
      })
    );
  }
};