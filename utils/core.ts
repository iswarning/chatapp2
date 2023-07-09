import { toast } from "react-toastify";

export function parseTimeStamp(timestamp: any) {
    let dt = new Date(timestamp.seconds * 1000);
    return dt.getHours() + ":" + dt.getMinutes() + " " + dt.getDate() + "-" + dt.getMonth() + "-" + dt.getFullYear()
}

export function AlertError(message: string) {
    toast(message, {
        hideProgressBar: true,
        type: "error",
        autoClose: 5000,
    });
}

export function AlertInfo(message: string) {
    toast(message, {
        hideProgressBar: true,
        type: "info",
        autoClose: 5000,
    });
}

export function AlertSuccess(message: string) {
    toast(message, {
        hideProgressBar: true,
        type: "success",
        autoClose: 5000,
    });
}