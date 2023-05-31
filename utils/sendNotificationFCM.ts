import Axios from 'axios'

export default async function sendNotificationFCM(title: string, body: string, fcm_token: string, bearer_token: string) {
    const data = {
        "message": {
            "token": fcm_token,
            "notification": {
              "title": title,
              "body": body
            },
            "webpush": {
              "fcm_options": {
                "link": "google.com"
              }
            }
          }
    }
    const response = await Axios.post(`https://fcm.googleapis.com//v1/projects/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/messages:send`, data, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + bearer_token,
        }
    })

    return response.data;
}