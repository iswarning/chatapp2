// const {RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole} = require('agora-token')
import { RtcTokenBuilder, RtcRole } from 'agora-token'

export const generateRtcToken = (chatRoomId: string, userId: string) => {
    // Rtc Examples
    const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID!;
    const appCertificate = process.env.NEXT_PUBLIC_AGORA_APP_CERTIFICATE!;
    const channelName = chatRoomId;
    const uid = userId;
    const userAccount = userId;
    const role = RtcRole.PUBLISHER;
  
    const expirationTimeInSeconds = 3600
  
    const currentTimestamp = Math.floor(Date.now() / 1000)
    // const currentTimestamp = Math.floor(Date.now() * 1000)
  
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds
  
    // IMPORTANT! Build token with either the uid or with the user account. Comment out the option you do not want to use below.
  
    // Build token with uid
    const tokenA = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs, privilegeExpiredTs);
    // console.log("Token With Integer Number Uid: " + tokenA);
  
    // Build token with user account
    // const tokenB = RtcTokenBuilder.buildTokenWithUserAccount(appId, appCertificate, channelName, userAccount, role, privilegeExpiredTs, privilegeExpiredTs);
    
    return tokenA
}
  