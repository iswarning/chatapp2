import { CircularProgress } from "@mui/material";

export default function Login() {
    return (
        <center style={{ display: 'grid', placeItems: 'center', height: '100vh'}}>
            <div>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/768px-WhatsApp.svg.png" alt="" style={{ marginBottom: 10 }} height={200} />
            </div>
            <CircularProgress size={60}/>
        </center>
    )
}