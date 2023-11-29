

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithRedirect,
    signInWithPopup,
    getRedirectResult
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    doc,
    deleteDoc,
    updateDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
const firebaseConfig = {
    apiKey: "AIzaSyD0EPKQGGRB2CQYR53B_YGYql0YIRtftS0",
    authDomain: "todoapp-2130e.firebaseapp.com",
    projectId: "todoapp-2130e",
    storageBucket: "todoapp-2130e.appspot.com",
    messagingSenderId: "324539848438",
    appId: "1:324539848438:web:91ae4d2ec3d6d6233f3ed7",
    measurementId: "G-D5J3KFYFC3"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider()


// ... (your imports and firebase initialization)

function addGoogle(){
    signInWithPopup(auth, provider)
    .then((result) => {
        const user = result.user
        console.log(user);
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: `Your Acount ${email} has been   registered `,
            showConfirmButton: false,
            timer: 1500
        });
        location.href = './signin.html';

    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message
    })
}
window.addGoogle = addGoogle






// Signed up
let btn = document.querySelector('#sbtn');
if (btn) {
    btn.addEventListener('click', async () => {
        let email = document.querySelector('#semail').value;
        let password = document.querySelector('#spass').value;
        if (email == "" && password == "") {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Pleace Enter Email and password",
                footer: '<a href="#">Why do I have this issue?</a>'
            });

        } else {

            try {
                btn.innerHTML = `<button class="btn btn-primary" type="button" disabled>
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Loading...
                </button>`
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                console.log(user);

                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: `Your Acount ${email} has been   registered `,
                    showConfirmButton: false,
                    timer: 1500
                });
                const docRef = await addDoc(collection(db, "users"), {
                    email: email,
                    // Avoid storing passwords in plain text, consider alternative approaches
                    // password: password
                });
                console.log("Document written with ID: ", docRef.id);
                location.href = './signin.html';
            } catch (error) {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error(errorCode, errorMessage);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Invalid Email and password",
                    footer: '<a href="#">Why do I have this issue?</a>'
                });
            }
        }
    });
}

// Login
let btn1 = document.querySelector('#lbtn');
if (btn1) {
    btn1.addEventListener('click', () => {
        let email = document.querySelector('#lemail').value;
        let password = document.querySelector('#lpass').value;
        if (email == "" && password == "") {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Pleace Enter Email and password",
                footer: '<a href="#">Why do I have this issue?</a>'
            });

        } else {

            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    btn1.innerHTML = `<button class="btn btn-primary" type="button" disabled>
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Loading...
                    </button>`
                    setTimeout(() => {
                        Swal.fire({
                            title: "Good job!",
                            text: "You Account has been log in ",
                            icon: "success"
                        });


                    }, 4500)
                    setTimeout(() => {
                        location.href = './todo.html';
                    }, 5000)
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error(errorCode, errorMessage);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "This Email and password are not registered",
                        footer: '<a href="./index.html">Please sign up</a>'
                    });

                });
        }
    });
}





// sign out

// onAuthStateChanged(auth, (user) => {
//     if (user) {
//         const uid = user.uid;
//         console.log(uid);
//     } else {
//         window.location = 'index.html'
//     }
// });

// const btnl = document.querySelector('#bt');


// btnl.addEventListener('click', () => {
//     signOut(auth).then(() => {
//         console.log('logout succesfully');
//         window.location = 'index.html'
//     }).catch((error) => {
//         console.log(error);
//     });
// })





let addTodo = document.querySelector('#addTodo');
let list = document.querySelector('#list');

if (list) {
    addTodo.addEventListener('click', async (event) => {
        event.preventDefault(); // Prevent form submission

        let todo = document.querySelector('#todo');


        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });

        Toast.fire({
            icon: "success",
            title: "Creation  successfully"
        });

        const docRef = await addDoc(collection(db, "todos"), {
            todo: todo.value,
            time: new Date().toLocaleString()
        });
        console.log("Document written with ID: ", docRef.id);

        todo.value = ""
    });

    function getData() {
        onSnapshot(collection(db, "todos"), (data) => {
            data.docChanges().forEach((newData) => {
                if (newData.type === 'removed') {
                    let delLi = document.getElementById(newData.doc.id);
                    delLi.remove();
                } else if (newData.type === 'added') {
                    list.innerHTML += `
                        <li class="li m-5" id="${newData.doc.id}">
                            <span id="Todo">${newData.doc.data().todo}</span><br><hr>
                            <span class="m-1" id="Time">${newData.doc.data().time}</span>
                            <span class="d-flex justify-content-end">
                            <button class="btn btn-danger  m-1" onclick="delTodo('${newData.doc.id}')"><i class="fa fa-trash" aria-hidden="true"></i></button>
                            <button class="btn btn-success m-1" onclick="editTodo(this,'${newData.doc.id}')"><i class="fas fa-edit fa-lg"></i></button></span>
                        </li>`;

                }
            });
        });
    }

    getData();
    window.getData = getData;


    async function delTodo(id) {

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
        });
        swalWithBootstrapButtons.fire({
            title: "Are you sure?",
            text: "Do you want deleted Todos",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                swalWithBootstrapButtons.fire({
                    title: "Deleted!",
                    text: "Your Todos has been deleted.",
                    icon: "success"
                });
                await deleteDoc(doc(db, "todos", id));
                // delAllTodo()
            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire({
                    title: "Cancelled",
                    text: "Your Todos is safe :)",
                    icon: "error"

                });

            }
        });
    }

    async function editTodo(e, id) {
        let editLi = prompt('Enter Edit value');
        let currentTime = new Date().toLocaleString();

        e.parentNode.parentNode.querySelector('#Todo').textContent = editLi;
        e.parentNode.querySelector('#Time').textContent = currentTime;

        await updateDoc(doc(db, "todos", id), {
            todo: editLi,
            time: currentTime
        });
    }
    
    const delAllTodob = document.querySelector('#delAllTodo')
    delAllTodob.addEventListener('click', () => {

        
        
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
        });
        swalWithBootstrapButtons.fire({
            title: "Are you sure?",
            text: "Do you want deleted Todos",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                swalWithBootstrapButtons.fire({
                    title: "Deleted!",
                    text: "Your Todos has been deleted.",
                    icon: "success"
                });
                delAllTodo()
            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
                ) {
                    swalWithBootstrapButtons.fire({
                        title: "Cancelled",
                        text: "Your Todos is safe :)",
                        icon: "error"
                        
                    });
                    
                }
            });
            
        })
        async function delAllTodo() {
            const todosCollection = collection(db, 'todos');
            const todosSnapshot = await getDocs(todosCollection);
            
            todosSnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });

            list.innerHTML = "";
        }
        
        window.delAllTodo = delAllTodo;
        window.editTodo = editTodo;
        window.delTodo = delTodo;
    }
        
        
        
        // onAuthStateChanged(auth, (user) => {
//     if (!user) {
    //         // Redirect to the login page if the user is not signed in
    //         window.location = 'index.html';
    //     }
    // });
    
    
    
    
    
    
    
    
    
    
    
    
    