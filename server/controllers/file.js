import File from "../models/File.js";
import fs from "fs";

export const uploadFile = async (req, res) => {
    try {
        const {
            name,
            size,
            type,
            localUrl,
            lastModifiedDate,
            fileExtension,
        } = req.body;
        
        const newFile = new File({
            name,
            size,
            type,
            localUrl,
            lastModifiedDate,
            fileExtension,
        });

        const uploadedFile = await newFile.save();
        res.status(201).json(uploadedFile);
    } catch (error) {
        res.status(401).json({ msg: error.message });
    }
};


export const getFiles = async (req, res) => {
    try {
        const files = await File.find();
        res.status(200).json(files);
    } catch (error) {
        res.status(401).json({ msg: error.message });
    }
}


export const removeFile = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedFile = await File.findByIdAndDelete({ _id: id });

        const path = `public/assets/${deletedFile.name}`;

        fs.unlink(path, (err) => {
            if (err) {
                console.log('Error while deleting file !', err);
            } else {
                console.log('File deleted successfully !');
            }
        });

        res.status(200).json(deletedFile);
    } catch (error) {
        res.status(401).json({ msg: error.message });
    }
}