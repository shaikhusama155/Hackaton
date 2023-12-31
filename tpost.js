import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore, collection, getDocs, query, where, addDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getDownloadURL, getStorage, ref } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";

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
const db = getFirestore(app);
const auth = getAuth();
const storage = getStorage();
var CurrentUserName;
var CurrentUserEmail;
var CurrentUserNick;

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
            if (doc.id == uid) {
                document.getElementById('h2').innerHTML = `${doc.data().nameF} ${doc.data().nameL}`
                document.getElementById('nick').innerHTML = "@" + doc.data().nick
                document.getElementById('loc').innerHTML = `<i class="fa fa-location-dot"></i>
                ${doc.data().country}`
                document.getElementById('ab').innerHTML = doc.data().about
                CurrentUserName = `${doc.data().nameF} ${doc.data().nameL}`
                CurrentUserEmail = `${doc.data().email}`
                CurrentUserNick = doc.data().nick
            }
        });
        getDownloadURL(ref(storage, user.email))
            .then((url) => {
                document.getElementById('img1').src = url
                document.getElementById('img2').src = url
            })
    }
});

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        location.replace('./index.html')
    }
    const shouldF = document.getElementById('shouldFollow')
    const q = query(collection(db, "users"), where("email", "!=", user.email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        getDownloadURL(ref(storage, doc.data().email))
            .then((url) => {
                var imgUrl = url
                shouldF.innerHTML += `
            <div class="follow_bx">
            <div class="follow_profile_name">
            <img src="${imgUrl}" class="follow_profile">
                                    <div class="user_name">
                                    <div class="user_name_follow">
                                            <h6>${doc.data().nameF} ${doc.data().nameL}</h6>
                                            </div>
                                        <p>${doc.data().nick}</p>
                                        </div>
                                        </div>
                                        <button onclick="alert('Your are now following ${doc.data().nameF}')">Follow</button>
                                        </div>
                                        `
            })
    });
});
var khm;

function GetImg() {
    Swal.fire({
        title: 'Add Image URL To Attach To Post',
        input: 'text',
        showCancelButton: true,
        confirmButtonText: 'Attach Image',
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading()
    }).then(async (result) => {
        if (result.isConfirmed) {
            khm = result.value;
        }
    });
}

window.GetImg = GetImg;

const post = document.getElementById('post');
post.addEventListener('click', async () => {
    const pT = document.getElementById('pt').value;
    var n = new Date();
    var h = n.getHours();
    var m = n.getMinutes();

    try {
        // Prepare the data object for the Firestore document
        const data = {
            text: pT,
            time: `${h}:${m}`,
            sender: CurrentUserName,
            senderEmail: CurrentUserEmail,
            senderNick: CurrentUserNick,
        };

        // Add the "att" field if khm is defined
        if (khm) {
            data.att = khm;
        }

        const docRef = await addDoc(collection(db, "posts"), data);

        Swal.fire({
            title: 'POst Added Successfully',
            text: 'Your POst wil be displayed on home Page',
            icon: "success"
        }).then(() => {
            Swal.fire({
                timer: 1000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                }
            }).then(() => {
                location.replace('./main.html');
            });
        });
    } catch (e) {
        console.error("Error adding document: ", e);
    }
});


function abc() {
    if (document.getElementById('nameUserSearch').value != "") {
        localStorage.setItem("searchingUser", (document.getElementById('nameUserSearch').value).toLowerCase())
        location.replace("./profileSearch.html")
    }
    else {
        Swal.fire(
            'Error Redirecting',
            'enter the user name to search the user.',
            'error'
        )
    }
}
window.abc = abc
