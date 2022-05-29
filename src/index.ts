import express from 'express'
import * as WebSocket from 'ws';
import * as http from 'http';
const { getLatLngObj } = require("tle.js/dist/tlejs.cjs");

const app = express()
const server = http.createServer(app);
app.use(express.json());
const wss = new WebSocket.Server({ server });
const PORT = process.env.PORT || 3001

const getISS = (_: any, res : any) =>  {
    const optionalTimestampMS = +new Date;//1502342329860;
    const latLonObj = getLatLngObj(tle, optionalTimestampMS);
    const finalObject = {...latLonObj, timestamp: optionalTimestampMS};
    //getTXT();
    res.send(finalObject);
}


var tles :TLELocal[] = [];

const tle = `ISS (ZARYA) 
1 44713C 19074A   22137.44061460  .00004673  00000-0  31310-3 0  1375 
2 44713  53.0533 316.6557 0001484  70.9551 312.7346 15.06394731    13`;

//ISS (ZARYA)
// 1 25544U 98067A   22138.48291186  .00009938  00000-0  18505-3 0  9996
// 2 25544  51.6428 123.6928 0004981 131.9577  12.1536 15.49498859340573

type TLELocal= {
    name: string;
    line1: string;
    line2: string;
  };

async function getTXT() 
{
    console.log("getTXT");
    const response = await fetch('https://celestrak.com/NORAD/elements/supplemental/starlink.txt');
    const data = await response.text();
    var array: string[] = data.toString().split('\n');
    let tleLocalList: TLELocal[] = [];
    for (var i = 0; i < array.length; i = i + 3) {
        if (array[i].length>0){
            var tle_local: TLELocal = {
                name: array[i].replace('\r', '').trimEnd(),
                line1: array[i + 1].replace('\r', '').trimEnd(),
                line2: array[i + 2].replace('\r', '').trimEnd()
            }
            tleLocalList.push(tle_local);
        }
    }
    tles = tleLocalList;
    
    return tleLocalList;
}


const getTLEs = async (_: any, res : any) => {
    var data : TLELocal[]= await getTXT();
    console.log(tles.length);
    res.send(data);
}




//#region Endpoints
app.get('/', (_, res) => {
    return res.send("OK");
  });
app.get('/getISS', getISS);
app.get('/getTLEs',getTLEs);


//#endregion
//#region Websocket
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

//#endregion

app.listen(PORT, ()=> {console.log('Server running on 3001')})

server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${8999} :)`);
});