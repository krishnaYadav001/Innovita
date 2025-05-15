import { getStorage } from "@/libs/AppWriteClient" // Use getter function

// This is a version of useChangeUserImage that doesn't rely on canvas or image-js
const useChangeUserImageNoCanvas = async (file: File, cropper: any, currentImage: string) => {
    let imageId = Math.random().toString(36).slice(2, 22)

    try {
        // Upload the original file without processing
        // This skips the image-js processing which might depend on canvas
        const result = await getStorage().createFile(
            String(process.env.NEXT_PUBLIC_BUCKET_ID), 
            imageId, 
            file
        );

        // If current image is not default image, delete it
        if (currentImage != String(process.env.NEXT_PUBLIC_PLACEHOLDER_DEFAULT_IMAGE_ID)) {
            await getStorage().deleteFile(
                String(process.env.NEXT_PUBLIC_BUCKET_ID), 
                currentImage
            );
        }

        return result?.$id;
    } catch (error) {
        console.error("Error in useChangeUserImageNoCanvas:", error);
        throw error;
    }
}

export default useChangeUserImageNoCanvas;
