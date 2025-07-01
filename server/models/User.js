const mongoose=require("mongoose");
const EmotionSchema=new mongoose.Schema({
    emotion:{
        type:String,
        required:true,
        enum:["Happy", "Sad", "Angry", "Surprised", "Neutral","Disgusted", "Fearful"]
    },
    timestamp:{
        type:Date,
        default:Date.now
    },
    method:{
        type:String,
        enum:["Camera", "Upload"],
        default:"Camera"
    },
    imgUrl:{
        type:String,
        required:true
    }

});
const UserSchema=new mongoose.Schema({
   firebaseUid:{
    type:String,
    unique:true,
    required:true
   },
   email:{
    type:String,
    required:true
   },
   createdAt:{
    type:Date,
    default:Date.now
   },
   emotionLogs:[EmotionSchema]
});
const User = mongoose.model("User", UserSchema);
const Emotion = mongoose.model("Emotion", EmotionSchema);

module.exports = { User, Emotion };