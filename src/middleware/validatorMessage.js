import { isCelebrateError } from "celebrate";

export const handleValidatorMessage = async(err, req, res, next) => {
    try{
        if(isCelebrateError(err)){
            let errorBoddy = {}
            if(err.details.get("body")){
                errorBoddy = err.details.get("body")
            }else if(err.details.get("query")){
                errorBoddy = err.details.get("query")
            }else if(err.details.get("headers")){
                errorBoddy = err.details.get("headers")
            }
            return res.status(400).json({status: false, message: errorBoddy.details[0].message})
        }

    }catch(error){
        console.log("erroor in handleValidatorMessage-> ",error);
        res.status(400).json({status: false, message: error.message})
    }
}