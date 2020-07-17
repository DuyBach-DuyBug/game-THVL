let model = {
    converstations: [],
    currentConverstation: null,
    [`scoreboard_xo`]: [],
    [`scoreboard_ship`]: [],
    friendRe:[],
    friendList:[],
    currentUser: null
}
model.saveConverstations = function (converstations) {
    model.converstations = converstations
}
model.saveCurrentConverstation = function (converstation) {
    model.currentConverstation =  converstation
}
// model