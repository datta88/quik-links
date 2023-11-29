import express from 'express';
import mongoose from 'mongoose';
import Link from './model/Link.js';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

const __dirname = path.resolve();

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    if (conn) {
        console.log(`MongoBD connected `)
    }
};

connectDB();

app.post('/link',async (req,res)=>{
    const {url,slug} = req.body;

    const randomSlug = Math.random().toString(36).substring(2,7);

    const link = new Link({
        url:url,
        slug:slug || randomSlug,
        //clicks,
    })
   try{
    const saved = await link.save();
    return res.json({
        success:true,
        data:{
           
            shortUrl: `${process.env.BASE_URL}/${saved.slug}`
        },
        Message:'Link saved successfull '
    });
   }
   catch(e){
   return res.json({
        success:false,
        Message:e.Message,
    })
   }
});

app.get('/:slug',async (req,res)=>{
    const {slug} = req.params;

    const link = await Link.findOne({slug: slug});

    await Link.updateOne({slug:slug}, {$set:{
        clicks: link?.clicks + 1 || 0
    }}
    )

    if(!link){
        return res.json({
            success:false,
            Message:"Link not found"
        })
    }
    res.redirect(link.url);
});

app.get("/api/link", async(req,res)=>{
    const links = await Link.find({});

    return res.json({
        success:true,
        data:links,
        Message:'Links fetched successfully'
    })
});

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, '..', 'cli', 'build')));

    app.get('*',(req,res)=>{
        res.sendFile(path.join(__dirname, '..', 'cli', 'build', 'index.html'))
    })
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`);
})