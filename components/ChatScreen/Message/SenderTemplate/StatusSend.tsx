import React from 'react'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {useSelector} from 'react-redux'
import { StatusSendType, selectAppState } from "@/redux/appSlice";
import CancelIcon from '@mui/icons-material/Cancel';

export default function StatusSend({ lastIndex }: { lastIndex: boolean } ) {

    const appState = useSelector(selectAppState)

    function showStausSend() {
        if (lastIndex) {
            if (appState.statusSend !== null && appState.statusSend !== undefined) {
                switch(appState.statusSend) {
                    case StatusSendType.SENDING:
                        return <div className='ml-2'>
                            <CheckCircleOutlineIcon fontSize='small' titleAccess='Sending'/>
                        </div>
                    case StatusSendType.SENT:
                        return <div className='ml-2'>
                            <CheckCircleIcon fontSize='small' titleAccess='Sent'/>
                        </div>
                    case StatusSendType.ERROR:
                        return <div className='ml-2'>
                        <CancelIcon fontSize='small' titleAccess='Error'/>
                    </div>
                }
            } else return <div style={{marginLeft: "25px"}}></div>
        } else return <div style={{marginLeft: "25px"}}></div>
    }

  return (
    <>
        {
            showStausSend()
        }
    </>
  )
}
