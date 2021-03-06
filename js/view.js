// hiển thị & xử lý trên giao diện
let view = {};
view.effectBackground = function () {
  var w = (c.width = window.innerWidth),
    h = (c.height = window.innerHeight),
    ctx = c.getContext("2d"),
    minDist = 10,
    maxDist = 30,
    initialWidth = 10,
    maxLines = 100,
    initialLines = 4,
    speed = 5,
    lines = [],
    frame = 0,
    timeSinceLast = 0,
    dirs = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
      [0.7, 0.7],
      [0.7, -0.7],
      [-0.7, 0.7],
      [-0.7, -0.7],
    ],
    starter = {
      x: w / 2,
      y: h / 2,
      vx: 0,
      vy: 0,
      width: initialWidth,
    };
  function init() {
    lines.length = 0;
    for (var i = 0; i < initialLines; ++i) lines.push(new Line(starter));
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, w, h);
  }
  function getColor(x) {
    return "hsl( hue, 80%, 50% )".replace("hue", (x / w) * 360 + frame);
  }
  function anim() {
    window.requestAnimationFrame(anim);
    ++frame;
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(0,0,0,.02)";
    ctx.fillRect(0, 0, w, h);
    ctx.shadowBlur = 0.5;
    for (var i = 0; i < lines.length; ++i)
      if (lines[i].step()) {
        lines.splice(i, 1);
        --i;
      }
    ++timeSinceLast;
    if (lines.length < maxLines && timeSinceLast > 10 && Math.random() < 0.5) {
      timeSinceLast = 0;
      lines.push(new Line(starter));
      ctx.fillStyle = ctx.shadowColor = getColor(starter.x);
      ctx.beginPath();
      ctx.arc(starter.x, starter.y, initialWidth, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  function Line(parent) {
    this.x = parent.x | 0;
    this.y = parent.y | 0;
    this.width = parent.width / 1.25;
    do {
      var dir = dirs[(Math.random() * dirs.length) | 0];
      this.vx = dir[0];
      this.vy = dir[1];
    } while (
      (this.vx === -parent.vx && this.vy === -parent.vy) ||
      (this.vx === parent.vx && this.vy === parent.vy)
    );
    this.vx *= speed;
    this.vy *= speed;
    this.dist = Math.random() * (maxDist - minDist) + minDist;
  }
  Line.prototype.step = function () {
    var dead = false;
    var prevX = this.x,
      prevY = this.y;
    this.x += this.vx;
    this.y += this.vy;
    --this.dist;
    if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) dead = true;
    if (this.dist <= 0 && this.width > 1) {
      this.dist = Math.random() * (maxDist - minDist) + minDist;
      if (lines.length < maxLines) lines.push(new Line(this));
      if (lines.length < maxLines && Math.random() < 0.5)
        lines.push(new Line(this));
      if (Math.random() < 0.2) dead = true;
    }
    ctx.strokeStyle = ctx.shadowColor = getColor(this.x);
    ctx.beginPath();
    ctx.lineWidth = this.width;
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(prevX, prevY);
    ctx.stroke();
    if (dead) return true;
  };
  init();
  anim();
  window.onresize = function () {
    w = c.width = window.innerWidth;
    h = c.height = window.innerHeight;
    starter.x = w / 2;
    starter.y = h / 2;
    init();
  };
};

view.showScreen = async function (screenName) {
  /* 
        log --> show giao diện của sign in, sign up
        menuGame --> show giao diện của menu 
    */

  let content = document.getElementById("section-content");

  switch (screenName) {
    case "log":
      // hiển thị giao diện của sign in
      content.innerHTML = components.log;

      document.getElementById("signUp").addEventListener("click", () => {
        document
          .getElementById("container")
          .classList.add("right-panel-active");
      });

      document.getElementById("signIn").addEventListener("click", () => {
        document
          .getElementById("container")
          .classList.remove("right-panel-active");
      });

      let formSignUp = document.getElementById("form-sign-up");
      formSignUp.onsubmit = async function (event) {
        event.preventDefault();
        view.setActive("sign-up-btn", true);
        // lấy dữ liệu từ form
        let name = formSignUp.name.value;
        let email = formSignUp.email.value;
        let password = formSignUp.password.value;
        let passwordConfirmation = formSignUp.passwordConfirmation.value;
        let validate = [
          view.validate(name != "", "name-error", "Input your name"),
          view.validate(email != "", "email-error", "Input your email"),
          view.validate(password != "", "password-error", "Input password"),
          view.validate(
            passwordConfirmation != "" && password == passwordConfirmation,
            "password-confirmation-error",
            "Password confirmation is not match"
          ),
        ];
        if (!isPass(validate)) {
          await controller.signUp(name, email, password);
        }
      };
      let formSignIn = document.getElementById("form-sign-in");
      formSignIn.onsubmit = function (event) {
        event.preventDefault();
        let email = formSignIn.email.value;
        let password = formSignIn.password.value;
        let validate = [
          view.validate(email != "", "email-error", "Input your email"),
          view.validate(password != "", "password-error", "Input password"),
        ];
        if (!isPass(validate)) {
          controller.signIn(email, password);
        }
      };
      break;

    case "menuGame":
      content.innerHTML = components.menuGame;

      view.userShow();
      view.locationTime();
      controller.scoreboard("xo");
      controller.scoreboard("ship");
      controller.scoreboard("brick");
      controller.online();
      document.getElementById("user-avatar").onchange = function (e) {
        readURL(e.target, e.target.nextElementSibling);
      };

      document.getElementById("user-name").onkeyup = function (e) {
        let dom = e.target;
        if (dom.value.length > 0) {
          dom.parentElement.classList.add("has-content");
        } else {
          dom.parentElement.classList.remove("has-content");
        }
      };

      document.getElementById("btnLogout").onclick = function () {
        controller.signOut();
      };

      document.getElementById("exitSidenav").onclick = function () {
        document.body.classList.remove("show-user-detail");
      };

      let formUpdate = document.getElementById("user-update");
      formUpdate.onsubmit = function (e) {
        e.preventDefault();
        let avatar = formUpdate.image.files[0];
        let name = formUpdate.name.value;
        controller.updateUser(avatar, name);
      };

      let btn = document.querySelectorAll("#sidenav .btnFunction");
      for (let i = 0; i < btn.length; i++) {
        btn[i].onclick = function (e) {
          let typeFunction = e.target.dataset.typefunction;
          controller.modal(typeFunction);
        };
      }

      // document.getElementById("play-xo").onclick = function () {
      //   controller.modal("findType");
      // };
      document.getElementById("play-brick").onclick = function () {
        view.showScreen("gameBrick");
      };
      document.getElementById("play-ship").onclick = function () {
        view.showScreen("gameShip");
      };
      // for(let btn of document.querySelectorAll('.game-box button')){
      //   btn.onclick = function(e){
      //     let typeGame = e.target.dataset.game
      //     if(typeGame == "brick"){
      //       view.showScreen("gameBrick");
      //     } else{
      //       controller.modal("findType");
      //       model.game = model.myScore[typeGame]
      //       model.game['name'] = typeGame
      //     }
      //   }
      // }
      break;

    case "gameXo":
      content.innerHTML = components.gameXo;
      view.createBoard(size);
      break;

    case "gameBrick":
      content.innerHTML = components.gameBrick;
      game.brick();
      document.getElementById("exitGame").onclick = function () {
        view.showScreen("menuGame");
      };
      break;
    case "gameShip":
      content.innerHTML = components.gameShip;
      game.ship();
      document.getElementById("exitGame").onclick = function () {
        view.showScreen("menuGame");
      };
      break;
  }
};

view.userShow = function () {
  let user = auth.currentUser;
  db.collection("user")
    .doc(user.uid)
    .onSnapshot(async function (doc) {
      console.log("Current data: ", doc.data());
      let userData = doc.data();
      model.currentUser = userData;
      // name
      document.getElementById("display-name").innerHTML = userData.userName;
      document.getElementById("user-name").value = userData.userName;
      document
        .getElementById("user-name")
        .parentElement.classList.add("has-content");
      // image
      if (userData.avatarUrl) {
        let userAvatar = document.querySelectorAll(".userAvatar");
        let resizeImg;
        try {
          resizeImg = await storage
            .ref()
            .child(`image_users/${user.uid}/avatar_210x210`)
            .getDownloadURL();
          // console.log(resizeImg);
          // .then(function(url) {
          //   return url
          // })
        } catch (error) {
          console.log(error);
          resizeImg = await storage
            .ref()
            .child(`image_users/${user.uid}/avatar`)
            .getDownloadURL();
          // .then(function(url) {
          //   return url
          // })
        }
        // console.log(resizeImg)
        for (let i = 0; i < userAvatar.length; i++) {
          userAvatar[i].src = resizeImg;
        }
      }
      // notification
      notification(userData);
    });
};

view.createBoard = async function (ratio) {
  let html = "";
  ratio = 10;
  let arr = [];
  for (let x = 0; x < ratio; x++) {
    for (let y = 0; y < ratio; y++) {
      html += `<div data-x="${x}" data-y="${y}" onclick="coordinates(this)">${x},${y}</div>`;
      let toaDo = { x: x, y: y };
      arr.push(toaDo);
    }
  }
  model.game = await db.collection("game").doc().set({
    gameMap: arr,
    turn: 1,
  });

  console.log(model.game);
  let dom = document.getElementById("board");
  dom.innerHTML = html;
  dom.style.width = 30 * ratio + "px";
};

view.locationTime = function () {
  let now = new Date();
  let h = now.getHours();
  let m = now.getMinutes();
  let s = now.getSeconds();
  function checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById("location-time").innerHTML = `${h}:${m}:${s} ${
    h > 12 ? "PM" : "AM"
  }`;
  setTimeout(view.locationTime, 500);
};

view.validate = function (condition, errorTag, message) {
  if (!condition) {
    // document.getElementById(errorTag).innerHTML = message;
    view.setText(errorTag, message);
    return false;
  } else {
    // document.getElementById(errorTag).innerHTML = "";
    view.setText(errorTag, "");
    return true;
  }
};

view.setText = function (id, content) {
  document.getElementById(id).innerHTML = content;
};

view.setActive = function (id, active) {
  document.getElementById(id).disabled = active;
};
