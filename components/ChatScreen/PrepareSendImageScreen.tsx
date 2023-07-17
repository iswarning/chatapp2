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
          <div className="flex p-2">
            {
              appState.prepareImages.map((image) => <div key={uuidv4()} style={{position: "relative"}}>
                <ImageGridItem src={image.url} />
                <RemoveButton onClick={() => removeItem(image.size)}>
                  <CancelIcon fontSize="small" />
                </RemoveButton>
              </div>)
            }
          </div>
        </div>
    </>
  )
}

const RemoveButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  margin-right: 10px;
  margin-top: 5px;
  
  &:hover {
    opacity: 0.7;
  }

  &:focus {
    outline: none;
  }
`

const ImageGridItem = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 10px;
  margin: 5px;
`
