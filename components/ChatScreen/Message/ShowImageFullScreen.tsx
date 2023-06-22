import { useEffect, useState, useContext, ReactEventHandler, SyntheticEvent, useRef } from 'react'
import { 
    faMagnifyingGlassPlus,
    faMagnifyingGlassMinus,
    faRotateRight,
    faRotateLeft,
    faDownload
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {useSelector} from 'react-redux'
import { selectAppState } from '@/redux/appSlice'
import { db, storage } from '@/firebase'
import styled from 'styled-components'
import Image from 'next/image'
import { v4 as uuidv4 } from 'uuid'
import 'html2canvas'
import html2canvas from 'html2canvas'

const useImageLoaded = () => {
    const [loaded, setLoaded] = useState(false)
    const ref: any = useRef()
  
    const onLoad = () => {
      setLoaded(true)
    }
  
    useEffect(() => {
      if (ref.current && ref.current.complete) {
        onLoad()
      }
    })
  
    return [ref, loaded, onLoad]
}

export default function ShowImageFullScreen(
    { 
        urlImage, 
        onHide,
        chatId,
    }: { 
        urlImage: string, 
        onHide: any,
        chatId: string
    }) {

    const [scale, setScale] = useState(100)
    const [rotate, setRotate] = useState(0)
    const [urls, setUrls] = useState<Array<string>>([])
    const [urlImg, setUrlImg] = useState(urlImage)
    const appState = useSelector(selectAppState)
    const [ref, loaded, onLoad] = useImageLoaded()

    useEffect(() => {
        const getListImage = async() => {

            let path = `public/chat-room/${appState.currentChat.id}/photos`
            try {
                (await storage.ref(path).listAll()).items.forEach((photo) => {
                    photo.getDownloadURL().then((url) => setUrls((u: any) => [...u, url])).catch(err => console.log(err))
                })
            } catch (error) {
                console.log("Error get photos: ", error)
            }
        }
        getListImage().catch(err => console.log(err));
    },[])

    const handleEnlarge = () => {
        if(scale >= 100 && scale < 500)
            setScale(scale + 50)
    }

    const handleZoomOut = () => {
        if(scale > 100)
            setScale(scale - 50)
    }

    const handleRotateLeft = () => {
        setRotate(rotate - 90)
    }

    const handleRotateRight = () => {
        setRotate(rotate + 90)
    }

    const StyleImage = {
        scale: `${scale}%`, 
        transform: `rotate(${rotate}deg)`
    }

    const handleChangeImage = (url: any) => {
        document.querySelectorAll(".image").forEach((selector) => {
            selector.classList.remove("active")
        })
        setUrlImg(url);
    } 

    const handleDownload = () => {
        html2canvas(document.querySelector("body")!).then((canvas) => {
            let file = canvas.toDataURL("image/png")
            document.getElementById("download")?.setAttribute("href", file)
            document.getElementById("download")?.click()
        }).catch(err => console.log(err))
    }

    const handleOnload = (event: SyntheticEvent<HTMLImageElement, Event>) => {
        console.log()
    }

    return (
        <ScreenContainer>
            <ActionBarTop className='top-0 position-fixed right-0 d-flex'>
                <ButtonCustom onClick={onHide}>X</ButtonCustom>
            </ActionBarTop>
            <div className='flex' >
                <ContainerImage id='container-main-image'>
                    <MainImage src={urlImg} alt='' style={StyleImage} width={450} height={400}/>
                    {loaded && <h1>Loaded!</h1>}
                </ContainerImage>
                <ImageBox className='flex-column' style={{overflowY: urls?.length! > 7 ? 'scroll' : 'unset'}}>
                    { urls?.map((url: string) => <div key={uuidv4()} onClick={() => handleChangeImage(url)}>
                        {
                            (urlImg === url && urlImage !== urlImg) || urlImage === url ?
                            <ImageBoxElementActive className='image' ref={ref} onLoad={onLoad} alt='' src={url} width={100} height={100}/>
                            : <ImageBoxElement className='image' ref={ref} onLoad={onLoad} alt='' src={url} width={100} height={100}/>
                        }
                    </div>)
                    }
                </ImageBox>
            </div>                  
            <ActionBarBottom>
                {/* <a id='download' download="download.png">
                    <ButtonCustom>
                    <FontAwesomeIcon icon={faDownload} fontSize={25} onClick={handleDownload} />
                    </ButtonCustom>
                </a>&nbsp; */}
                
                <ButtonCustom>
                    <FontAwesomeIcon icon={faRotateLeft} fontSize={25} onClick={handleRotateLeft} />
                </ButtonCustom>&nbsp;
                <ButtonCustom>
                    <FontAwesomeIcon icon={faRotateRight} fontSize={25} onClick={handleRotateRight} />
                </ButtonCustom>&nbsp;
                <ButtonCustom disabled={scale === 500}>
                    <FontAwesomeIcon icon={faMagnifyingGlassPlus} fontSize={25} onClick={handleEnlarge} />
                </ButtonCustom>&nbsp;
                <ButtonCustom disabled={scale === 100}>
                    <FontAwesomeIcon icon={faMagnifyingGlassMinus} fontSize={25} onClick={handleZoomOut} />
                </ButtonCustom>
            </ActionBarBottom>
            
        </ScreenContainer>
    )
}

const ImageBoxElementActive = styled(Image)`
    width: 100px;
    height: 100px;
    border-radius: 10px;
    margin: 5px 0 5px 0;
    cursor: pointer;
    border: 5px solid #FEFEFE;
`

const ImageBoxElement = styled(Image)`
    width: 100px;
    height: 100px;
    border-radius: 10px;
    margin: 5px 0 5px 0;
    cursor: pointer;
    opacity: 0.5;
`

const ImageBox = styled.div`
    margin-top: 50px;
    margin-right: 20px;
    margin-left: auto;
    max-height: calc(100vh - 80px);
    padding-right: 20px;
    padding-bottom: 20px;
    z-index: 1;
    &::-webkit-scrollbar {
        width: 10px;
    }

    &::-webkit-scrollbar-track {
        border-radius: 8px;
        background-color: #e7e7e7;
        border: 1px solid #cacaca;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 8px;
        background-color: rgb(197,197,197);
    }
`

const MainImage = styled(Image)`
    border-radius: 10px;
    width: 450px;
    height: 400px;
`

const ContainerImage = styled.div`
    margin-left: 37%; 
    margin-right: auto; 
    margin-top: 13%;
`

const ButtonCustom = styled.button`
    margin-left: auto; 
    height: 5px; 
    width: 40px; 
    background: #545454; 
    border: none; 
    color: #FEFEFE;
`

const ActionBarTop = styled.div`
    background: #545454; 
    height: 40px; 
    padding: 5px; 
    width: 100%;
    z-index: 1;
    position: fixed;
    top: 0;
    right: 0;
    display: flex;
`

const ActionBarBottom = styled.div`
    background: #545454; 
    height: 40px; 
    padding: 5px; 
    width: 100%;
    z-index: 1;
    position: fixed;
    bottom: 0;
    text-align: center;
`

const ScreenContainer = styled.div`
    z-index: 1055;
    width: 100%; 
    height: 100%;
    background: #3E4041;
    position: fixed; 
    top: 0; 
    left: 0; 
    overflow-y: hidden;
    overflow-y: auto;
    outline: 0;
`