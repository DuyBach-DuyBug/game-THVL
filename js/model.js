let model = {
    converstations: [],
    currentConverstation: null,
    [`scoreboard_xo`]: [],
    [`scoreboard_ship`]: []
}
model.saveConverstations = function (converstations) {
    model.converstations = converstations
}
model.saveCurrentConverstation = function (converstation) {
    model.currentConverstation =  converstation
}
// model