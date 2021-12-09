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
                                }

                            }




                        }







                    }