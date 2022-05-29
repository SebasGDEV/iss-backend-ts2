"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const WebSocket = __importStar(require("ws"));
const http = __importStar(require("http"));
const { getLatLngObj } = require("tle.js/dist/tlejs.cjs");
const app = (0, express_1.default)();
const server = http.createServer(app);
app.use(express_1.default.json());
const wss = new WebSocket.Server({ server });
const PORT = process.env.PORT || 3001;
const getISS = (_, res) => {
    const optionalTimestampMS = +new Date; //1502342329860;
    const latLonObj = getLatLngObj(tle, optionalTimestampMS);
    const finalObject = Object.assign(Object.assign({}, latLonObj), { timestamp: optionalTimestampMS });
    //getTXT();
    res.send(finalObject);
};
var tles = [];
const tle = `ISS (ZARYA) 
1 44713C 19074A   22137.44061460  .00004673  00000-0  31310-3 0  1375 
2 44713  53.0533 316.6557 0001484  70.9551 312.7346 15.06394731    13`;
function getTXT() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("getTXT");
        const response = yield fetch('https://celestrak.com/NORAD/elements/supplemental/starlink.txt');
        const data = yield response.text();
        var array = data.toString().split('\n');
        let tleLocalList = [];
        for (var i = 0; i < array.length; i = i + 3) {
            if (array[i].length > 0) {
                var tle_local = {
                    name: array[i].replace('\r', '').trimEnd(),
                    line1: array[i + 1].replace('\r', '').trimEnd(),
                    line2: array[i + 2].replace('\r', '').trimEnd()
                };
                tleLocalList.push(tle_local);
            }
        }
        tles = tleLocalList;
        return tleLocalList;
    });
}
const getTLEs = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    var data = yield getTXT();
    console.log(tles.length);
    res.send(data);
});
//#region Endpoints
app.get('/', (_, res) => {
    return res.send("OK");
});
app.get('/getISS', getISS);
app.get('/getTLEs', getTLEs);
//#endregion
//#region Websocket
wss.on('connection', (ws) => {
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
app.listen(PORT, () => { console.log('Server running on 3001'); });
server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${8999} :)`);
});
//# sourceMappingURL=index.js.map