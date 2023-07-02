import { storage } from '@/firebase'
import React, { useState } from 'react'

export default function index() {
    const [images, setImages] = useState<any>([])
  const [progress, setProgress] = useState<any>([])

  const handleFileChange = (e: any) => {
    const files = e.target.files
    const newImages: any = []
    for (let i = 0; i < files.length; i++) {
      newImages.push(files[i])
    }
    setImages(newImages)
  }

  const handleUpload = async () => {
    for (let i = 0; i < images.length; i++) {
      const image = images[i]
      const storageRef = storage.ref("public/chat-room/28i9wYK4NAXbd3Y5ON9b/files")
      const uploadTask = storageRef.put(image)
      uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100

        setProgress((prevProgress: any) => {
          const newProgress = [...prevProgress]
          newProgress[i] = progress.toFixed(2)
          return newProgress
        })
      }, (error) => {
        console.log(error)
      }, async () => {
        // const imageUrl = await getDownloadURL(uploadTask.snapshot.ref)
        // Add to Firestore
      })
    }
  }

  return (
    <div style={{marginLeft: "100px", marginTop: "100px"}}>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {progress.map((prog: any, i: number) => (
        <div key={i}>{images[i].name}  {prog}%</div>
      ))}
    </div>
  )
}
