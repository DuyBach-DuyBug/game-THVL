
async function createGame(){
	db.collection("game").where("player2", "==", email).onSnapshot(async function(snapshot) {
        console.log(snapshot.empty)
        if (snapshot.empty) {
            let doc = await db.collection("game").doc()
            doc.set({
                id: doc.id,
                player1: model.currentUser.email,
                player2: email,
                inRoom: 1,
                gameName: "ship",
                gameType: "custom"
            })
        } else {
            document.getElementById('waitting-sent').innerHTML = `watting ${email}`
            alert("wait your friend")
        }
    })
}
