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
    http.get('http://host.docker.internal:5000');
    sleep(1);
}

function expressTest (){
    http.get('http://host.docker.internal:3000');
    sleep(1);
}

function koaTest (){
    http.get('http://host.docker.internal:3001');
    sleep(1);
}