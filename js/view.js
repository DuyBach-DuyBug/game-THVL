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
        signIn --> show giao diện của sign in
        signUp --> show giao diện của sign up
        chat --> show giao diện của chat 
    */

  let content = document.getElementById("section-content");

  switch (screenName) {
    case "log":
      // hiển thị giao diện của sign in
      content.innerHTML = components.log;

      // thêm sự kiện click cho sign-up-link --> giao diện sign up

      // let signUpLink = document.getElementById("sign-in-link");
      // signUpLink.onclick = function () {
      //   view.showScreen("menuGame");
      // };
      const signUpButton = document.getElementById("signUp");
      const signInButton = document.getElementById("signIn");
      const container = document.getElementById("section-content");

      signUpButton.addEventListener("click", () => {
        container.classList.add("right-panel-active");
      });

      signInButton.addEventListener("click", () => {
        container.classList.remove("right-panel-active");
      });

      let formSignUp = document.getElementById("registerForm");
      formSignUp.onsubmit = async function (event) {
        event.preventDefault();
        view.setActive("registerBtn", true);
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
        // gửi dữ liệu & lưu trong cơ sở dữ liệu
        // thư viện firebase
        if (!isPass(validate)) {
          await controller.signUp(name, email, password);
        }

        // await view.setActive('btn', false)
      };
      let formSignIn = document.getElementById("loginForm");
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

    // case "signUp":
    //   // hiển thị giao diện của sign up
    //   content.innerHTML = components.signUp;

    //   // thêm sự kiện click cho sign-in-link --> giao diện sign in
    //   let signInLink = document.getElementById("sign-up-link");
    //   signInLink.onclick = function () {
    //     view.showScreen("signIn");
    //   };

    //   // xử lý form-sign-up

    //   break;
    case "menuGame":
      content.innerHTML = components.menuGame;

      view.userShow();
      view.locationTime();
      controller.scoreboard("xo");
      controller.scoreboard("ship");

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

      document.getElementById("btnLogout").onclick = function (e) {
        e.preventDefault();
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
      
      break;
  }
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

view.userShow = function () {
  let user = auth.currentUser;
  db.collection("user")
    .doc(user.uid)
    .onSnapshot(function (doc) {
      console.log("Current data: ", doc.data());
      let userData = doc.data();
      // name
      document.getElementById("display-name").innerHTML = userData.userName;
      document.getElementById("user-name").value = userData.userName;
      document
        .getElementById("user-name")
        .parentElement.classList.add("has-content");
      // image
      if (userData.avatarUrl) {
        let userAvatar = document.querySelectorAll(".userAvatar");
        for (let i = 0; i < userAvatar.length; i++) {
          userAvatar[i].src = userData.avatarUrl;
        }
      }
      // score XO
      // for (let game in userData.score) {
      //   let gameData = userData.score[game]
      //   // console.log(gameData);
      //   // for(let point of game){
      //   //   console.log(point);
      //     document.getElementById("myName_" + game).innerHTML = userData.userName;
      //     document.getElementById("myScore_" + game).innerHTML = gameData.elo;
      //     document.getElementById("myWinrate_" + game).innerHTML = `${gameData.battle > 0 ? gameData.win / gameData.battle * 100 : 0} %`;
      //   // }
      // }
    });
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
