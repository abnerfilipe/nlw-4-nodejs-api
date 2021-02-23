import express, { response } from 'express';

const app = express();


app.get('/', (request, response)=>{
    return response.json({message: "HELLO WORLD"});   
})

app.post("/",(req, res)=>{
    return res.json({message: "dados salvos com sucesso!"})
})

app.listen(3333, ()=>console.log("Server is running!"))
