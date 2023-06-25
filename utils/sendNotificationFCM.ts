import Axios from "axios";

export default async function sendNotificationFCM(
  title: string,
  message: string,
  data: any,
  fcm_token: string | undefined
) {
  const body = {
    to: fcm_token,
    notification: {
      body: message,
      title: title
    },
    data: data
  };
  const response = await Axios.post(
    `https://fcm.googleapis.com/fcm/send`,
    body,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "key=" + process.env.NEXT_PUBLIC_FIREBASE_SERVER_KEY,
      },
    }
  );

  return response.data;
}
