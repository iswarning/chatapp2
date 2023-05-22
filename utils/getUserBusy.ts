export default async function getUserBusy() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SOCKET_IO_URL}/getUserBusy`, {
        method: 'GET',
        headers: {
            accept: 'application/json',
        },
    });
        
    return await response.json();
}