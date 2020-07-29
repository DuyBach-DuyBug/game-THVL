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
        brick: {
          elo: 0,
          winrate: 0,
          battle: 0,
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
controller.updateOnline = async function () {
  try {
    await db.collection("user").doc(auth.currentUser.uid).update({
      online: true,
    });
  } catch (error) {}
};

controller.updateOffline = function () {
  try {
    db.collection("user").doc(auth.currentUser.uid).onDisconnect().update({
      online: false,
    });
  } catch (error) {}
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
          model.myScore = scoreData;
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
  let domModal = document.getElementById("modal");
  switch (typeFunction) {
    case "btnFriends":
      domModal.innerHTML = modal[typeFunction];
      // friend online
      await db
        .collection("user")
        // .where("email", "array-contains", model.currentUser.friends)
        .onSnapshot(function (querySnapshot) {
          // console.log(querySnapshot)
          friendOnline(querySnapshot.docs, "my-friend");
        });
      // friend request
      await db
        .collection("user")
        .where("friendSent", "array-contains", model.currentUser.email)
        .onSnapshot(function (querySnapshot) {
          // console.log(querySnapshot)
          friendRequest(querySnapshot.docs, "friend-request");
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
        } else if(friend.empty == false && model.currentUser.friends.indexOf(email) >= 0){
          domError.innerHTML = "Was friend";
        } else {
          console.log(db.collection("user").doc(friend.docs[0].id));
          console.log(email);
          await db
            .collection("user")
            .doc(friend.docs[0].id)
            .update({
              friendRequest: firebase.firestore.FieldValue.arrayUnion(
                model.currentUser.email
              ),
            });
          await db
            .collection("user")
            .doc(model.currentUser.id)
            .update({
              friendSent: firebase.firestore.FieldValue.arrayUnion(email),
            });
          domError.innerHTML = "Has been sent";
          sent.reset();
        }
        domError.style.opacity = "1";
      };
      break;

    case "btnInvite":
      domModal.innerHTML = modal[typeFunction];
      await db
        .collection("game")
        // .where("player2", "==", model.currentUser.email)
        .where("gameType", "==", "custom")
        .where("player", "array-contains", model.currentUser.email)
        .onSnapshot(async function (snapshot) {
          console.log(snapshot);
          for (let i of snapshot.docs) {
            let data = await db
              .collection("user")
              .where("email", "==", i.data().player1)
              .get();
            await friendRequest(data.docs, "friend-invite");
          }
          await acceptBtn("friend-invite");
        });
      break;

    case "findType":
      //  t clone cái mới cho m=)))
      // nó lỗi ở đâu đâu í @@, tìm ko ra luôn :((
      // sao cứ vất await linh tinh thế nhr
      // mấy cái nì đâu cần await @@
      domModal.innerHTML = modal[typeFunction];
      let findRank = document.getElementById("findRank");
      findRank.onclick = function () {
        controller.modal("findRank");
        createLobby();
      };
      let findCustom = document.getElementById("findCustom");
      findCustom.onclick = function () {
        controller.modal("findCustom");
      };

      // ddc r đấy okok
      // đi wc xong đầu óc tỉnh cmn táo :D
      break;

    case "findRank":
      domModal.innerHTML = modal[typeFunction];
      timeFindGame();
      controller.rankGame();
      document.getElementById("back").onclick = function () {
        controller.modal("findType");
        clearFindType();
      };
      break;

    case "findCustom":
      domModal.innerHTML = modal[typeFunction];
      let form = document.getElementById("findFriend");
      form.onsubmit = function (e) {
        e.preventDefault();
        controller.customGame(form.email.value);
      };
      document.getElementById("back").onclick = function () {
        controller.modal("findType");
        clearFindType();
      };
      break;
  }

  document.body.classList.add("show-modal");
  // lỗi ở đây
  // bản chất của dòng 255 là nó sẽ làm mới lại toàn bộ html trong domModal --> html cũ mất --> onclick cũng bay màu
  // chõ này làm chay chút
  let btnExitModal = document.createElement("a");
  btnExitModal.setAttribute("id", "exitModal");
  btnExitModal.setAttribute("class", "close-btn");
  // btnExitModal.appendChild(document.createTextNode(''))
  btnExitModal.onclick = function () {
    domModal.innerHTML = "";
    document.body.classList.remove("show-modal");
    clearFindType();
  };

  domModal.appendChild(btnExitModal);
  // domModal.innerHTML += `<a id="exitModal" class="close-btn"></a>`
  // document.getElementById("exitModal").onclick = function () {
  //   domModal.innerHTML = ""
  //   document.body.classList.remove("show-modal");
  // }
};

controller.rankGame = async function () {
  let dataGame;
  if (model.game.name == "ship") {
    model.mapShip()
    dataGame = {
      player: model.currentUser.email,
      dataMap: model.dataShip
    };
  }

  console.log(dataGame)
  db.collection("game")
    .where("gameName", "==", model.game.name)
    .where("fullPlayer", "==", false)
    .where("gameType", "==", "rank")
    .onSnapshot(async function (querySnapshot) {
      // debugger;
      let minElo = model.game.elo - 100;
      let maxElo = model.game.elo + 100;
      let arrIdElo = [];
      let elo;
      let hasEmail = false;
      for (let [index, doc] of querySnapshot.docs.entries()) {
        let data = doc.data();
        elo = await data.eloFind;
        let checkPlayer = await data.player;
        if (checkPlayer.indexOf(model.currentUser.email) >= 0) {
          hasEmail = true;
        }
        if (minElo < data.eloFind && data.eloFind < maxElo) {
          arrIdElo.push(data.id);
        }
      }
      let gameIdJohn = convertRandomElo(arrIdElo);
      if (querySnapshot.empty == true && hasEmail == false) {
        // neu khong co phong true
        db.collection("game")
          .where("gameName", "==", model.game.name)
          .where("fullPlayer", "==", true)
          .where("gameType", "==", "rank")
          .where("player", "array-contains", model.currentUser.email)
          .onSnapshot(async function (miniSnapshot) {
            if (miniSnapshot.empty == true) {
              let game = await db.collection("game").doc();
              model.gameFinding = game.id;
              await game.set({
                id: game.id,
                gameType: "rank",
                player: [model.currentUser.email],
                eloFind: model.game.elo,
                gameName: model.game.name,
                data: [dataGame],
                fullPlayer: false,
                player1: model.currentUser.email
              });
            } else if(miniSnapshot.empty == false){
              view.showScreen("gameShip");
              
            }
          });
      } else if (hasEmail == false) {
        // neu co phong false
        db.collection("game")
          .doc(gameIdJohn)
          .update({
            player: firebase.firestore.FieldValue.arrayUnion(
              model.currentUser.email
            ),
            data: firebase.firestore.FieldValue.arrayUnion(
              dataGame
            ),
            player2: model.currentUser.email,
            fullPlayer: true,
          });
      }
    });
    db.collection("game")
    .where("gameName", "==", model.game.name)
    .where("fullPlayer", "==", true)
    .where("gameType", "==", "rank")
    .onSnapshot(async function (querySnapshot){

    })
};

controller.customGame = async function (email) {
  db.collection("game")
    .where("gameType", "==", "custom")
    .where("player", "array-contains", email)
    .onSnapshot(async function (snapshot) {
      console.log(snapshot.empty);
      if (snapshot.empty) {
        let doc = await db.collection("game").doc();
        model.gameFinding = doc.id;
        doc.set({
          id: game.id,
          gameType: "custom",
          player: [model.currentUser.email],
          gameName: model.game.name,
          data: dataGame,
          fullPlayer: false,
        });
      } else {
        document.getElementById("waitting-sent").innerHTML = `watting ${email}`;
      }
    });
};

// controller.createRoom = async function(title, email) {
//     // let member = [email, firebase.auth().currentUser.email]
//     await firebase
//         .firestore()
//         .collection("rooms")
//         .add({
//             title: title,
//             member: [email, auth.currentUser.email],
//             timestamp: firebase.firestore.FieldValue.serverTimestamp(),
//         });
//     console.log("done");
// };
// controller.loadConverstations = async function() {
//     let result = await firebase
//         .firestore()
//         .collection("rooms")
//         .orderBy("timestamp", "desc")
//         .get();
//     let converstations = [];
//     for (let doc of result.docs) {
//         converstations.push(refineData(doc));
//     }
//     await model.saveConverstations(converstations);
// };
// // create lobby

async function createLobby() {
  let lb = await firebase.firestore().collection("lobby").get();
  let nonelb = true;
  for (let lobby of lb.docs) {
    if (lobby.data().user.length < 2) {
      console.log("friendUser: " + `${lobby.data().user[0]}`);
      await firebase
        .firestore()
        .collection("lobby")
        .doc(lobby.id)
        .update({
          user: firebase.firestore.FieldValue.arrayUnion(
            auth.currentUser.email
          ),
        });
      nonelb = false;
      console.log(nonelb);
      break;
    }
  }
  if (nonelb) {
    let newlb = {
      user: [auth.currentUser.email],
      game: "XO",
    };
    await firebase.firestore().collection("lobby").add(newlb);
    console.log("ok");
  }
}
