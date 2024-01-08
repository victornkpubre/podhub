import { isAxiosError } from "axios";

export const catchAsyncError = (error: any) => {
    let errorMessage = error.message
    

    if(isAxiosError(error)) {
        const errorResponse = error.response?.data
        if (errorResponse) errorMessage = errorResponse.error

        if(error.message === "Request failed with status code 413") errorMessage = "File is to Large: Total Upload Limit is 5mb"
        
    }
    return errorMessage
}

export default catchAsyncError;