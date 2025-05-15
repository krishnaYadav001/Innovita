import { getStorage } from "@/libs/AppWriteClient"

/**
 * A simple hook for uploading images without any processing or dependencies
 * This avoids using canvas or image-js which can cause deployment issues
 */
const useSimpleImageUpload = async (file: File, currentImage: string) => {
    // Generate a random ID for the image
    const imageId = Math.random().toString(36).slice(2, 22)

    try {
        // Simply upload the file as is
        const result = await getStorage().createFile(
            String(process.env.NEXT_PUBLIC_BUCKET_ID), 
            imageId, 
            file
        );

        // If current image is not default image, delete it
        if (currentImage && currentImage !== String(process.env.NEXT_PUBLIC_PLACEHOLDER_DEFAULT_IMAGE_ID)) {
            try {
                await getStorage().deleteFile(
                    String(process.env.NEXT_PUBLIC_BUCKET_ID), 
                    currentImage
                );
            } catch (deleteError) {
                console.error("Error deleting old image:", deleteError);
                // Continue even if delete fails
            }
        }

        return result?.$id;
    } catch (error) {
        console.error("Error in useSimpleImageUpload:", error);
        throw error;
    }
}

export default useSimpleImageUpload;
