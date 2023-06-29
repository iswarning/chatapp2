export default async function requestPermission() {

    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
      }
    })

}

export async function requestMedia(): Promise<MediaStream | null> {
  return new Promise((resolve, reject) => {
    let now = Date.now();
    navigator.mediaDevices.getUserMedia({audio: true, video: true})
    .then(function(stream) {
      console.log('Got stream, time diff :', Date.now() - now);
      resolve(stream)
    })
    .catch(function(err) {
      console.log('GUM failed with error, time diff: ', Date.now() - now);
      reject(null)
    });
  })
  
}