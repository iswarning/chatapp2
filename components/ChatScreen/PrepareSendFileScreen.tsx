import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import CancelIcon from '@mui/icons-material/Cancel';
import {useSelector,useDispatch} from 'react-redux'
import { selectAppState } from '@/redux/appSlice';
import { v4 as uuidv4 } from 'uuid'
import { setPrepareSendFiles } from '@/services/CacheService';

export default function PrepareSendFileScreen() {

  const appState = useSelector(selectAppState)
  const dispatch = useDispatch()

  const removeItem = (size: any) => {
    let index = appState.prepareSendFiles.findIndex((image) => image.size === size)
    const newArr = [...appState.prepareSendFiles]
    if(newArr.length === 1) {
      setPrepareSendFiles([], dispatch)
    } else {
      newArr.splice(index, 1)
      setPrepareSendFiles(newArr, dispatch)
    }
  }

  return (
    <>
      <div className="box">
          <hr/>
          <div className="flex p-2 overflow-y-auto">
            {
              appState.prepareSendFiles.map((file) => {
                let extension = file.name.split(".").pop()
                if(extension === "png" || extension === "jpg" || extension === "jpeg") {
                  return <ImageElement key={uuidv4()} file={file} removeItem={removeItem} />
                } else  return <FileElement key={uuidv4()} extension={extension!} size={file.size} removeItem={removeItem} /> })
            }
          </div>
        </div>
    </>
  )
}

const ImageElement = ({ file, removeItem }: { file: File, removeItem: any }) => {

  const [url, setUrl] = useState("")

  useEffect(() => {
    if (FileReader) {
      let fr = new FileReader();
      fr.onload = function () {
        setUrl(String(fr.result))
      }
      fr.readAsDataURL(file);
    }
  },[])

  return (
    <ContainerImage>
      <ImageGridItem src={url} />
      <RemoveButton onClick={() => removeItem(file.size)} style={{top: "-4px", right: "-4px"}}>
        <CancelIcon fontSize="small" />
      </RemoveButton>
    </ContainerImage>
  )
}

const FileElement = ({ extension, size, removeItem }: { extension: string, size: number, removeItem: any }) => {

  return (
    <ContainerFile>  
      <TextFile>{extension.toUpperCase()}</TextFile>
      <RemoveButton onClick={() => removeItem(size)} style={{top: "-8px", right: "-8px"}}>
        <CancelIcon fontSize="small" />
      </RemoveButton>
    </ContainerFile>
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
