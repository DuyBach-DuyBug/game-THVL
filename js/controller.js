// điều hương view mà model
let controller = {};
controller.signUp = async function (name, email, password) {
  view.setText("signUp_message", "");
  try {
    await auth.createUserWithEmailAndPassword(email, password);
    await db.collection("user").doc(auth.currentUser.uid).set({
      id: auth.currentUser.uid,
      email: auth.currentUser.email,
      userName: name,
      online: true,
      friends: [],
      friendRequest: [],
      requestBy: [],
      avatarUrl: null,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    await db
      .collection("scoreboard")
      .doc(auth.currentUser.uid)
      .set({
        name: name,
        id: auth.currentUser.uid,
        xo: {
          battle: 0,
          win: 0,
          elo: 1200,
          winrate: 0,
          winStreak: 0,
          loseStreak: 0,
        },
        ship: {
          battle: 0,
          win: 0,
          elo: 1200,
          winrate: 0,
          winStreak: 0,
          loseStreak: 0,
        },
      });
  } catch (error) {
    console.log(error);
    // if (
    //   !document
    //     .getElementById("signUp_message")
    //     .classList.contains("text-error")
    // ) {
    //   document.getElementById("signUp_message").classList.add("text-error");
    // }
    // await view.setText("signUp_message", error.message);
  }
};
controller.signIn = async function (email, password) {
  try {
    await auth.signInWithEmailAndPassword(email, password);
    await db.collection("user").doc(auth.currentUser.uid).update({
      online: true,
    });
  } catch (error) {
    console.log(error);
    // if (
    //   !document
    //     .getElementById("signUp_message")
    //     .classList.contains("text-error")
    // ) {
    //   document.getElementById("signUp_message").classList.add("text-error");
    // }
    // await view.setText("signUp_message", error.message);
  }
};

controller.updateUser = async function (avatar, name) {
  if (name != "" && name.length > 3) {
    await db.collection("user").doc(auth.currentUser.uid).update({
      userName: name,
    });
    await db.collection("scoreboard").doc(auth.currentUser.uid).update({
      name: name,
    });
    await console.log("update name done");
  }
  if (avatar) {
    await storage.ref(`image_users/${auth.currentUser.uid}/avatar`).put(avatar);
    await db
      .collection("user")
      .doc(auth.currentUser.uid)
      .update({
        avatarUrl: await storage
          .ref(`image_users/${auth.currentUser.uid}/avatar`)
          .getDownloadURL()
          .then(function (url) {
            return url;
          }),
      });
    await console.log("update avatar done");
  }
};
controller.signOut = async function () {
  await db.collection("user").doc(auth.currentUser.uid).update({
    online: false,
  });
  await auth.signOut();
  await view.showScreen("log");

  document.body.classList.remove("show-user-detail");
};

controller.scoreboard = function (position) {
  let domID = document.getElementById("scoreboard_" + position);
  db.collection("scoreboard")
    .orderBy(position + ".elo", "desc")
    .orderBy(position + ".winrate", "desc")
    .orderBy(position + ".battle", "desc")
    .orderBy("name", "desc")
    .limit(50)
    .onSnapshot(function (snapshot) {
      let score = [];
      for (let [index, doc] of snapshot.docs.entries()) {
        let scoreData = doc.data();
        if (doc.id == auth.currentUser.uid) {
          refineMyScore(index, scoreData, position);
        }
        score.push(scoreData);
      }
      refineScore(score, domID, position);
    });
};

controller.online = function () {
  db.collection("user")
    .where("online", "==", true)
    .onSnapshot(function (querySnapshot) {
      let online = [];
      for (let doc of querySnapshot.docs) {
        online.push(doc.data());
      }
      refineOnline(online);
    });
};

controller.modal = async function (typeFunction) {
  switch (typeFunction) {
    case "btnFriends":
      document.getElementById("modal").innerHTML = modal[typeFunction];
      friendRequest(model.friendRe);
      // document.getElementById("my-friend").innerHTML = model.friendList;

      let listRe = model.currentUser.friendRequest;

      for (let i in listRe) {
        console.log(listRe[i])
        await db.collection("user")
          .where("friendRequest", "array-contains", listRe[i])
          .onSnapshot(function (querySnapshot) {
            // let aa = querySnapshot.docs
            // console.log(aa)
// debugger
            await friendRequest(querySnapshot.docs)
          });
      }

      let sent = document.getElementById("send-request");
      let domError = document.getElementById("error-friendRe");
      sent.onsubmit = async function (e) {
        e.preventDefault();
        let email = sent.email.value;
        let friend = await db
          .collection("user")
          .where("email", "==", email)
          .get();
        if (friend.empty == true) {
          domError.innerHTML = "Not found email";
        } else {
          console.log(db.collection("user").doc(friend.docs[0].id));
          // await db
          //   .collection("user")
          //   .doc(friend.docs[0].id)
          //   .update({
          //     friendRequest: firebase.firestore.FieldValue.arrayUnion(model.currentUser.email),
          //     requestBy: firebase.firestore.FieldValue.arrayUnion(model.currentUser.email)
          //   });
          // domError.innerHTML = "Has been sent";
          // sent.reset();
        }
        domError.style.opacity = "1";
      };

      break;
  }

  await document.body.classList.add("show-modal");
};
controller.createRoom = async function (title, email) {
  // let member = [email, firebase.auth().currentUser.email]
  await firebase
    .firestore()
    .collection("rooms")
    .add({
      title: title,
      member: [email, auth.currentUser.email],
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
  console.log("done");
};
controller.loadConverstations = async function () {
  let result = await firebase
    .firestore()
    .collection("rooms")
    .orderBy("timestamp", "desc")
    .get();
  let converstations = [];
  for (let doc of result.docs) {
    converstations.push(refineData(doc));
  }
  await model.saveConverstations(converstations);
};
