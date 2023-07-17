import React from 'react'
import styled from 'styled-components'
import CancelIcon from '@mui/icons-material/Cancel';
import {useSelector,useDispatch} from 'react-redux'
import { selectAppState } from '@/redux/appSlice';
import { v4 as uuidv4 } from 'uuid'
import { setPrepareImages } from '@/services/CacheService';

export default function PrepareSendImageScreen() {

  const appState = useSelector(selectAppState)
  const dispatch = useDispatch()

  const removeItem = (size: any) => {
    let index = appState.prepareImages.findIndex((image) => image.size === size)
    const newArr = [...appState.prepareImages]
    if(newArr.length === 1) {
      setPrepareImages([], dispatch)
    } else {
      newArr.splice(index, 1)
      setPrepareImages(newArr, dispatch)
    }
  }

  return (
    <>
      <div className="box">
          <hr/>
          <div className="flex p-2 overflow-y-auto">
            {
              appState.prepareImages.map((image) => image.type === "file" ? <ContainerFile key={uuidv4()}>  
                <TextFile>{image.extension.toUpperCase()}</TextFile>
                <RemoveButton onClick={() => removeItem(image.size)} style={{top: "-8px", right: "-8px"}}>
                  <CancelIcon fontSize="small" />
                </RemoveButton>
              </ContainerFile> : <ContainerImage key={uuidv4()}>
                <ImageGridItem src={image.url} />
                <RemoveButton onClick={() => removeItem(image.size)} style={{top: "-4px", right: "-4px"}}>
                  <CancelIcon fontSize="small" />
                </RemoveButton>
              </ContainerImage>)
            }
          </div>
        </div>
    </>
  )
}

const ContainerImage = styled.div`
  position: relative;
`

const ContainerFile = styled.div`
  position: relative;
  background: #AFBFCB;
  width: 75px;
  height: 75px;
  border-radius: 10px;
  margin: 5px;
`

const TextFile = styled.p`
  color: white;
  text-align: center;
  line-height: 75px;
`

const RemoveButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  
  &:hover {
    opacity: 0.7;
  }

  &:focus {
    outline: none;
  }
`

const ImageGridItem = styled.img`
  width: 75px;
  height: 75px;
  border-radius: 10px;
  margin: 5px;
`
