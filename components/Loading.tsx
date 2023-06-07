import ReactLoading from "react-loading";
import styled from "styled-components";

export default function Loading({isShow}: any) {
    return (
        <>
            { isShow ? <LoadingOverlay>
                    <LoadingContainer>
                        <ReactLoading type='spinningBubbles' color="#02FFFF" />
                    </LoadingContainer>
                </LoadingOverlay> : <div></div>}
        </>
        
    )
}

const LoadingOverlay = styled.div`
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    opacity: 0.9;
    z-index: 1000;
`

const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    min-height: 100vh;
`