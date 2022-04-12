const express = require('express');
const cors = require('cors')
const PORT = 5000;
const app = express();
app.use(cors())


const urls = {
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ': {count: 0, sendto: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', shorty: '/fortis'}
}

const randomizeURL = () => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

const findSendto = (shortId) => {
    let data = ''
    Object.values(urls).forEach(({sendto, shorty}) => {
        if(shorty === shortId) {
            data = sendto;
        }
    });
    return data
}

app.use(
    express.urlencoded({
      extended: true
    })
  )
  app.use(express.json())


app.get('/', (req,res) => {
    res.status(200).send('hello')
})

app.get('/shortys/:shortId', (req,res) => {
    const shortId = req.params.shortId
    const sendto = findSendto(shortId)
    if(sendto) {
        urls[sendto].count++
        res.redirect(sendto)
    }else {
        res.status(404).send('URL not found')
    }
})

app.post('/shortMyURL', (req,res) => {
    if(urls[req.body.url]){
        res.send(urls[req.body.url])
    }else{
        urls[req.body.url] = {
            sendto: req.body.url,
            count: 0,
            shorty: randomizeURL(),
        }
        res.send(urls[req.body.url])
    }
})

app.listen(
    PORT,
    () => console.log(`backend running on http:localhost:${PORT}`)
)