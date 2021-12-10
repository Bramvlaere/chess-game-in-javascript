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
                if (locatie.detail[2].length > 0 && _this.bord['x' + locatie.detail[2][0].x + 'y' + locatie.detail[2][0].y].occ && _this['x' + locatie.detail[2][0].x + 'y' + locatie.detail[2][0].y].unit.team != player.detail.team) {
                    _this.posstarg.push(_this.bord['x' + locatie.detail[2][0].x + 'y' + locatie.detail[2][0].y]) //basically copy paste from the one above but with a different index
                }


            }
            _this.infodisplay(_this.selected);
            _this.showSelect();





        });
    });
    this.startNewGame();






};

Play.re = {
    startNewGame: function() {
        var _this = this;
        this.bordvar.innerHTML = ''
        this.piecestaken.childeren[0].innerHTML = ''
        this.piecestaken.childeren[1].innerHTML = ''
        this.bord = {}
        this.move = 0
        this.Colorplayer = []
        this.turn = 'White' //said white first cause in chess white always goes first
        this.Whiteplayer = []
        this.position = []
        this.posstarg = []
        this.select = null; //initally nothing is selected
        document.getElementById('endgame').style.visibility = 'hidden'; //only needs to appear when game ends


    },
    boardSetup: function() {
        for (var x = 1; x <= 8; x++) { //two times 8 cause chess board is 8 by 8
            for (var y = 1; y <= 8; y++) {
                this.bord['x' + y + 'y' + x] = { occ: false, obj: null, unit: null }

            }
        }
    },
    showbord: function() {
        var _this = this;
        for (var x = 1; x <= 8; x++) {
            for (var y = 1; y <= 8; y++) {
                var li = document.createElement('li');
                li.setAttribute('index', 'x' + y + 'y' + x)
                if ((x + y) / 2 == parseInt((x + y) / 2)) {
                    li.className = "White";
                } else {
                    li.className = 'Colored';

                }
                this.bord["x" + x + "y" + y].obj = li;
                this.bordvar.appendChild(li)




            }
        }


    },
    showinfo: function(unit) {
        if (unit != undefined) {
            document.querySelector("#info > ul:first-of-type").style.visibility = "hidden";
            this.intel.innerHTML = "";
            var av = document.createElement("div");
            av.id = "avatar";
            av.className = this.select.getDomObj().className;
            var us = document.createElement("li");
            us.innerHTML = "Unit Selected: " + unit.type;
            var up = document.createElement("li");
            up.innerHTML = "Units Position: " + "x: " + unit.pos.x + ", y: " + unit.pos.y;
            var um = document.createElement("li");
            um.innerHTML = "Units Moves: " + unit.moves;
            var uk = document.createElement("li");
            uk.innerHTML = "Units Kills: " + unit.kills;
            var ul = document.createElement("li");
            ul.innerHTML = "Number of available locations: " + (this.position.length + this.posstarg.length);
            var ut = document.createElement("li");
            this.intel.appendChild(av);
            this.intel.appendChild(us);
            this.intel.appendChild(up);
            this.intel.appendChild(um);
            this.intel.appendChild(uk);
            this.intel.appendChild(ul);
            this.intel.appendChild(ut);

        } else {
            document.querySelector("#info > ul:first-of-type").style.visibility = "visible";
            document.querySelector("#info > ul:first-of-type > p").innerHTML = this.turn + "<br>Turn";
            document.querySelector("#info > ul:first-of-type").className = this.turn + "Turn";
            this.intel.className = this.turn + "Turn";
        }

    }
}

}