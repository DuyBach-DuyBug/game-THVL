const gameDiv = document.querySelector("div#gameDiv");
const formTag = document.querySelector("form");

let winner = false;
let draw = false;
let actualUser = null;

let gameObject = {
  x: {
    name: null,
    victories: 0,
  },
  o: {
    name: null,
    victories: 0,
  },
  gameArrays: {
    a: ["", "", "", "", "", "", "", ""],
    b: ["", "", "", "", "", "", "", ""],
    c: ["", "", "", "", "", "", "", ""],
    d: ["", "", "", "", "", "", "", ""],
    e: ["", "", "", "", "", "", "", ""],
    f: ["", "", "", "", "", "", "", ""],
    g: ["", "", "", "", "", "", "", ""],
    h: ["", "", "", "", "", "", "", ""],
  },
  draws: 0,
};

const checkForWinnerArray = (array) => {
  if (array.length == 3 && winner === false) {
    winner = array.split("").every((element) => element == actualUser);
  }
};

const displaySideDivs = () => {
  document.getElementById("actualPlayer").hidden = false;
  document.getElementById("playersScore").hidden = false;
};

const hideSideDivs = () => {
  document.getElementById("actualPlayer").hidden = true;
  document.getElementById("playersScore").hidden = true;
};

const displayActualPlayer = (userOnTurn) => {
  document.getElementById(
    "actualPlayerHeader"
  ).innerText = `It is ${gameObject[actualUser].name}'s Turn`;
  document.querySelectorAll("div#actualPlayer img").forEach((img) => {
    if (img.id != userOnTurn) {
      img.hidden = true;
    } else {
      img.hidden = false;
    }
  });
};

const displayGameBoard = () => {
  gameDiv
    .querySelectorAll(".row")
    .forEach((div) => (div.style.display = "-webkit-flex"));

  const firstPlayer = Math.floor(Math.random() * Math.floor(2));
  firstPlayer == 0 ? (actualUser = "x") : (actualUser = "o");

  displayActualPlayer(actualUser);
  displaySideDivs();
};

// Need to remane this functuons to correct way
const findDiagonalArrayValues = (i) => {
  let valuesString;

  if (i == 0) {
    valuesString = Array.from("abcdefgh", (x) => {
      let value = gameObject.gameArrays[x][i];
      i++;
      return value;
    }).join("");
  } else {
    valuesString = Array.from("abcdefgh", (x) => {
      let value = gameObject.gameArrays[x][i];
      i--;
      return value;
    }).join("");
  }
  return valuesString;
};

const findAmountOfMoves = () => {
  let moves = 0;
  ["a", "b", "c", "d", "e", "f", "g", "h"].forEach(
    (letter) => (moves += gameObject.gameArrays[letter].join("").length)
  );
  return moves;
};

const savePlayerInput = (divIdArray) => {
  gameObject.gameArrays[divIdArray[0]][divIdArray[1]] = actualUser;

  const lastMoveArrayHor = gameObject.gameArrays[divIdArray[0]].join("");
  const lastMoveArrayVert = Array.from(
    "abcdefgh",
    (key) => gameObject.gameArrays[key][divIdArray[1]]
  ).join("");
  const arrayAdecending = findDiagonalArrayValues(0);
  const arrayAacending = findDiagonalArrayValues(2);

  if (
    lastMoveArrayHor.length == 3 ||
    lastMoveArrayVert.length == 3 ||
    arrayAdecending.length == 3 ||
    arrayAacending.length == 3
  ) {
    checkForWinnerArray(lastMoveArrayHor);
    checkForWinnerArray(lastMoveArrayVert);
    checkForWinnerArray(arrayAdecending);
    checkForWinnerArray(arrayAacending);

    const amountOfMoves = findAmountOfMoves();
    console.log(amountOfMoves);
    if (amountOfMoves >= 63 && winner === false) {
      draw = true;
    }
  }
  if (winner === false && draw === false) {
    actualUser == "x" ? (actualUser = "o") : (actualUser = "x");
  }
};

const makeGameMove = (divId, moveUser) => {
  document.querySelectorAll(`div#${divId} img`).forEach((img) => {
    if (img.className != moveUser) {
      img.hidden = true;
    } else {
      img.className = "choosen";
    }
  });
};

