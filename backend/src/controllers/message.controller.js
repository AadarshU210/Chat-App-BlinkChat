import Message from "../models/message.Model.js";
import User from "../models/user.Model.js";
import cloudinary from "../utils/cloudinary.js";
import { getReceiverSocketId, io } from "../utils/socket.js";

export const getUsersForSidebar = async(req, res) => {
   try{
     const loggedInUserId = req.user._id;
     const filteredUsers = await User.find({_id: {$ne: loggedInUserId} }).select("-password")
     res.status(200).json(filteredUsers);
    }catch(error){
     console.error("Error in getUsersForSidebar: ", error.message);
     res.status(500).json({error: "Internal Server Error"})
   }
}

export const getMessages = async(req, res) => {
    try{
      const {id: userToChatId} = req.params
      const currentUserId = req.user._id
      const messages = await Message.find({
        $or:[
            {senderId:currentUserId, receiverId: userToChatId},
            {senderId:userToChatId, receiverId: currentUserId}
        ]
      })

      res.status(200).json(messages)
    }catch{
      console.error("Error in getMessages controller: ", error.message);
      res.status(500).json({error: "Internal Server Error"})
    }
}

export const sendMessage = async(req, res) => {
   try {
     const { text, image} = req.body;
     const {id: receiverId} = req.params;
     const currentUserId = req.user._id;

     let imageUrl;

     if(image){
        // Upload base64 image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url
     }

     const newMessage = new Message({
        senderId: currentUserId,
        receiverId,
        text,
        image: imageUrl
     })

     await newMessage.save();
     
     // SocketId of user to whom we are sending message
     const receiverSocketId = getReceiverSocketId(receiverId)
     if(receiverSocketId){
      //io.emit() will broadcast event to all socket ids, therefore we have to be specific
      io.to(receiverSocketId).emit("newMessage", newMessage)
     }

     res.status(201).json(newMessage)
   }catch(error){
     console.error("Error in sendMessage controller: ", error.message);
     res.status(500).json({error: "Internal Server Error"})
   }
}