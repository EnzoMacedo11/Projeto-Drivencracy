import { MongoClient } from "mongodb";
import dotenv from "dotenv"

dotenv.config();

let db;

const mongoClient = new MongoClient(process.env.MONGO_URL)

export default async function connectMongoDB(){

    try{
        await mongoClient.connect();
        db = mongoClient.db("Drivencracy")
        console.log("conectado ao servidor")
    }catch(err){
        console.log(err);
    }
    return db

}