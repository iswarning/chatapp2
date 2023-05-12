import SidebarUser from "@/components/SidebarUser/SidebarUser";
import Head from "next/head";

function Users() {

    return (
        <div>
            <Head>
                <title>Chatapp 2.0 - Search User Page</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <SidebarUser />
        </div>
    )
}

export default Users;