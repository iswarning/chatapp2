import { SubscriptionOnNotify } from "@/graphql/subscriptions";
import subscribe from "@/libs/subscribe";
// import subscribe from "@/libs/subscribe";
import { createMessage } from "@/services/MessageService";
import { Modal } from "@mui/material";
import dynamic from "next/dynamic";
import useSWR from 'swr'
// import { request, gql } from "graphql-request";
import { gql, useQuery, useSubscription } from "@apollo/client";
import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import CallEndIcon from '@mui/icons-material/CallEnd';

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
     
        return <ModalContainer open={true}>
            <div>
                <Pulse>
                    <img 
                    src="https://yt3.googleusercontent.com/-CFTJHU7fEWb7BYEb6Jh9gm1EpetvVGQqtof0Rbh-VQRIznYYKJxCaqv_9HeBcmJmIsp2vOO9JU=s900-c-k-c0x00ffffff-no-rj" 
                    alt="" 
                    className="rounded-full"/>
                </Pulse>
                
                <ActionContainer>
                    <AcceptBtn>
                        <LocalPhoneIcon fontSize="large" />
                    </AcceptBtn>
                    <RejectBtn>
                        <CallEndIcon fontSize="large" />
                    </RejectBtn>
                </ActionContainer>
            </div>
        </ModalContainer>
//         </>
    // )
    
}

const pulse = keyframes`
    0% {
        transform: scale(0.5);
        opacity: 0
    }

    50% {
        transform: scale(1);
        opacity: 1
    }

    100% {
        transform: scale(1.3);
        opacity: 0
    }
`

const Pulse = styled.div`
    height: 100px;
    width: 100px;
    margin-top: 100px;
    margin-left: auto;
    margin-right: auto;
    background-color: orange;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    &:before {
        content: "";
        position: absolute;
        border: 1px solid yellow;
        width: calc(100% + 40px);
        height: calc(100% + 40px);
        border-radius: 50%;
        animation: ${pulse} 1s linear infinite
    }

    &:after {
        content: "";
        position: absolute;
        border: 1px solid yellow;
        width: calc(100% + 40px);
        height: calc(100% + 40px);
        border-radius: 50%;
        animation: ${pulse} 1s linear infinite;
        animation-delay: 0.3s
    }

`;

const ActionContainer = styled.div`
    margin-top: 80px;
    text-align: center;
`

const RejectBtn = styled.button`
    margin-left: 50px;
    background-color: red;
    color: white;
    border-radius: 50%;
    padding: 10px;
`

const AcceptBtn = styled.button`
    background-color: #6bdd6b;
    color: white;
    border-radius: 50%;
    padding: 10px;
`

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