// điều hương view mà model
let controller = {};
controller.signUp = async function (name, email, password) {
    view.setText('signUp_message', '')
    try {
        await firebase.auth().createUserWithEmailAndPassword(email, password)
        await firebase.auth().currentUser.sendEmailVerification()
    } catch (error) {
        if (!document.getElementById('signUp_message').classList.contains('text-error')) {
            document.getElementById('signUp_message').classList.add('text-error')
        }
        await view.setText('signUp_message', error.message)
    }
}
controller.signIn = async function (email, password) {
    try {
        await firebase.auth().signInWithEmailAndPassword(email, password)
    } catch (error) {
        if (!document.getElementById('signUp_message').classList.contains('text-error')) {
            document.getElementById('signUp_message').classList.add('text-error')
        }
        await view.setText('signUp_message', error.message)
    }
}
controller.updateUser = async function (name){
    await firebase.auth().currentUser.updateProfile({
        displayName: name,
        photoURL: "https://example.com/jane-q-user/profile.jpg"
    })
}
controller.signOut = async function (){
    await firebase.auth().signOut()
    await view.showScreen('signUp')
}
controller.createRoom = async function(title, email){
    // let member = [email, firebase.auth().currentUser.email]
    await firebase.firestore().collection('rooms').add({
        title : title,
        member: [email, firebase.auth().currentUser.email],
        timestamp : firebase.firestore.FieldValue.serverTimestamp()
    })
    console.log('done')
}
controller.loadConverstations = async function(){
    let result = await firebase.firestore().collection('rooms').orderBy("timestamp", "desc").get()
    let converstations = []
    for (let doc of result.docs){
        converstations.push(refineData(doc))
    }
    await model.saveConverstations(converstations)
}
