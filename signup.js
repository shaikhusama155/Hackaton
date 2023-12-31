import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCftRMGFwDzVL2U4AKE1Zqplt0mXCHwdjI",
  authDomain: "facebook-88900.firebaseapp.com",
  databaseURL: "https://facebook-88900-default-rtdb.firebaseio.com",
  projectId: "facebook-88900",
  storageBucket: "facebook-88900.appspot.com",
  messagingSenderId: "673825336394",
  appId: "1:673825336394:web:409bbace093c4b9edbcab3",
  measurementId: "G-7VVKFZTJ0L"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth();
const storage = getStorage();




const upload = document.getElementById('photo')

const btn = document.getElementById('signBtn')
btn.addEventListener('click', () => {
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value
  const nameF = document.getElementById('namef').value
  const nameL = document.getElementById('namel').value
  const country = document.getElementById('country').value
  const phone = document.getElementById('phone').value
  const nick = document.getElementById('nick').value
  const about = document.getElementById('about').value
  var abc = document.getElementById('img').value

  if (!nameF || !email || !password) {
    Swal.fire({
      text: `Please fill all the fields`,
      icon: 'error',
      confirmButtonText: 'OK'
    });
    return;
  }
  else if(!abc){
    Swal.fire({
      text: `Please Select Profile Photo`,
      icon: 'error',
      confirmButtonText: 'OK'
    });
    return;
  }
  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      try {
        const docRef = await setDoc(doc(db, "users", user.uid), {
          nameF,
          nameL,
          name: `${(nameF).toLowerCase()} ${(nameL).toLowerCase()}`,
          email,
          uid: user.uid
        });
        const storageRef = ref(storage, email);

        var file = document.getElementById('img')
        uploadBytes(storageRef, file.files[0]).then((snapshot) => {
          console.log('Uploaded a blob or file!');
        });
      } catch (e) {
        console.error("Error adding document: ", e);
      }
      var file = document.getElementById('img')
      const mountainsRef = ref(storage, `images/${file.files[0].name}`);
      uploadBytes(mountainsRef, file.files[0]).then((snapshot) => {
        console.log('Uploaded a blob or file!');
      });

      Swal.fire({
        text: `User Signed Up !`,
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        window.location.href = 'login.html'
      }
      )
      console.log(user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      if (errorMessage === "Firebase: Error (auth/invalid-email).") {
        Swal.fire({
          text: `Invalid Email Address`,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
      else if (errorMessage === "Firebase: Password should be at least 6 characters (auth/weak-password).") {
        Swal.fire({
          text: `Password Should Be Atleast 6 Characters Long`,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
      else if (errorMessage === "Firebase: Error (auth/email-already-in-use).") {
        Swal.fire({
          text: `This email Is Already Taken`,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
      else {
        console.log(errorMessage);
      }
    });
})
