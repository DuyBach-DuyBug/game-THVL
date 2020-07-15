window.onload = function () {
  view.effectBackground();
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      view.showScreen("menuGame");
      console.log(firebase.auth().currentUser);
    }
    // else if (user && user.emailVerified == false) {
    //     alert('confirm your email')
    //     firebase.auth().signOut()
    //     view.showScreen('log');
    // }
    else {
      view.showScreen("log");
    }
  });
};

