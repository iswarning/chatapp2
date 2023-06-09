import Axios from "axios";

export default async function sendNotificationFCM(
  title: string,
  body: string,
  fcm_token: string | undefined
) {
  const data = {
    to: fcm_token,
    notification: {
      body: body,
      title: title,
    },
  };
  const response = await Axios.post(
    `https://fcm.googleapis.com/fcm/send`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "key=" + process.env.NEXT_PUBLIC_FIREBASE_SERVER_KEY,
      },
    }
  );

  return response.data;
}
