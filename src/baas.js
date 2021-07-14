import placeholder from "../public/images/profile_placeholder.png";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import placeholderPhoto from "./images/profile_placeholder.png";
import { AddBookToFirebase, deleteCard, createAndInsertCard , updateCard} from "./lib";

const firebaseConfig = {
  apiKey: "AIzaSyCJR1pPheK83T62fkiVmivpTzDTF263Wes",
  authDomain: "shelfie-843f5.firebaseapp.com",
  projectId: "shelfie-843f5",
  storageBucket: "shelfie-843f5.appspot.com",
  messagingSenderId: "628209360656",
  appId: "1:628209360656:web:2fe031006631adebf00f95",
  measurementId: "G-DGLY7HRG3W",
};
firebase.initializeApp(firebaseConfig);

// Signs-in Friendly Chat.
function signIn() {
  // Sign into Firebase using popup auth & Google as the identity provider.
  const provider = new firebase.auth.GoogleAuthProvider();
  console.log("signIn");
  firebase.auth().signInWithPopup(provider);
}

// Signs-out of Friendly Chat.
function signOut() {
  // Sign out of Firebase.
  firebase.auth().signOut();
}

// Initiate Firebase Auth.
function initFirebaseAuth() {
  // Listen to auth state changes.
  firebase.auth().onAuthStateChanged(authStateObserver);
}

// Returns the signed-in user's profile pic URL.
function getProfilePicUrl() {
  return firebase.auth().currentUser.photoURL || placeholderPhoto;
}

// Returns the signed-in user's display name.
function getUserName() {
  return firebase.auth().currentUser.displayName;
}

// Returns true if a user is signed-in.
function isUserSignedIn() {
  return !!firebase.auth().currentUser;
}

// Saves a new message to your Cloud Firestore database.
function saveBook(title,author,read) {
  const id = title.split(' ').join('_') // Spaces for underscores
  // Add a new message entry to the database.
  firebase.firestore().collection("books").doc(id).set({
    name: getUserName(),
    id:id,
    title: title,
    author: author,
    read: read,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  });
}

// Loads books and listens for upcoming ones.
function loadBooks() {
  // Create the query to load the last 12 messages and listen for new ones.
  const query = firebase
    .firestore()
    .collection("books")
    .orderBy("timestamp", "desc");

  // Start listening to the query.
  query.onSnapshot(function (snapshot) {
    snapshot.docChanges().forEach(function (change) {
      console.log(change.type)
        if (change.type === "removed") {
          //delete from UI
          deleteCard(change.doc.data().id)
        } else if (change.type === "added") {
          //add to UI
          const book = change.doc.data();
          createAndInsertCard(book);
        } 
    })
  });
}

// Triggers when the auth state change for instance when the user signs-in or signs-out.
function authStateObserver(user) {
  // Bookshelf
  const cardWrapper = document.getElementById("cardWrapper");
  if (user) {
    // User is signed in!
    // Get the signed-in user's profile pic and name.
    const profilePicUrl = getProfilePicUrl();
    const userName = getUserName();

    // Set the user's profile pic and name.
    userPicElement.style.backgroundImage =
      "url(" + addSizeToGoogleProfilePic(profilePicUrl) + ")";
    userNameElement.innerText = userName;

    // Show user's profile and sign-out button.
    userNameElement.removeAttribute("hidden");
    userPicElement.removeAttribute("hidden");
    signOutButtonElement.style.display = "flex";
    // Hide sign-in button.
    signInButtonElement.style.display = "none";
    // Hide bookshelf
    Array.from(document.querySelectorAll('.bookCard')).length ? cardWrapper.style.display='flex': cardWrapper.style.display='none';
  } else {
    // User is signed out!
    // Hide user's profile and sign-out button.
    userNameElement.innerText = "";
    signOutButtonElement.style.display = "none";
    userPicElement.style.backgroundImage = "url(" + placeholderPhoto + ")";
    // Show sign-in button.
    signInButtonElement.style.display = "flex";
    // Hide bookshelf
    cardWrapper.style.display = "none";
  }
}

// Delete a Book from the firestore.
function deleteBook(title) {
  const id = title.split(' ').join('_')
  const message = firebase
    .firestore()
    .collection("books")
    .doc(id)
    .delete()
    .then(() => {
      console.log("Document successfully deleted!");
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
    });
}
function addSizeToGoogleProfilePic(url) {
  if (url.indexOf("googleusercontent.com") !== -1 && url.indexOf("?") === -1) {
    return url + "?sz=150";
  }
  return url;
}

function updateBook (id, title, author,read) {
  firebase.firestore().collection('books').doc(id).update({
    title:title,
    author:author,
    read:read
  })
}
// OAuth
const userPicElement = document.getElementById("profileImg");
const userNameElement = document.getElementById("user-name");

// Firestore
//Sign In Button
const signInButtonElement = document.getElementById("loginBtn");
signInButtonElement.addEventListener("click", signIn);
//Sign Out Button
const signOutButtonElement = document.getElementById("sign-out");
signOutButtonElement.addEventListener("click", signOut);
//Submit New Book Button
const submitButtonElement = document.getElementById("submit");
submitButtonElement.addEventListener("click", (e) =>
  AddBookToFirebase(e.target.form)
);
// We load currently existing books and listen to new ones.
loadBooks();
// initialize Firebase
initFirebaseAuth();

export { saveBook, updateBook, deleteBook };
