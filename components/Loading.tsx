import { SyncLoader } from "react-spinners";
import styled from "styled-components";

export default function Loading({isShow}: any) {
    
    return (
        <>
            {
                isShow ? <>
                    <SpinnerContainer>
                        <SyncLoader color="rgb(13, 163, 186)" style={{marginTop: 'auto'}} />
                    </SpinnerContainer>
                    <SpinnerOverlay></SpinnerOverlay>
                </> : null
            }
        </>
        
    )
}

const Container = styled.div``

const SpinnerContainer = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 60;
    z-index: 1001;
`

const SpinnerOverlay = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    opacity: 30%;
    z-index: 1000;
`