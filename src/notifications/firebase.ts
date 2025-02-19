// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getMessaging,getToken} from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyDOXXIEIC6J7W0PBR2vnax94TcJBoeJVuU",
  authDomain: "turfease-53a17.firebaseapp.com",
  projectId: "turfease-53a17",
  storageBucket: "turfease-53a17.appspot.com",
  messagingSenderId: "639793047074",
  appId: "1:639793047074:web:23423800689f6bdb708c7b"
};

export const GenerateToken = async ()=>{
  const permission = await Notification.requestPermission();
  if(permission==="granted"){
    const token =  await getToken(messaging,{vapidKey:'BFCW_ZAGy96p3-SRCvJIpuM6CUqhMv3_nr1Ldt2qSWOyP2PsasjDL3EqTbFKPZHwrrkdEDoI35GQhDi0itOAZ0M'});
    console.log('FCMTOKEN : ',token)
  }
  console.log(permission,'permission')
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const messaging = getMessaging(app);
