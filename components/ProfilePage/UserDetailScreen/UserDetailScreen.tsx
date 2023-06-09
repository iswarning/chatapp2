import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase";
import { useEffect, useState } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MailIcon from "@mui/icons-material/Mail";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { CustomAvatar } from "../../ChatPage/Chat";
import styled from "styled-components";

function UserDetailScreen({ userInfo }: any) {
  //   const [user] = useAuthState(auth);
  //   const [isShow, setShow] = useState(false);

  //   useEffect(() => {
  //   }, []);

  return (
    <ModalContainer>
      {/* <Loading isShow={isShow} /> */}
      <div className="max-w-sm bg-white rounded-lg overflow-hidden shadow-lg">
        <div className="border-b px-4 py-6">
          <div className="text-center">
            <CustomAvatar
              src={userInfo?.photoURL!}
              height={200}
              width={200}
              alt=""
              className="h-32 w-32 rounded-full border-4 border-white mx-auto my-2"
            />
            <div className="py-2">
              <h3 className="text-3xl font-medium text-gray-700">
                {userInfo?.fullName}
              </h3>
              <p className="font-light text-gray-600 mt-3">
                <LocationOnIcon fontSize="small" />
                &nbsp;Los Angeles, California
              </p>

              <p className="mt-2 text-gray-500">
                <MailIcon fontSize="small" />
                &nbsp;{userInfo?.email}
              </p>
              <p className="mt-2 text-gray-500">
                <LocalPhoneIcon fontSize="small" />
                &nbsp;
                {parsePhoneNumber(
                  String(userInfo?.phoneNumber ?? "0909999000")
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="px-4 py-4">
          <div className="flex gap-2 items-center text-gray-800r mb-4">
            <svg
              className="h-6 w-6 text-gray-600"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path
                className=""
                d="M12 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm9 11a1 1 0 0 1-2 0v-2a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v2a1 1 0 0 1-2 0v-2a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v2z"
              />
            </svg>
            <span>
              <strong className="text-black">12</strong> Mutual Friends
            </span>
          </div>
          <div className="flex">
            <div className="flex justify-end mr-2">
              <img
                className="border-2 border-white rounded-full h-10 w-10 -mr-2"
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt=""
              />
              <img
                className="border-2 border-white rounded-full h-10 w-10 -mr-2"
                src="https://randomuser.me/api/portraits/women/31.jpg"
                alt=""
              />
              <img
                className="border-2 border-white rounded-full h-10 w-10 -mr-2"
                src="https://randomuser.me/api/portraits/men/33.jpg"
                alt=""
              />
              <img
                className="border-2 border-white rounded-full h-10 w-10 -mr-2"
                src="https://randomuser.me/api/portraits/women/32.jpg"
                alt=""
              />
              <img
                className="border-2 border-white rounded-full h-10 w-10 -mr-2"
                src="https://randomuser.me/api/portraits/men/44.jpg"
                alt=""
              />
              <img
                className="border-2 border-white rounded-full h-10 w-10 -mr-2"
                src="https://randomuser.me/api/portraits/women/42.jpg"
                alt=""
              />
              <span className="flex items-center justify-center bg-white text-sm text-gray-800 font-semibold border-2 border-gray-200 rounded-full h-10 w-10">
                +999
              </span>
            </div>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
}

const ModalContainer = styled.div`
  margin-top: 10%;
  width: 400px;
  height: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const parsePhoneNumber = (phone: string) => {
  if (phone.length === 10) {
    return (
      phone.slice(0, 4) + "." + phone.slice(4, 7) + "." + phone.slice(7, 10)
    );
  }
};
export default UserDetailScreen;
