import { Avatar } from "@mui/material";
import styled from "styled-components";

export default function User({ user }: any) {

    return (
        <div className="col-xl-3 sm:mx-3 md:mx-3 lg:mx-2 xl:mx-2 mt-16 bg-white shadow-xl rounded-lg text-gray-900" style={{padding: 0}}>
            <div className="rounded-t-lg h-32 overflow-hidden">
                <img className="w-full" src='/images/cover-image.jpg' alt='Mountain'/>
            </div>
            <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
                <img className="object-cover object-center h-32" src={user?.photoURL} alt='Woman looking front'/>
            </div>
            <div className="text-center mt-2">
                <h2 className="font-semibold">{user?.fullName}</h2>
                <p className="text-gray-500">Software Engineer</p>
            </div>
            <div className="p-4 border-t mt-2 mx-auto d-flex">
                <button className="w-1/2 block mx-2 rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2" onClick={onChat}>Add friend</button>
                <button className="w-1/2 block mx-2 rounded-full hover:shadow-lg font-semibold text-black px-6 py-2" style={{border: '1px solid'}}>Remove</button>
            </div>
        </div>
    )
}