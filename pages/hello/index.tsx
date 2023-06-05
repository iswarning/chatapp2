
import React from "react";
import styled from "styled-components";

export default function Hello() {

    const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
        event.preventDefault();
        let data = event.clipboardData.items[0];
        console.log(data.type)
        if (data.type === "image/png")
        {
            let blob: any = data.getAsFile();
    
            let reader = new FileReader();
            reader.onload = function(event) {
                
            };
    
            reader.readAsDataURL(blob);
        }
    }

    return (
        <div>
            <div className="container mt-5">
                {/* <ContentEdit contentEditable="true" id="text-area"></ContentEdit> */}
                {/* <IMG src='http://www.destination360.com/north-america/us/montana/images/s/great-falls.jpg' /> */}
                <ContentEdit contentEditable="true" id="text-area" />
            </div>
        </div>
    )
}

const ContentEdit = styled.div`
    background-color: white;
    outline: #ccc;
    border-radius: 10px;
    padding: 20px;
    overflow: hidden;
    max-height: 200px;
    overflow-y: scroll;
    border: solid 1px #ccc;
    background-position: center;
    object-fit: cover;
    background-repeat: no-repeat;
`


