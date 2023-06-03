import Head from 'next/head'
import { Inter } from 'next/font/google'
import Layout from '@/components/Layout'
import { ReactElement, useEffect, useState } from 'react'
import type { NextPageWithLayout } from '../_app';
import Profile from '@/components/ProfilePage/Profile/Profile'
import { db } from '@/firebase';
import { useRouter } from 'next/router';
import UserDetailScreen from '@/components/ProfilePage/UserDetailScreen/UserDetailScreen';

const inter = Inter({ subsets: ['latin'] })

// import '@/styles/tailwind.min.css'
const Page: NextPageWithLayout = () => {

  const [userInfo, setUserInfo]: any = useState({});
  const router = useRouter();

  useEffect(() => {
    if (router?.query?.id !== undefined) {
        const getUserInfo = async() => {
          const data = await db.collection("users").doc(String(router?.query?.id)).get();
          if(data) {
              console.log(data.data())
              setUserInfo(data.data());
          }
        }
        getUserInfo().catch((err) => console.log(err));
    }
    
  },[])



  return (
    <>
      <Head>
        <title>Chatapp 2.0</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <SidebarMessage /> */}

        <div className="main flex-1 flex flex-col">
            <div className="hidden lg:block heading flex-2">
                <h1 className="text-3xl text-gray-700 mb-4">Profile</h1>
            </div>

            <div className="flex-1 flex h-full">
              {
                router.query.id !== undefined ? <UserDetailScreen userInfo={userInfo} /> : <Profile />
              }
            </div>
        </div>

    </>
  )
}
 
Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      {page}
    </Layout>
  );
};

export default Page;
