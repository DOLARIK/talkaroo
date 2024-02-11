import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, arrayUnion, setDoc } from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: "AIzaSyBBhBoI75vhSsH8wWebNf-90_MG1EaN748",
  authDomain: "hacklyi.firebaseapp.com",
  projectId: "hacklyi",
  storageBucket: "hacklyi.appspot.com",
  messagingSenderId: "724294779611",
  appId: "1:724294779611:web:64faa91a21683c2df242fe"
};


const app = initializeApp(firebaseConfig);


export const db = getFirestore();

export function addDocumentToUsers(name : string, email: string, picture: string) {
    if (name === null || email === null || picture === null) {
        return Promise.reject(new Error("Invalid input"));
    }

    let users;

    return getDocs(collection(db, "users"))
        .then((querySnapshot) => {
            users = querySnapshot.docs.map((doc) => doc.data());
            for (const user of users) {
                if (user.email === email) {
                    console.log("User already exists");
                    return;
                }
            }
            return addDoc(collection(db, "users"), {
                name: name,
                email: email,
                picture: picture,
                timestamp: Date.now(),
                messages: []
            });
        })
        .then((docRef) => {
            if (docRef) {
                console.log("Document written with ID: ", docRef.id);
            }
        })
        .catch((e) => {
            console.error("Error adding document: ", e);
        });
}


export function addMessageToArray(email:string, message:string) {
    if (message === null || email === null) {
        return Promise.reject(new Error("Invalid input"));
    }
    console.log("Adding message to user with email: ", email);
    console.log("Message: ", message);
    // find the user with the given email
    let userRef;
    return getDocs(collection(db, "users"))
        .then((querySnapshot) => {
            querySnapshot.forEach((
                (doc) => {
                    userRef = doc.ref;
                    const userData = doc.data();
                    const updatedMessages = userData.messages ? [...userData.messages, message] : [message];
                    setDoc(userRef, {
                        messages: updatedMessages
                    }, { merge: true });
                    console.log("Updated messages: ", updatedMessages);
                    return;
                    
                }
            ))
            
        })
        .catch((e) => {
            console.error("Error adding message: ", e);
        });
    
}

export function clearMessages(email:string) {
    if (email === null) {
        return Promise.reject(new Error("Invalid input"));
    }
    console.log("Clearing messages for user with email: ", email);
    // find the user with the given email
    let userRef;
    return getDocs(collection(db, "users"))
        .then((querySnapshot) => {
            querySnapshot.forEach((
                (doc) => {
                    userRef = doc.ref;
                    const userData = doc.data();
                    setDoc(userRef, {
                        messages: []
                    }, { merge: true });
                    console.log("Cleared messages");
                    return;
                    
                }
            ))
            
        })
        .catch((e) => {
            console.error("Error clearing messages: ", e);
        });
    
}