const getRecipientEmail = ({users, userLoggedIn}:any) => 
    users?.filter((userToFilter: any) => userToFilter !== userLoggedIn?.email)[0];

export default getRecipientEmail;