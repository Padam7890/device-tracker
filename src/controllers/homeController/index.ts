import asyncHandler from "../../middlewares/asyncHandler";

const homeController = asyncHandler(async(req,res)=>{
    res.render("index.ejs")
});


export default homeController;
