window.onload = function () {
    view.effectBackground()
    view.locationTime()
    firebase.auth().onAuthStateChanged(function (user) {
        if (user && user.emailVerified == true) {
            view.showScreen('menuGame');
        } 
        else if (user && user.emailVerified == false) {
            alert('confirm your email')
            firebase.auth().signOut()
            view.showScreen('signUp');
        } 
        else {
            view.showScreen('signUp');
        }
    });
}

