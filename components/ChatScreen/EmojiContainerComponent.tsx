import styled from "styled-components"
import {getEmojiData} from "../../utils/getEmojiData"
import { v4 as uuidv4 } from 'uuid'

export default function EmojiContainerComponent({onAddEmoji}: any) {

    return (
        <Container className="chat-input__smiley dropdown-menu show">
            <div className="dropdown-menu__content box dark:text-gray-300 dark:bg-dark-3 shadow-md">
                <div className="flex flex-col pb-3 -mt-2">
                    <div className="px-3 pt-5">
                        <div className="relative">
                            <input type="text" className="form-control bg-gray-200 border-transparent pr-10" placeholder="Search emojis..."/>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search w-5 h-5 absolute my-auto inset-y-0 mr-3 right-0"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </div>
                    </div>
                    <div className="tab-content overflow-hidden mt-5">
                        <div className="h-full tab-pane active" id="history" role="tabpanel" aria-labelledby="history-tab">
                            <div className="font-medium px-3">Recent Emojis</div>
                                <div className="h-full pb-10 px-2 overflow-y-auto scrollbar-hidden mt-2">
                                <div className="grid grid-cols-8 text-2xl">
                                    { getEmojiData.map((emoji: number) => 
                                        <button key={uuidv4()} className="rounded hover:bg-gray-200 dark:hover:bg-dark-2 focus:outline-none" onClick={() => onAddEmoji(emoji)} >{String.fromCodePoint(emoji)}</button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="h-full tab-pane" id="smile" role="tabpanel" aria-labelledby="smile-tab">
                            <div className="font-medium px-3">Smileys &amp; People</div>
                            <div className="h-full pb-10 px-2 overflow-y-auto scrollbar-hidden mt-2">
                                <div className="grid grid-cols-8 text-2xl">
                                    <button className="rounded hover:bg-gray-200 dark:hover:bg-dark-2 focus:outline-none">😀</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )
}

const Container = styled.div`
    width: 320px;
    position: absolute;
    inset: auto auto 0px 0px;
    margin: 0px;
    transform: translate(736.8px, -75.6px);
`