var start = function() {
    //this fuinction will be contain the main items the chess game must be able to do i use this so i can recall them later
    var _this = this; //to provide a mechanism for when object functions are called, you have a "guaranteed" reference back to the instantiated object
    this.bordvar = document.getElementById('bord')
    this.piecestaken = document.getElementById('piecesT')
    this.bord = {}
    this.move = 0
    this.tmpclass = ''
    this.Colorplayer = []
    this.turn = 'White' //said white first cause in chess white always goes first
    this.Whiteplayer = []
    this.position = []
    this.posstarg = []
    this.select = null; //initally nothing is selected
    document.addEventListener("horizontale locatie", function(locatie) { //e
        document.addEventListener("player", function(player) { //t
            _this.clearboard();
            _this.selected = player.detail;
            _this.selected.getDomObj().className += ' selected';
            if (player.detail.type != 'pawn') { // total location of the pawns get determined here because all the pawns need to be put next to eachother 
                for (var i in locatie.detail) {
                    for (var y in locatie.detail[i]) {
                        var tmp = 'x' + locatie.detail[i][y].x + 'y' + locatie.detail[i][j].y; //initialise the x and y location on the board 
                        if (!_this.bord[tmp].occ) {
                            _this.position.push(_this.bord[tmp].obj); //push the location in the position array
                        } else {
                            if (_this.bord[tmp].unit.team != player.detail.team) { //if it is not the first team
                                _this.posstarg.push(_this.bord[tmp].obj); //push the team

                            }
                            if (player.detail.type != 'knight') {
                                break;
                            }
                        }

                    }
                }
            } else {
                for (var i in locatie.detail[0]) {
                    console.log(locatie.detail)
                    var tmp = 'x' + locatie.detail[0][i].x + 'y' + locatie.detail[0][i].y
                    if (!_this.bord[tmp].occ) {
                        _this.position.push(_this.bord[tmp].obj);
                    }
                    //else{
                    //    break
                    //}

                }
                if (locatie.detail[1].length > 0 && _this.bord['x' + locatie.detail[1][0].x + 'y' + locatie.detail[1][0].y].occ && _this['x' + locatie.detail[1][0].x + 'y' + locatie.detail[1][0].y].unit.team != player.detail.team) {
                    _this.posstarg.push(_this.bord['x' + locatie.detail[1][0].x + 'y' + locatie.detail[1][0].y]);
                }
                if (locatie.detail[2].length > 0 && _this.bord['x' + locatie.detail[2][0].x + 'y' + locatie.detail[2][0].y].occ && _this['x' + locatie.detail[1][0].x + 'y' + locatie.detail[1][0].y].unit.team != player.detail.team) {
                    _this.posstarg.push(_this.bord['x' + locatie.detail[1][0].x + 'y' + locatie.detail[1][0].y])
                }


            }
            _this.infodisplay(_this.selected);
            _this.showSelect();





        });
    });
    this.startNewGame();






};


function startsetup() {
    for (var x = 1; x <= 8; x++) {
        for (var y = 1; y <= 8; y++) {
            this.board["x" + y + "y" + x] = { occ: false, obj: null, unit: null };
        }
    }
    this.displayBoard();


}

displayBoard: function() {
    var _this = this;
    for (var x = 1; x <= 8; x++) {
        for (var y = 1; y <= 8; y++) {
            var temp = document.createElement("li");
            temp.setAttribute("index", "x" + y + "y" + x);
            if ((x + y) / 2 == parseInt((x + y) / 2)) {
                temp.className = "notblack";
            } else {
                temp.className = "black";
            }
            this.board["x" + x + "y" + y].obj = temp;
            this.boardObj.appendChild(temp)
        }
    }
    this.teamBlacks();
    this.teamNotBlacks();
}