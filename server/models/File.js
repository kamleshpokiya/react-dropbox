import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
    name: String,
    size: Number,
    type: String,
    localUrl: String,
    lastModifiedDate: Date,
    fileExtension: String,
});

const File = mongoose.model("File", FileSchema);

export default File;