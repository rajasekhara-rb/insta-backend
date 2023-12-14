import axios from "axios";
import crypto from "crypto";
import { cloudinary_api_key, cloudinary_api_secret_key } from "../keys.js";

const getPublicIdFromUrl = (url) => {
    const regex = /\/v\d+\/([^/]+)\.\w{3,4}$/;

    const match = url.match(regex);

    return match ? match[1] : null;
}

const generateSHA1 = (data) => {
    const hash = crypto.createHash("sha1");
    hash.update(data);
    return hash.digest("hex");
}

const generateSignature = (publicId, apiSecret) => {
    const timestamp = new Date().getTime();
    return `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`
}

const deleteCloudinayImage = async (cloudinaryUrl) => {
    const publicId = getPublicIdFromUrl(cloudinaryUrl);
    const cloudName = "rajasekhararb"
    const timestamp = new Date().getTime();
    const apiKey = cloudinary_api_key;
    const apiSecret = cloudinary_api_secret_key;
    const signature = generateSHA1(generateSignature(publicId, apiSecret));
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;

    try {
        const response = axios.post(url, {
            public_id: publicId,
            signature: signature,
            api_key: apiKey,
            timestamp: timestamp,
        });
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}

export {
    deleteCloudinayImage
}