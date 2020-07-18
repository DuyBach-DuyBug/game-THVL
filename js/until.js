function isPass(validate) {
  return validate.includes(false);
}
function refineData(rawData) {
  let data = rawData.data();
  data.id = rawData.id;
  return data;
}
function refineTime(detailTime) {
  let timestamp = detailTime.toDate();
  let day = timestamp.getDate();
  let month = timestamp.getMonth();
  let year = timestamp.getFullYear();
  let minute = timestamp.getMinutes();
  let hour = timestamp.getHours();
  let time = `${day}/${month + 1}/${year} || ${hour}:${minute}`;
  return time;
}

function convertSecondstoTime(time) {
  given_seconds = time;

  dateObj = new Date(given_seconds * 1000);
  hours = dateObj.getUTCHours();
  minutes = dateObj.getUTCMinutes();
  seconds = dateObj.getSeconds();

  timeString =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    seconds.toString().padStart(2, "0");
  return timeString;
}
function countTest(time) {
  let abc = setInterval(myTimer, 1000);
  function myTimer() {
    console.log(convertSecondstoTime(time));
    time--;
    if (time == -1) {
      clearInterval(abc);
      return false;
    }
  }
}

function readURL(input, place_img) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      place_img.src = event.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function notification(userData) {
  let sumNotification = 0;
  // console.log(userData.friendRequest.length)
  let requestFr = userData.friendRequest
  if (requestFr.length > 0) {
    document.getElementById('notification').innerHTML += requestFr.length
    document.querySelector('.btnFunction[data-typefunction="btnFriends"]')
  }
}

function refineScore(arrScore, domID, position) {
  let html = "";
  for (let i = 0; i < 10; i++) {
    if (typeof arrScore[i] != "undefined") {
      html += `<div class="score-user d-flex number-${
        i + 1
        }" data-score="user-${i}">
  <span>${i + 1}</span>
  <p>${arrScore[i].name}</p>
  <div class="info-point">
    <span>${arrScore[i][position].elo}</span>
    <span>${
        arrScore[i][position].battle > 0
          ? (arrScore[i][position].win / arrScore[i][position].battle) * 100
          : 0
        }%</span>
  </div>
</div>`;
    }
  }
  domID.innerHTML = html;
}

function refineMyScore(index, scoreData, position) {
  document.getElementById(
    "myScoreboard_" + position
  ).innerHTML = `<div class="my-score score-user d-flex ">
<span>${index < 50 ? index + 1 : "..."}</span>
<p id="myName_xo">${scoreData.name}</p>
<div class="info-point">
  <span id="myScore_xo">${scoreData[position].elo}</span>
  <span id="myWinrate_xo">${
    scoreData[position].battle > 0
      ? (scoreData[position].win / scoreData[position].battle) * 100
      : 0
    }%</span>
</div>
</div>`;
}
function refineOnline(arrOnline) {
  let html = "";
  for (let data of arrOnline) {
    html += `<div class="d-flex border-curved">
      <img src="${
      data.avatarUrl != null ? data.avatarUrl : "asset/man-avatar.png"
      }" class="round-box small-img">
      <p>${data.userName}</p>
    </div>`;
  }
  document.getElementById("list-online").innerHTML = html;
  document.getElementById("count-online").innerHTML = arrOnline.length;
}

function friendRequest(model, domID) {
  let html = "";
  for (let [index, doc] of model.entries()) {
    let data = doc.data()
    console.log(data)

    html += `<div class="d-flex flex-spacebetween border-solid border-curved">
  <img class="round-box small-img" src="${
      data.avatarUrl != null ? data.avatarUrl : "asset/woman-avatar.png"
      }" />
  <div class="detail"><p class="name">${data.userName}</p><p>${data.email}</p></div>
  <div class="d-flex">
    <a data-id="${data.id}" data-user="${data.email}" class="btn-neon yes"><span></span><span></span></a>
    <a data-id="${data.id}" data-user="${data.email}" class="btn-neon no"><span></span><span></span></a>
  </div>
</div>`;
    document.getElementById(domID).innerHTML = html;
  }
}

function acceptBtn(dom) {
  let btnGroups = document.querySelectorAll(`#${dom} .yes`)
  for(let i=0; i< btnGroups.length; i++){
    btnGroups[i].onclick = function (e){
      let check = e.target
      let userSent = e.target.dataset.user
      let sentId = e.target.dataset.id
      console.log(check, userSent, sentId)
      if(dom == "friend-invite"){
        // db.collection("game").where("")
      }
    }
  }
}

function outNavbar(e) {
  if (document.body.classList.contains("show-user-detail")) {
    if (!document.getElementById("sidenav").contains(e.target)) {
      document.body.classList.remove("show-user-detail");
    }
  }
}
// function findType(dom){
//   let typeGame = dom.dataset.typegame
//   console.log(typeGame)
//   controller.modal(typeGame)
// }
function userDetail() {
  document.body.classList.add("show-user-detail");
}
function openTab(e, tabId) {
  let tab = document.querySelectorAll(".tab button");
  for (let i = 0; i < tab.length; i++) {
    tab[i].classList.remove("active");
  }
  e.classList.add("active");
  let content = document.querySelectorAll(".tabcontent");
  for (let i = 0; i < content.length; i++) {
    content[i].classList.remove("active");
  }
  document.getElementById(tabId).classList.add("active");
}

function coordinates(dom){
  console.dir(dom)
  let x = dom.dataset.x
  let y = dom.dataset.y
  console.log(x,y)
  db.collection("game").doc().set({

  })
}