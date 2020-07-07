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
// declare a stack of characters
// while(there are more character in the word to read)
// read a character 
// push the character on the stack 
// while(the stack is not empty)
// write the stack's top character to the screen
// pop a character off the stack 
// let a;
// while