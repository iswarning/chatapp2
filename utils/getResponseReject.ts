import getUserBusy from "./getUserBusy";

export default function getResponseReject(socketRef: any, user: any, onClose: any) {
    socketRef.current.on('response-reject-call', (res: string) => {
        let data = JSON.parse(res);
        if(data.recipient.includes(user?.email)) {
          if (!data.isGroup) {
            onClose();
          } else {
            getUserBusy().then((d) => {
              if(d.length === 1) {
                onClose();
              }
            })
          }
          return data.name;
        }
    });
    
    return null;
}