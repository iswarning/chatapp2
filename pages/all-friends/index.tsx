import Head from 'next/head'
import { Inter } from 'next/font/google'
import SidebarMessage from '@/components/SidebarMessage/SidebarMessage'
import Layout from '@/components/Layout'
import { ReactElement } from 'react'
import type { NextPageWithLayout } from '../_app';
import ChatScreen from '@/components/ChatScreen/ChatScreen'
import FriendRequestsListScreen from '@/components/FriendRequestsListScreen/FriendRequestsListScreen'
import styled from 'styled-components'
import FriendsListScreen from '@/components/FriendsListScreen/FriendsListScreen'

const inter = Inter({ subsets: ['latin'] })

// import '@/styles/tailwind.min.css'
const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Chatapp 2.0</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

        <div className="main flex-1 flex flex-col">
            <div className="hidden lg:block heading flex-2">
                <h1 className="text-3xl text-gray-700 mb-4">Friend Requests</h1>
            </div>
            <FriendsListScreen />
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