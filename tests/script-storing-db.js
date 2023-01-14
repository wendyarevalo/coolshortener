import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
    vus: 100,
    duration: '30s',
    summaryTrendStats: ["avg","med", "p(95)", "p(99)"],
};

export default function (){
    switch(__ENV.HOST){
        case 'FLASK':
            flaskTest();
            sleep(1);
            break;
        case 'KOA':
            koaTest();
            sleep(1);
            break;
        default:
            expressTest();
            sleep(1);
            break;
    }
}

function flaskTest (){
    const url = 'http://host.docker.internal:5000/show_shortened'
    let data = {
        long_url: 'https://open.spotify.com/track/2grjqo0Frpf2okIBiifQKs?si=c6a88455399649d8',
    };
    http.post(url,data);
    sleep(1);
}

function expressTest (){
    const url = 'http://host.docker.internal:3000/show_shortened'
    let data = {
        long_url: 'https://open.spotify.com/track/31AOj9sFz2gM0O3hMARRBx?si=c018c8bb6dfd452f',
    };
    http.post(url,data);
    sleep(1);
}

function koaTest (){
    const url = 'http://host.docker.internal:3001/show_shortened'
    let data = {
        long_url: 'https://open.spotify.com/track/1Bv3h7Vc4AaYA2BcSM3rVd?si=544a116de34e4f03',
    };
    http.post(url,data);
    sleep(1);
}