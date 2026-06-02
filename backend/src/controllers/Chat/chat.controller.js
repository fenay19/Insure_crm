const { ChatModel, AdminModel } = require("../../models");
const httpStatus = require("http-status");

const getMessages = async (req, res) => {
    try {
        const { from, to } = req.body;
    
        const messages = await ChatModel.find({
          // users: {
          //   $all: [from, to],
          // },
          $or:[{sender : from, receiver : to,},{sender : to, receiver : from,}]
        }).sort({ updatedAt: 1 });

        const projectedMessages = messages.map((msg) => {
          return {
            fromSelf: msg.sender.toString() === from,
            message: msg.message.text,
          };
        });
        res.json(projectedMessages);
      } catch (error) {
        console.error(error);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal server error" });
      }
};


const addMessage = async (req, res) => {
    try {
        const { from, to, message } = req.body;
        const data = await ChatModel.create({
            message: { text: message },
            sender: from,
            receiver: to,
        });
    
        if (data){
            return res.json({ msg: "Message added successfully." })
        }else {
            return res.json({ msg: "Failed to add message to the database" });
        } 
    }catch (error) {
      console.error(error);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal server error" });
    }
  };

const getAllUsers = async (req, res, next) => {
    try {
      const users = await AdminModel.find({ _id: { $ne: req.params.id } }).select([
        "email","name","avatarImage","_id",
      ]);
      return res.json(users);
    } catch (error) {
      console.error(error);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal server error" });
    }
};

module.exports = {
    getMessages,
    addMessage,
    getAllUsers
};

