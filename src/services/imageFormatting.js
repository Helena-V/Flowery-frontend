const arrayBufferToBase64 = (buffer) => {
    let binary = ''
    let bytes = [].slice.call(new Uint8Array(buffer))
    bytes.forEach((byte) => binary += String.fromCharCode(byte))
    return window.btoa(binary)
}

export const formatListOfObjects = (objects) => {
    const formatted = objects.map(o => {
        if (!(o.image === null) && !(o.image === undefined)) {
            const newImageData = arrayBufferToBase64(o.image.imageData.data.data)
            const smallThumbnailData = arrayBufferToBase64(o.image.thumbnailSmall.data)
            const largeThumbnailData = arrayBufferToBase64(o.image.thumbnailLarge.data)
            o.image.imageData.data = `data:${o.image.imageData.contentType};base64,${newImageData}`
            o.image.thumbnailSmall = `data:${o.image.imageData.contentType};base64,${smallThumbnailData}`
            o.image.thumbnailLarge = `data:${o.image.imageData.contentType};base64,${largeThumbnailData}`
            return o
        }
        return o
    })
    return formatted
}

export const formatListOfImages = (images) => {
    const formatted = images.map(image => {
        const newImageData = arrayBufferToBase64(image.imageData.data.data)
        const smallThumbnailData = arrayBufferToBase64(image.thumbnailSmall.data)
        const largeThumbnailData = arrayBufferToBase64(image.thumbnailLarge.data)
        image.imageData.data = `data:${image.imageData.contentType};base64,${newImageData}`
        image.thumbnailSmall = `data:${image.imageData.contentType};base64,${smallThumbnailData}`
        image.thumbnailLarge = `data:${image.imageData.contentType};base64,${largeThumbnailData}`
        return image
    })
    return formatted
}