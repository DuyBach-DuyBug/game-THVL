// let gameSpecifications = {
//   sizeShip: null,
//   shipSelect: null,
//   rotate: false,
//   mouseAction: null,
//   shipUse: 0,
//   number: 0,
// };
// (gameSpecifications.sizeShip = {
//   patrolboat: { x: 1, y: 1 },
//   submarine: { x: 1, y: 2 },
//   destroyer: { x: 1, y: 3 },
//   battleship: { x: 1, y: 4 },
//   carrier: { x: 1, y: 5 },
// }),
//   (gameSpecifications.shipSelect = function (nameShip, dom) {
//     let sizeX = gameSpecifications.sizeShip[nameShip].x;
//     let sizeY = gameSpecifications.sizeShip[nameShip].y;
//     let sizeShip = { x: sizeX, y: sizeY, rotate: sizeY };
//     if (gameSpecifications.rotate == true) {
//       sizeShip = { x: sizeY, y: sizeX, rotate: sizeY };
//     }
//     gameSpecifications.mouseAction(dom, sizeShip);
//   });
// gameSpecifications.mouseAction = function (dom, sizeShip) {
//   let mouseArea = document.querySelectorAll("#mySea .box");
//   console.log(sizeShip);
//   gameSpecifications.number = sizeShip.x * sizeShip.y;
//   for (let box of mouseArea) {
//     box.onclick = function (e) {
//       console.log(e.target);
//       let dom = e.target;
//       let a = Number(dom.dataset.x);
//       let b = Number(dom.dataset.y);
//       let checkX = a + Number(sizeShip.x);
//       let checkY = b + Number(sizeShip.y);
//       if (checkX <= 10 && checkY <= 10) {
//         for (let i = 0; i < sizeShip.rotate; i++) {
//           let long, truc
//           let trucX = a +i
//           let trucY = b +i
//           // if(gameSpecifications.rotate == false){
//           //   long = b+i
//           //   truc = 'y'
//           // } else {
//           //   long = a+i
//           //   truc = 'x'
//           // }
//           debugger
//           console.log(long)
//           let abc = document.querySelector(
//             `#mySea .box-${}-${}.box-${truc}-${long}`
//           );
//           console.dir(abc);
//           abc.classList.add("ship");
//         }
//       }
//     };
//   }
// };

// db.collection("game")
//   .doc("qxWJQIWjIKGGYkMSymLL")
//   .onSnapshot(async function (doc) {
//     // model.gamePLaying = doc.data();
//     // let data = model.gamePLaying
//     let data = doc.data();
//     for (let minData of data.data) {
//       // if(minData.player == model.currentUser.email){
//       if (minData.player == "admin@gmail.com") {
//         createMap(minData, "mySea");
//       } else {
//         createMap(minData, "enemySea");
//       }
//     }
//   });

// function createMap(data, id) {
//   console.log(data);
//   let html = "";
//   for (let i of data.dataMap) {
//     html += `<div class="box ${i.hit == true ? "hit" : "miss"} box-x-${i.x} box-y-${i.y}" data-x="${
//       i.x
//     }" data-y="${i.y}" ></div>`;
//   }
//   document.getElementById(id).innerHTML = html;
// }
// // click chon tau
// let listShip = document.querySelectorAll(".fleet-roster li");
// for (let ship of listShip) {
//   ship.onclick = function (e) {
//     let nameShip = e.target.id;
//     let dom = e.target;
//     for (let ship of listShip) {
//       ship.classList.remove("select");
//       ship.classList.add("disable-box");
//     }
//     dom.classList.add("select");
//     dom.classList.remove("disable-box");
//     // e.target.classList.add('hidden')
//     gameSpecifications.shipSelect(nameShip, dom);
//   };
// }

// document.getElementById("rotate-button").onclick = function (e) {
//   if (gameSpecifications.rotate == true) {
//     gameSpecifications.rotate = false;
//   } else {
//     gameSpecifications.rotate = true;
//   }
//   e.target.classList.toggle("rote");
// };
