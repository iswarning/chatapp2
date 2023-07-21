import { SubscriptionOnNotify } from "@/graphql/subscriptions";
import subscribe from "@/libs/subscribe";
// import subscribe from "@/libs/subscribe";
import { createMessage } from "@/services/MessageService";
import { Modal, styled } from "@mui/material";
import dynamic from "next/dynamic";
import useSWR from 'swr'
// import { request, gql } from "graphql-request";
import { gql, useQuery, useSubscription } from "@apollo/client";
import { useEffect } from "react";

const AgoraUIKit = dynamic(() => import('agora-react-uikit'), {
    ssr: false
});

// const fetcher = (query: string) => request(process.env.NEXT_PUBLIC_GRAPHQL_ENPOINT!, query);

// const subscribeData = async(...args: any[]) => {
//     return subscribe(SubscriptionOnNotify)
// }

export default function Page() {
    // const [videoCall, setVideoCall] = useState(true);
    
    // const channel = 'test'

    // const rtcProps = {
    //     appId: process.env.NEXT_PUBLIC_AGORA_APP_ID,
    //     channel: channel,
    //     token: process.env.NEXT_PUBLIC_AGORA_TOKEN
    // };

    // const callbacks = {
    //     EndCall: () => setVideoCall(false),
    // };

    // return videoCall ? (
    //     <div style={{display: 'flex', width: '100vw', height: '100vh'}}>
    //     <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
    //     </div>
    // ) : (
    //     <h3 onClick={() => setVideoCall(true)}>Start Call</h3>
    // );

    const COMMENTS_SUBSCRIPTION = gql`
        subscription {
            onSub {
                message
                senderId
                recipientId
                type
                dataNotify {
                    message {
                        message
                        createdAt
                    }
                }
            }
        }
    `

    const { data, error, loading } = useSubscription(
        COMMENTS_SUBSCRIPTION
    );

    const click = () => {
         createMessage({
            message: "hello",
            senderId: "64b4a8fac0c445d791856ff7",
            type: "text",
            chatRoomId: "64b4e00301c414b7a739e99e"
        })
    }

    return (
        <>
        <div style={{marginTop: "100px", marginLeft: "100px"}}>
            <button onClick={click} >CLick</button>
            {
                loading ? <div>Loading...</div> : null
            }
            <div>
                { data ? data?.onSub?.message : null }
            </div>
        </div>

        
        {/* <ModalContainer open={true}>
            <div className="text-center">
                <img 
                src="https://yt3.googleusercontent.com/-CFTJHU7fEWb7BYEb6Jh9gm1EpetvVGQqtof0Rbh-VQRIznYYKJxCaqv_9HeBcmJmIsp2vOO9JU=s900-c-k-c0x00ffffff-no-rj" 
                width={50} 
                height={50} 
                alt="" 
                className="rounded-full"/>
            </div>
        </ModalContainer> */}
        </>
    )
    
}

const ModalContainer = styled(Modal)`
    width: 500px;
    height: 500px;
    background: white;
    margin-left: auto;
    margin-right: auto;
    margin-top: 10%;
    border-radius: 10px;
    padding: 30px;
`