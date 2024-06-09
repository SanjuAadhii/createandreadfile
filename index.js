import express from "express";
import fs from "fs";
import {fileURLToPath} from "url";
import { format } from "date-fns";
import path, { dirname } from "path"

const PORT =3000;
const app=express()

const __dirname = path.dirname(fileURLToPath(import.meta.url))

app.use(express.static(path.join(__dirname,"public")));

app.get("/",(req,res)=>{
  res.sendFile(path.join(__dirname,"public","index.html"))
});

app.get("/createFile",(req,res)=>{
try{
    let present = format(new Date(),"dd-MM-yyyy-HH-mm-ss");
    fs.writeFileSync(
        path.join(__dirname,`timestamps/${present}.txt`),
        `${present}`,
        "utf8"
    );
    let data =fs.readFileSync(
        path.join(__dirname,`timestamps/${present}.txt`),
        "utf8"
    )
data+=`<br><a href="/">Return to home page</a><br>`

res.status(200).send(data)
}   
catch(err){
    console.log(err);
    res.status(500).send("error retrieving data")
}


})

app.get("/readFiles",(req,res)=>{
    let filesDir = path.join(__dirname, "timestamps");
    fs.readdir(filesDir, (err, files) => {
      if (err) {
        console.log(err);
        res.status(500).send("error");
      } else {
        const textFiles = files.filter((file) => path.extname(file) === ".txt");
  
        let response = textFiles.join("<br>");
        response += `<br><a href="/">Return to Home</a>`;
       
        res.status(200).send(response);

      }
    });
});

app.listen(PORT,()=> console.log(`app listening ${PORT}`))