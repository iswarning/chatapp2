import SidebarUser from "@/components/SidebarUser/SidebarUser";
import UserDetailScreen from "@/components/UserDetailScreen/UserDetailScreen";
import { db } from "@/firebase"
import getUserById from "@/services/users/getUserById";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function UserDetail({userData}: any) {

    const router = useRouter();

    useEffect(() => {
        console.log(userData);
    },[])

    return (
        <div className="d-flex">
            <SidebarUser />
            {/* <UserDetailScreen userData={} /> */}
        </div>
    )
}

export function getServerSideProps(context: any) {
    let result;
    getUserById(context.query.id).then((user) => {
        result = user;
    });
    
    return {
        props: {
            userData: JSON.stringify(result)
        }
    }
}