window.onload = async function () {
  view.effectBackground();
  firebase.auth().onAuthStateChanged(function (user) {
    // console.log(user);
    if (user) {
      view.showScreen("menuGame");
      controller.updateOnline();
      controller.updateOffline();
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