let model = {
    // converstations: [],
    // currentConverstation: null,
    // [`scoreboard_xo`]: [],
    [`ship`]: {

    },
    [`brick`]: {

    },
    friendRe:[],
    friendList:[],
    currentUser: null,
    game: null,
    gameFinding: null,
    dataShip:[],
    mapShip: null,
    gamePLaying: null,
}
// model.saveConverstations = function (converstations) {
//     model.converstations = converstations
// }
// model.saveCurrentConverstation = function (converstation) {
//     model.currentConverstation =  converstation
// }
model.mapShip = function (dataShip){
    let data = model.dataShip
    for(let x = 0; x < 10; x++){
        for(let y = 0; y < 10; y++){
            data.push({
                x: x,
                y: y,
                ship: false,
                hit: false
            })
        }
    }
}