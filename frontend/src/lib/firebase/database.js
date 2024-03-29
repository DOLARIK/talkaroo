import {addDoc, collection, getDoc, getDocs, updateDoc} from "firebase/firestore";
import {db} from "@/lib/firebase/firebase";

// Get a list of all the users
export const getUsers = async () => {
    const users = [];
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
        users.push(doc.data());
    });
    return users;
}

// add a new user to the database
export const addUser = async (user) => {
    console.log("got here", user);
    if (user === undefined || user === null) {
        return "User cannot be null";
    }

    const collectionRef = collection(db, "users");
    // if user is not in collection, add user
    const querySnapshot = await getDocs(collectionRef);
    let userExists = false;
    querySnapshot.forEach((doc) => {
        if (doc.data().email === user.email) {
            userExists = true;
        }
    });
    if (userExists) {
        return "User already exists";
    }
    addDoc(collectionRef, {
        "email" : user.email,
        "displayName" : user.displayName,
        "photoURL" : user.photoURL,
        "uid" : user.uid,
        "timeCreated" : new Date().toISOString(),
        "messages" : [],
        "todos" : [],
        "suggestions" : [],
        "wellbeing" : [],
        "journals" : [],
        "reports" : [],

    });
    return "User added successfully";

}

// add a new message to the database
export const addMessageToUserArray = async (userId, message, isUser) => {
    if (userId === undefined || userId === null) {
        return "User cannot be null";
    }
    if (message === undefined || message === null) {
        return "Message cannot be null";
    }
    const collectionRef = await collection(db, "users");
    // iterate through the collection to find the user
    const querySnapshot = await getDocs(collectionRef);
    let userExists = false;
    let userRef;
    querySnapshot.forEach((doc) => {
        if (doc.data().uid === userId) {
            userExists = true;
            userRef = doc.ref;
        }
    });
    if (!userExists) {
        return "User does not exist";
    }
    const userDoc = (await getDoc(userRef));
    updateDoc(userRef, {
        messages: [...userDoc.data().messages, {message: message, isUser: isUser, time: new Date().toISOString()}]
    });

    return "Message added successfully";
}

// get all todos for a user
export const getTodos = async (userId) => {
    if (userId === undefined || userId === null) {
        return "User cannot be null";
    }
    const collectionRef = collection(db, "users");
    // iterate through the collection to find the user
    const querySnapshot = await getDocs(collectionRef);
    let userExists = false;
    let userRef;
    querySnapshot.forEach((doc) => {
        if (doc.data().uid === userId) {
            userExists = true;
            userRef = doc.ref;
        }
    });
    if (!userExists) {
        return "User does not exist";
    }
    const userDoc = (await getDoc(userRef));
    return userDoc.data().todos;
}