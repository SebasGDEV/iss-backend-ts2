import express from 'express'
import * as WebSocket from 'ws';
import * as http from 'http';
import userRoutes from './routes/routes';

const app = express()
const server = http.createServer(app);
app.use(express.json());
app.use('/', userRoutes);

const wss = new WebSocket.Server({ server });
const PORT = process.env.PORT || 3001

wss.on('connection', (ws: WebSocket) => {
    
    //connection is up, let's add a simple simple event
   /* ws.on('message', (message: string) => {
        console.log(message.toString());
        //const tlebyMessage = getTLEbyMessage(message.toString());
        //console.log(tlebyMessage.toString());
        setInterval(() => {
            if (ws.bufferedAmount==0)
            {
                const optionalTimestampMS = +new Date;//1502342329860;
                const latLonObj = getLatLngObj(tlebyMessage, optionalTimestampMS);
                const nameOfSatellite = getSatelliteName(tlebyMessage, optionalTimestampMS);
                const finalObject = { name: nameOfSatellite, message: message.toString(), latLonObj, timestamp: optionalTimestampMS};
                //console.log(tlebyMessage.toString());
                ws.send(JSON.stringify(finalObject))
                }
        },500)
        
    });*/
    //send immediatly a feedback to the incoming connection    
    ws.send('Im a websocket server');
});

app.listen(PORT, ()=> {console.log('Server running on 3001')})

server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${8999} :)`);
});