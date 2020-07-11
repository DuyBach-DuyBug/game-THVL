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
      return false
    }
  }
}
countTest(5);

function readURL(input, place_img) {
  if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
          place_img.attr('src', event.target.result)
      }
      reader.readAsDataURL(input.files[0]);
  }
}
function outNavbar(e) {
  if (document.body.classList.contains('show-user-detail')) {
    if (! document.getElementById('sidenav').contains(e.target)) {
      document.body.classList.remove('show-user-detail')
    }
  }
}

function userDetail() {
  document.body.classList.add('show-user-detail')
}
function openTab(e, tabId){
  let tab = document.querySelectorAll('.tab button')
  for(let i = 0; i < tab.length; i++){
    tab[i].classList.remove('active')
  }
  e.classList.add('active')
  let content = document.querySelectorAll('.tabcontent')
  for(let i = 0; i < content.length; i++){
    content[i].classList.remove('active')
  }
  document.getElementById(tabId).classList.add('active')
}
