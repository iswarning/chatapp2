import { auth, db } from '@/firebase'
import { SidebarType, selectAppState, setAppGlobalState } from '@/redux/appSlice'
import { useAuthState } from 'react-firebase-hooks/auth'
import {useSelector,useDispatch} from 'react-redux'
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import styled from 'styled-components';

export default function Navbar() {

    const appState = useSelector(selectAppState)
    const dispatch = useDispatch()
    const [user] = useAuthState(auth)

    const CLASS_ACTIVE = "-intro-x side-menu__content__link text-gray-600 dark:text-gray-300 relative tooltip py-5 side-menu__content__link--active"
    const CLASS_NOT_ACTIVE = "-intro-x side-menu__content__link text-gray-600 dark:text-gray-300 relative tooltip py-5"

    return (
        <div className="side-menu hidden md:block top-0 left-0 fixed w-16 h-screen">
            <div className="side-menu__content box border-theme-3 dark:bg-dark-2 dark:border-dark-2 -intro-x border-r w-full h-full pt-16 flex flex-col justify-center overflow-hidden">
                
                <Btn 
                    onClick={() => dispatch(setAppGlobalState({ type: "setCurrentSidebar", data: SidebarType.CHAT }))} 
                    className={appState.currentSidebar === SidebarType.CHAT ? CLASS_ACTIVE : CLASS_NOT_ACTIVE} 
                    data-placement="right" 
                    data-content="chats"> 

                    <ChatOutlinedIcon/> 
                </Btn>
                
                <Btn 
                    onClick={() => dispatch(setAppGlobalState({ type: "setCurrentSidebar", data: SidebarType.GROUPS }))} 
                    className={appState.currentSidebar === SidebarType.GROUPS ? CLASS_ACTIVE : CLASS_NOT_ACTIVE} 
                    data-placement="right" 
                    data-content="groups"> 

                    <GroupsOutlinedIcon />
                </Btn>

                <Btn 
                    onClick={() => dispatch(setAppGlobalState({ type: "setCurrentSidebar", data: SidebarType.CONTACTS }))} 
                    className={appState.currentSidebar === SidebarType.CONTACTS ? CLASS_ACTIVE : CLASS_NOT_ACTIVE} 
                    data-placement="right" 
                    data-content="contacts"> 

                    <PeopleOutlinedIcon />
                </Btn>

                <Btn 
                    onClick={() => dispatch(setAppGlobalState({ type: "setCurrentSidebar", data: SidebarType.FRIEND_REQUEST }))} 
                    className={appState.currentSidebar === SidebarType.FRIEND_REQUEST ? CLASS_ACTIVE : CLASS_NOT_ACTIVE} 
                    data-placement="right" 
                    data-content="contacts"> 

                    <PersonAddAltOutlinedIcon />
                </Btn>

                <Btn 
                    onClick={() => dispatch(setAppGlobalState({ type: "setCurrentSidebar", data: SidebarType.PROFILE }))} 
                    className={appState.currentSidebar === SidebarType.PROFILE ? CLASS_ACTIVE : CLASS_NOT_ACTIVE} 
                    data-placement="right" data-content="profile"> 
                    
                    <ManageAccountsOutlinedIcon />
                </Btn>

            </div>
        </div>
    )
}

const Btn = styled.button`
    &:focus {
        outline: none;
    }
`