const setTableData = () => {
  const trTags = document.querySelectorAll("table tbody tr");

  trTags[0].children[1].innerText = gameObject.x.name;
  trTags[0].children[2].innerText = gameObject.x.victories;

  trTags[1].children[1].innerText = gameObject.o.name;
  trTags[1].children[2].innerText = gameObject.o.victories;

  trTags[2].children[2].innerText = gameObject.draws;

  if (gameObject.x.victories > gameObject.o.victories) {
    trTags[0].children[0].innerHTML = `<i class="golden-star fas fa-star"></i>`;
  } else if (gameObject.x.victories < gameObject.o.victories) {
    trTags[1].children[0].innerHTML = `<i class="golden-star fas fa-star"></i>`;
  } else {
    trTags[0].children[0].innerHTML = "";
    trTags[1].children[0].innerHTML = "";
  }
};

const restartBoardState = () => {
  gameObject = {
    ...gameObject,
    gameArrays: {
      a: ["", "", "", "", "", "", "", ""],
      b: ["", "", "", "", "", "", "", ""],
      c: ["", "", "", "", "", "", "", ""],
      d: ["", "", "", "", "", "", "", ""],
      e: ["", "", "", "", "", "", "", ""],
      f: ["", "", "", "", "", "", "", ""],
      g: ["", "", "", "", "", "", "", ""],
      h: ["", "", "", "", "", "", "", ""],
    },
  };
  gameDiv.querySelectorAll(".row img").forEach((img) => {
    img.hidden = false;
    img.className = img.name;
    img.parentElement.style.pointerEvents = "";
  });
  setTableData();
};

const restartMatchData = () => {
  gameObject = {
    x: {
      name: null,
      victories: 0,
    },
    o: {
      name: null,
      victories: 0,
    },
    gameArrays: {
      a: ["", "", "", "", "", "", "", ""],
      b: ["", "", "", "", "", "", "", ""],
      c: ["", "", "", "", "", "", "", ""],
      d: ["", "", "", "", "", "", "", ""],
      e: ["", "", "", "", "", "", "", ""],
      f: ["", "", "", "", "", "", "", ""],
      g: ["", "", "", "", "", "", "", ""],
      h: ["", "", "", "", "", "", "", ""],
    },
    draws: 0,
  };

  restartBoardState();
  gameDiv
    .querySelectorAll(".row")
    .forEach((div) => (div.style.display = "none"));
  hideSideDivs();
  document.querySelector("#myForm").parentElement.hidden = false;
};

const gameEndBehavior = () => {
  if (winner === true) {
    swal(
      `${gameObject[actualUser].name} Won!`,
      `Victory #${gameObject[actualUser].victories}`,
      "success",
      {
        buttons: {
          cancel: "Restart Match Data",
          continue: true,
        },
      }
    ).then((value) => {
      switch (value) {
        case "continue":
          restartBoardState();
          break;

        default:
          swal("Please play again! Bye!");
          restartMatchData();
      }
    });
  } else if (draw === true) {
    swal(`Oh snap!`, `Is a draw :(`, "warning", {
      buttons: {
        cancel: "Restart Match Data",
        continue: true,
      },
    }).then((value) => {
      switch (value) {
        case "continue":
          // swal("Great", "Will set up new match!", "success");
          restartBoardState();
          break;

        default:
          swal("Please play again! Bye!");
          restartMatchData();
      }
    });
  }
  winner = false;
  draw = false;
};

const checkMatchStatus = () => {
  if (winner === false && draw === false) {
    displayActualPlayer(actualUser);
  } else if (winner === true) {
    gameObject[actualUser].victories += 1;
    gameEndBehavior();
  } else if (draw === true) {
    gameObject.draws += 1;
    gameEndBehavior();
  }
};

document.querySelector("#myForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const xName = e.target.xName.value;
  const oName = e.target.oName.value;

  if (xName === oName) {
    swal("Wait a sec!", "Names should be different!", "warning");
  } else {
    gameObject.x.name = xName;
    gameObject.o.name = oName;
    e.target.parentElement.hidden = true;
    swal("Begin!", `${gameObject.x.name} Vs ${gameObject.o.name}`, "success");
    setTableData();
    displayGameBoard();
  }
});

gameDiv.addEventListener("click", (event) => {
  if (actualUser != null) {
    let targetDiv;
    if (event.target.parentElement.dataset.name == "letterDiv") {
      targetDiv = event.target.parentElement;
    } else if (event.target.dataset.name == "letterDiv") {
      targetDiv = event.target;
    }
    if (targetDiv != undefined) {
      targetDiv.style.pointerEvents = "none";
      makeGameMove(targetDiv.id, actualUser);
      savePlayerInput(targetDiv.id.split(""));
      checkMatchStatus();
    }
  }
});

document
  .querySelector(".btn.btn-outline-danger")
  .addEventListener("click", () => restartMatchData());
