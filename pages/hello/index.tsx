import Head from "next/head";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useState } from "react";

export default function Hello() {

    const [show, setShow] = useState(false);

    const handleClick = () => {
        setShow(!show);
        if(show) {
            document.getElementById("snackbar")?.classList.add("show")
        } else {
            document.getElementById("snackbar")?.classList.remove("show")
        }
    }

    return (
        <>
            <button onClick={handleClick}>Show Snackbar</button><div id="snackbar">Some text some message..</div>
        </>
        
    )
}


