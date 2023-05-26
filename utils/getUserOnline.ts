export default async function getUserOnline() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SOCKET_IO_URL}/getUserOnline`, {
        method: 'GET',
        headers: {
            accept: 'application/json',
        },
    });
        
    return await response.json();
}