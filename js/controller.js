// điều hương view mà model
let controller = {};
controller.signUp = async function (name, email, password) {
  // view.setText("signUp_message", "");
  try {
    await auth.createUserWithEmailAndPassword(email, password);
    await db.collection("user").doc(auth.currentUser.uid).set({
      id: auth.currentUser.uid,
      email: auth.currentUser.email,
      userName: name,
      online: true,
      friends: [],
      friendRequest: [],
      friendSent: [],
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
  let domModal = document.getElementById("modal")
  switch (typeFunction) {
    case "btnFriends":
      domModal.innerHTML = modal[typeFunction];
      // friendRequest(model.friendRe);
      // document.getElementById("my-friend").innerHTML = model.friendList;
      await db.collection("user")
        .where("friendSent", "array-contains", model.currentUser.email)
        .onSnapshot(function (querySnapshot) {
          console.log(querySnapshot)
          friendRequest(querySnapshot.docs, "friend-request")
        });

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
          console.log(email)
          await db
            .collection("user")
            .doc(friend.docs[0].id)
            .update({
              friendRequest: firebase.firestore.FieldValue.arrayUnion(model.currentUser.email)
            });
          await db
            .collection("user")
            .doc(model.currentUser.id)
            .update({
              friendSent: firebase.firestore.FieldValue.arrayUnion(email)
            });
          domError.innerHTML = "Has been sent";
          sent.reset();
        }
        domError.style.opacity = "1";
      };
      break;

    case "btnInvite":
      domModal.innerHTML = modal[typeFunction];
      await db.collection("game").where("player2", "==", model.currentUser.email).onSnapshot(async function (snapshot) {
        for (let i of snapshot.docs) {
          let data = await db.collection("user").where("email", "==", i.data().player1).get()
          await friendRequest(data.docs, "friend-invite")
        }
        await acceptBtn("friend-invite")
      })
      break;

    case "findType":
      domModal.innerHTML = await modal[typeFunction]
      let findRank = document.getElementById('findRank')
      findRank.onclick = function () {
        controller.modal("findRank")
        // view.showScreen("gameXo")

        // db.collection("game").doc()
        //   .onSnapshot(function (doc) {
        //     console.log("Current data: ", doc.data());
        //   });
      }
      let findCustom = await document.getElementById('findCustom')
      findCustom.onclick = function () {
        controller.modal("findCustom")
      }
      break;

    case "findRank":
      domModal.innerHTML = modal[typeFunction]
      controller.rankGame()
      document.getElementById('back').onclick = function () {
        controller.modal("findType")
      }
      break;

    case "findCustom":
      domModal.innerHTML = modal[typeFunction]
      let form = document.getElementById('findFriend')
      form.onsubmit = function (e) {
        e.preventDefault()
        controller.customGame(form.email.value)
      }
      document.getElementById('back').onclick = function () {
        controller.modal("findType")
      }
      break;
  }

  await document.body.classList.add("show-modal");
  domModal.innerHTML += await `<a id="exitModal" class="close-btn"></a>`
  document.getElementById("exitModal").onclick = await function () {
    domModal.innerHTML = ""
    document.body.classList.remove("show-modal");
  }
};

controller.rankGame = async function () {
  db.collection("game").where("inRoom", "==", 1).where("player1", ">", model.currentUser.email).where("player1", "<", model.currentUser.email).onSnapshot(async function (querySnapshot) {
    console.log(querySnapshot.empty)
    let getElo = await db.collection("scoreboard").doc(model.currentUser.id).get()
    let myElo = await getElo.data().xo.elo

    if (querySnapshot.empty) {
      let game = await db.collection("game").doc()
      await game.set({
        id: game.id,
        inRoom: 1,
        player: [model.currentUser.email],
        eloFind: myElo,
        gameName: "XO",
        turn: null
      })
    } else {
      await db.collection("game").doc(querySnapshot.docs[0].id).update({
        player2: model.currentUser.email,
        inRoom: firebase.firestore.FieldValue.increment(1)
      })
    }
    // for (let change of querySnapshot.docChanges()) {
    //   console.log(change.type, querySnapshot.empty)
    //   if (change.type === "added") {
    //     if (!querySnapshot.empty) {
    //       //   let game = await db.collection("game").doc()
    //       //   await console.log(game)
    //       //   let gameID = await game.id
    //       //   await game.set({
    //       //     id: gameID,
    //       //     inRoom: 1,
    //       //     player1: model.currentUser.email,
    //       // player2:null,
    //       //     eloFind: myElo,
    //       //     gameName: "XO",
    //       //     turn: null,
    // type: rank 
    //       //   })
    //       // } else {
    //       await db.collection("game").doc(querySnapshot.docs[0].id).update({
    //         player2: model.currentUser.email,
    //         inRoom: firebase.firestore.FieldValue.increment(1)
    //       })
    //     }
    //   }
    //   if (change.type === "modified") {

    //   }
    // }


  });
}

controller.customGame = async function (email) {
  db.collection("game").where("player2", "==", email).onSnapshot(async function (snapshot) {
    console.log(snapshot.empty)
    if (snapshot.empty) {
      let doc = await db.collection("game").doc()
      doc.set({
        id: doc.id,
        player1: model.currentUser.email,
        player2: email,
        inRoom: 1,
        gameName: "XO",
        gameType: "custom"
      })
    } else {
      document.getElementById('waitting-sent').innerHTML = `watting ${email}`
      alert("wait your friend")
    }
  })

}

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
