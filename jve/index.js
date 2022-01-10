var Play = function() {
    var _this = this;
    this.boardObj = document.getElementById("board");
    this.cemetery = document.getElementById("cemetery");
    this.data = document.getElementById("data");
    this.board = {};
    this.tempClass = "";
    this.moves = 0;
    this.blacks = [];
    this.round = "notBlacks";
    this.notBlacks = [];
    this.validPos = [];
    this.targets = [];
    this.selected = null;
    document.addEventListener("locations", function(e) {
        document.addEventListener("thisIsMe", function(t) {
            _this.clearSelect();
            _this.selected = t.detail;
            _this.selected.getDomObj().className += " selected";
            if (t.detail.type != "Pawn") {
                for (var i in e.detail) {
                    for (var j in e.detail[i]) {
                        var temp = "x" + e.detail[i][j].x + "y" + e.detail[i][j].y;
                        if (!_this.board[temp].occ) {
                            _this.validPos.push(_this.board[temp].obj);
                        } else {
                            if (_this.board[temp].unit.team != t.detail.team) {
                                _this.targets.push(_this.board[temp]);
                            }
                            if (t.detail.type != "Knight") {
                                break;
                            }
                        }
                    }
                }
            } else {
                for (var i in e.detail[0]) {
                    var temp = "x" + e.detail[0][i].x + "y" + e.detail[0][i].y;
                    if (!_this.board[temp].occ) {
                        _this.validPos.push(_this.board[temp].obj);
                    } else {
                        break;
                    }
                }
                if (e.detail[1].length > 0 && _this.board["x" + e.detail[1][0].x + "y" + e.detail[1][0].y].occ && _this.board["x" + e.detail[1][0].x + "y" + e.detail[1][0].y].unit.team != t.detail.team) {
                    _this.targets.push(_this.board["x" + e.detail[1][0].x + "y" + e.detail[1][0].y]);
                }
                if (e.detail[2].length > 0 && _this.board["x" + e.detail[2][0].x + "y" + e.detail[2][0].y].occ && _this.board["x" + e.detail[2][0].x + "y" + e.detail[2][0].y].unit.team != t.detail.team) {
                    _this.targets.push(_this.board["x" + e.detail[2][0].x + "y" + e.detail[2][0].y]);
                }
            }
            _this.displayInfo(_this.selected);
            _this.showSelect();
        });
    });
    this.startNewGame();
};

Play.prototype = {
    startNewGame: function() {
        var _this = this;
        this.boardObj.innerHTML = "";
        this.cemetery.children[0].innerHTML = "";
        this.cemetery.children[1].innerHTML = "";
        this.board = {};
        this.moves = 0;
        this.blacks = [];
        this.round = "notBlacks";
        this.notBlacks = [];
        this.validPos = [];
        this.targets = [];
        this.selected = null;
        this.boardSetup();
        this.displayInfo();
        document.getElementById("over").style.visibility = "hidden";
    },
    boardSetup: function() {
        for (var x = 1; x <= 8; x++) {
            for (var y = 1; y <= 8; y++) {
                this.board["x" + y + "y" + x] = { occ: false, obj: null, unit: null };
            }
        }
        this.displayBoard();
    },
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
    },
    displayInfo: function(unit) {
        if (unit != undefined) {
            document.querySelector("#info > ul:first-of-type").style.visibility = "hidden";
            this.data.innerHTML = "";
            var av = document.createElement("div");
            av.id = "avatar";
            av.className = this.selected.getDomObj().className;
            var us = document.createElement("li");
            us.innerHTML = "Unit Selected: " + unit.type;
            var up = document.createElement("li");
            up.innerHTML = "Units Position: " + "x: " + unit.pos.x + ", y: " + unit.pos.y;
            var um = document.createElement("li");
            um.innerHTML = "Units Moves: " + unit.moves;
            var uk = document.createElement("li");
            uk.innerHTML = "Units Kills: " + unit.kills;
            var ul = document.createElement("li");
            ul.innerHTML = "Number of available locations: " + (this.validPos.length + this.targets.length);
            var ut = document.createElement("li");
            ut.innerHTML = "Number of enemy targets: " + this.targets.length;
            this.data.appendChild(av);
            this.data.appendChild(us);
            this.data.appendChild(up);
            this.data.appendChild(um);
            this.data.appendChild(uk);
            this.data.appendChild(ul);
            this.data.appendChild(ut);
        } else {
            document.querySelector("#info > ul:first-of-type").style.visibility = "visible";
            document.querySelector("#info > ul:first-of-type > p").innerHTML = this.round + "<br>Turn";
            document.querySelector("#info > ul:first-of-type").className = this.round + "Turn";
            this.data.className = this.round + "Turn";
        }
    },
    clearSelect: function() {
        for (var i = 0; i < this.validPos.length; i++) {
            var vTemp = this.validPos[i].className;
            this.validPos[i].className = vTemp.replace(" valid", "");
            this.validPos[i].removeEventListener("click", this.location);
            this.validPos[i].removeEventListener("mouseover", this.hover);
            this.validPos[i].removeEventListener("mouseout", this.hoverOut);
        }
        for (var j = 0; j < this.targets.length; j++) {
            var tTemp = this.targets[j].obj.className;
            this.targets[j].obj.className = tTemp.replace(" target", "")
            this.targets[j].obj.removeEventListener("click", this.kill);
        }
        if (this.selected != null) {
            var vTemp = this.selected.getDomObj().className;
            this.selected.getDomObj().className = vTemp.replace(" selected", "");
            //     this.selected.getDomObj().className = vTemp;
        }
        this.selected = null;
        this.validPos = [];
        this.targets = [];
        document.getElementById("avatar").className = "";
        document.querySelector("#info > ul:first-of-type").style.visibility = "visible";
        document.querySelector("#info > ul:first-of-type > p").innerHTML = this.round + "<br>Turn";
        document.querySelector("#info > ul:first-of-type").className = this.round + "Turn";
        this.data.className = this.round + "Turn";
    },
    showSelect: function() {
        for (var i = 0; i < this.validPos.length; i++) {
            this.validPos[i].className += " valid ";
            this.validPos[i].addEventListener("mouseover", this.hover);
            this.validPos[i].addEventListener("mouseout", this.hoverOut);
            this.validPos[i].addEventListener("click", this.location);
        }
        for (var j = 0; j < this.targets.length; j++) {
            this.targets[j].obj.className += " target";
            this.targets[j].obj.addEventListener("click", this.kill);
        }
    },
    hover: function(e) {
        p.tempClass = e.target.className.replace(" selected", "");
        var vTemp = p.selected.getDomObj().className;
        e.target.className = p.tempClass + " " + vTemp;
    },
    hoverOut: function(e) {
        e.target.className = p.tempClass;
    },
    location: function(e) {
        p.hoverOut(e);
        p.moveHere(e.target);
        p.clearSelect();
    },
    moveHere: function(e) {
        var temp = e.getAttribute("index");
        temp.split("");
        p.board["x" + temp[3] + "y" + temp[1]].obj.appendChild(p.selected.getDomObj());
        p.board["x" + temp[3] + "y" + temp[1]].occ = true;
        p.board["x" + temp[3] + "y" + temp[1]].unit = p.selected;
        p.board["x" + p.selected.pos.y + "y" + p.selected.pos.x].obj.className = p.board["x" + p.selected.pos.y + "y" + p.selected.pos.x].obj.className.replace(" selected", "");
        p.board["x" + p.selected.pos.y + "y" + p.selected.pos.x].occ = false;
        p.board["x" + p.selected.pos.y + "y" + p.selected.pos.x].unit = null;
        p.selected.pos = { x: Number(temp[1]), y: Number(temp[3]) };
        p.selected.moves += 1;
        if (p.round == "blacks") {
            p.round = "notBlacks"
        } else {
            p.round = "blacks"
        }
    },
    kill: function(e) {
        var _this = this;
        var temp = e.target.parentElement.getAttribute("index").split("");
        var pe = e.target.parentElement;
        var target = p.board["x" + temp[3] + "y" + temp[1]].unit;
        p.selected.kills += 1;
        target.dead = true;
        if (e.target.className.split(" ")[0] == "notBlacks") {
            (p.cemetery.children[1]).appendChild(target.getDomObj());
        } else {
            (p.cemetery.children[0]).appendChild(target.getDomObj());
        }
        p.moveHere(pe);
        if (target.type == "King") {
            p.gameOver(target.team)
        }
        p.clearSelect();
    },
    gameOver: function(losers) {
        var _this = this;
        document.querySelector("#over > div > p").innerHTML = losers + " loses!";
        document.getElementById("over").style.visibility = "visible";
        document.querySelector("#over .butt:first-of-type").addEventListener("click", function() {
            _this.startNewGame();
        });
        document.querySelector("#over .butt:last-of-type").addEventListener("click", function() {
            _this.round = null;
            document.getElementById("over").style.visibility = "hidden";
        })
    },
    teamBlacks: function() {
        var temp = new Unit("Rook");
        temp.team = "blacks";
        temp.pos = { x: 1, y: 1 };
        temp.getDomObj().className = "blacks rook";
        this.blacks.push(temp);
        this.board["x" + 1 + "y" + 1].obj.appendChild(temp.getDomObj());
        this.board["x" + 1 + "y" + 1].occ = true;
        this.board["x" + 1 + "y" + 1].unit = temp;
        var temp = new Unit("Knight");
        temp.team = "blacks";
        temp.pos = { x: 2, y: 1 };
        temp.getDomObj().className = "blacks knight";
        this.blacks.push(temp);
        this.board["x" + 1 + "y" + 2].obj.appendChild(temp.getDomObj());
        this.board["x" + 1 + "y" + 2].occ = true;
        this.board["x" + 1 + "y" + 2].unit = temp;
        var temp = new Unit("Bishop");
        temp.team = "blacks";
        temp.pos = { x: 3, y: 1 };
        temp.getDomObj().className = "blacks bishop";
        this.blacks.push(temp);
        this.board["x" + 1 + "y" + 3].obj.appendChild(temp.getDomObj());
        this.board["x" + 1 + "y" + 3].occ = true;
        this.board["x" + 1 + "y" + 3].unit = temp;
        var temp = new Unit("Queen");
        temp.team = "blacks";
        temp.pos = { x: 4, y: 1 };
        temp.getDomObj().className = "blacks queen";
        this.blacks.push(temp);
        this.board["x" + 1 + "y" + 4].obj.appendChild(temp.getDomObj());
        this.board["x" + 1 + "y" + 4].occ = true;
        this.board["x" + 1 + "y" + 4].unit = temp;
        var temp = new Unit("King");
        temp.team = "blacks";
        temp.pos = { x: 5, y: 1 };
        temp.getDomObj().className = "blacks king";
        this.blacks.push(temp);
        this.board["x" + 1 + "y" + 5].obj.appendChild(temp.getDomObj());
        this.board["x" + 1 + "y" + 5].occ = true;
        this.board["x" + 1 + "y" + 5].unit = temp;
        var temp = new Unit("Bishop");
        temp.team = "blacks";
        temp.pos = { x: 6, y: 1 };
        temp.getDomObj().className = "blacks bishop";
        this.blacks.push(temp);
        this.board["x" + 1 + "y" + 6].obj.appendChild(temp.getDomObj());
        this.board["x" + 1 + "y" + 6].occ = true;
        this.board["x" + 1 + "y" + 6].unit = temp;
        var temp = new Unit("Knight");
        temp.team = "blacks";
        temp.pos = { x: 7, y: 1 };
        temp.getDomObj().className = "blacks knight";
        this.blacks.push(temp);
        this.board["x" + 1 + "y" + 7].obj.appendChild(temp.getDomObj());
        this.board["x" + 1 + "y" + 7].occ = true;
        this.board["x" + 1 + "y" + 7].unit = temp;
        var temp = new Unit("Rook");
        temp.team = "blacks";
        temp.pos = { x: 8, y: 1 };
        temp.getDomObj().className = "blacks rook";
        this.blacks.push(temp);
        this.board["x" + 1 + "y" + 8].obj.appendChild(temp.getDomObj());
        this.board["x" + 1 + "y" + 8].occ = true;
        this.board["x" + 1 + "y" + 8].unit = temp;
        for (var i = 1; i <= 8; i++) {
            var temp = new Unit("Pawn");
            temp.team = "blacks";
            temp.pos = { x: i, y: 2 };
            temp.getDomObj().className = "blacks pawn";
            this.blacks.push(temp);
            this.board["x" + 2 + "y" + i].obj.appendChild(temp.getDomObj());
            this.board["x" + 2 + "y" + i].occ = true;
            this.board["x" + 2 + "y" + i].unit = temp;
        }
    },
    teamNotBlacks: function() {
        var temp = new Unit("Rook");
        temp.team = "notBlacks";
        temp.pos = { x: 1, y: 8 };
        temp.getDomObj().className = "notBlacks rook";
        this.notBlacks.push(temp);
        this.board["x" + 8 + "y" + 1].obj.appendChild(temp.getDomObj());
        this.board["x" + 8 + "y" + 1].occ = true;
        this.board["x" + 8 + "y" + 1].unit = temp;
        var temp = new Unit("Knight");
        temp.team = "notBlacks";
        temp.pos = { x: 2, y: 8 };
        temp.getDomObj().className = "notBlacks knight";
        this.notBlacks.push(temp);
        this.board["x" + 8 + "y" + 2].obj.appendChild(temp.getDomObj());
        this.board["x" + 8 + "y" + 2].occ = true;
        this.board["x" + 8 + "y" + 2].unit = temp;
        var temp = new Unit("Bishop");
        temp.team = "notBlacks";
        temp.pos = { x: 3, y: 8 };
        temp.getDomObj().className = "notBlacks bishop";
        this.notBlacks.push(temp);
        this.board["x" + 8 + "y" + 3].obj.appendChild(temp.getDomObj());
        this.board["x" + 8 + "y" + 3].occ = true;
        this.board["x" + 8 + "y" + 3].unit = temp;
        var temp = new Unit("Queen");
        temp.team = "notBlacks";
        temp.pos = { x: 4, y: 8 };
        temp.getDomObj().className = "notBlacks queen";
        this.notBlacks.push(temp);
        this.board["x" + 8 + "y" + 4].obj.appendChild(temp.getDomObj());
        this.board["x" + 8 + "y" + 4].occ = true;
        this.board["x" + 8 + "y" + 4].unit = temp;
        var temp = new Unit("King");
        temp.team = "notBlacks";
        temp.pos = { x: 5, y: 8 };
        temp.getDomObj().className = "notBlacks king";
        this.notBlacks.push(temp);
        this.board["x" + 8 + "y" + 5].obj.appendChild(temp.getDomObj());
        this.board["x" + 8 + "y" + 5].occ = true;
        this.board["x" + 8 + "y" + 5].unit = temp;
        var temp = new Unit("Bishop");
        temp.team = "notBlacks";
        temp.pos = { x: 6, y: 8 };
        temp.getDomObj().className = "notBlacks bishop";
        this.notBlacks.push(temp);
        this.board["x" + 8 + "y" + 6].obj.appendChild(temp.getDomObj());
        this.board["x" + 8 + "y" + 6].occ = true;
        this.board["x" + 8 + "y" + 6].unit = temp;
        var temp = new Unit("Knight");
        temp.team = "notBlacks";
        temp.pos = { x: 7, y: 8 };
        temp.getDomObj().className = "notBlacks knight";
        this.notBlacks.push(temp);
        this.board["x" + 8 + "y" + 7].obj.appendChild(temp.getDomObj());
        this.board["x" + 8 + "y" + 7].occ = true;
        this.board["x" + 8 + "y" + 7].unit = temp;
        var temp = new Unit("Rook");
        temp.team = "notBlacks";
        temp.pos = { x: 8, y: 8 };
        temp.getDomObj().className = "notBlacks rook";
        this.notBlacks.push(temp);
        this.board["x" + 8 + "y" + 8].obj.appendChild(temp.getDomObj());
        this.board["x" + 8 + "y" + 8].occ = true;
        this.board["x" + 8 + "y" + 8].unit = temp;
        for (var i = 1; i <= 8; i++) {
            var temp = new Unit("Pawn");
            temp.team = "notBlacks";
            temp.pos = { x: i, y: 7 };
            temp.getDomObj().className = "notBlacks pawn";
            this.notBlacks.push(temp);
            this.board["x" + 7 + "y" + i].obj.appendChild(temp.getDomObj());
            this.board["x" + 7 + "y" + i].occ = true;
            this.board["x" + 7 + "y" + i].unit = temp;
        }
    }
};

var Unit = function(type) {
    var _this = this;
    this.domObj = null;
    this.type = type;
    this.pos = {};
    this.team = "";
    this.dead = false;
    this.moves = 0;
    this.kills = 0;
    this.movement = "_this." + type + "Movement()";
    var nDiv = document.createElement("div");
    nDiv.addEventListener("click", function() {
        if (p.round == _this.team && !_this.dead) {
            document.dispatchEvent(new CustomEvent("locations", { "detail": eval(_this.movement) }));
            document.dispatchEvent(new CustomEvent("thisIsMe", { "detail": _this }));
        }
    });
    this.domObj = nDiv;
};

Unit.prototype = {
    getDomObj: function() {
        return this.domObj;
    },
    PawnMovement: function() {
        var m = [],
            t1 = [],
            t2 = [];
        if (this.team == "blacks") {
            if (this.pos.y + 1 <= 8) {
                m = this.moves == 0 ? [{ x: this.pos.y + 1, y: this.pos.x }, {
                    x: this.pos.y + 2,
                    y: this.pos.x
                }] : [{ x: this.pos.y + 1, y: this.pos.x }];
            }
            if (this.pos.x + 1 <= 8 && this.pos.y + 1 <= 8) {
                t1.push({ x: this.pos.y + 1, y: this.pos.x + 1 })
            }
            if (this.pos.x - 1 > 0 && this.pos.y + 1 <= 8) {
                t2.push({ x: this.pos.y + 1, y: this.pos.x - 1 })
            }
        } else {
            if (this.pos.y - 1 > 0) {
                m = this.moves == 0 ? [{ x: this.pos.y - 1, y: this.pos.x }, {
                    x: this.pos.y - 2,
                    y: this.pos.x
                }] : [{ x: this.pos.y - 1, y: this.pos.x }];
            }
            if (this.pos.x + 1 <= 8 && this.pos.y - 1 > 0) {
                t1.push({ x: this.pos.y - 1, y: this.pos.x + 1 })
            }
            if (this.pos.x - 1 > 0 && this.pos.y - 1 > 0) {
                t2.push({ x: this.pos.y - 1, y: this.pos.x - 1 })
            }
        }
        return [m, t1, t2]
    },
    RookMovement: function() {
        var s = [],
            e = [],
            w = [],
            n = [];
        for (var i = 1; i < 8; i++) {
            if (this.pos.y + i <= 8) {
                s.push({ x: this.pos.y + i, y: this.pos.x })
            }
            if (this.pos.x + i <= 8) {
                e.push({ x: this.pos.y, y: this.pos.x + i })
            }
            if (this.pos.x - i > 0) {
                w.push({ x: this.pos.y, y: this.pos.x - i })
            }
            if (this.pos.y - i > 0) {
                n.push({ x: this.pos.y - i, y: this.pos.x })
            }
        }
        return [s, e, w, n];
    },
    KnightMovement: function() {
        var temp = [];
        if (this.pos.x + 2 <= 8 && this.pos.y + 1 <= 8 && this.pos.x + 2 > 0 && this.pos.y + 1 > 0) {
            temp.push({ x: this.pos.y + 1, y: this.pos.x + 2 })
        }
        if (this.pos.x + 2 <= 8 && this.pos.y - 1 <= 8 && this.pos.x + 2 > 0 && this.pos.y - 1 > 0) {
            temp.push({ x: this.pos.y - 1, y: this.pos.x + 2 })
        }
        if (this.pos.x - 2 <= 8 && this.pos.y + 1 <= 8 && this.pos.x - 2 > 0 && this.pos.y + 1 > 0) {
            temp.push({ x: this.pos.y + 1, y: this.pos.x - 2 })
        }
        if (this.pos.x - 2 <= 8 && this.pos.y - 1 <= 8 && this.pos.x - 2 > 0 && this.pos.y - 1 > 0) {
            temp.push({ x: this.pos.y - 1, y: this.pos.x - 2 })
        }
        if (this.pos.y + 2 <= 8 && this.pos.x + 1 <= 8 && this.pos.y + 2 > 0 && this.pos.x + 1 > 0) {
            temp.push({ y: this.pos.x + 1, x: this.pos.y + 2 })
        }
        if (this.pos.y + 2 <= 8 && this.pos.x - 1 <= 8 && this.pos.y + 2 > 0 && this.pos.x - 1 > 0) {
            temp.push({ y: this.pos.x - 1, x: this.pos.y + 2 })
        }
        if (this.pos.y - 2 <= 8 && this.pos.x + 1 <= 8 && this.pos.y - 2 > 0 && this.pos.x + 1 > 0) {
            temp.push({ y: this.pos.x + 1, x: this.pos.y - 2 })
        }
        if (this.pos.y - 2 <= 8 && this.pos.x - 1 <= 8 && this.pos.y - 2 > 0 && this.pos.x - 1 > 0) {
            temp.push({ y: this.pos.x - 1, x: this.pos.y - 2 })
        }
        return [temp];
    },
    BishopMovement: function() {
        var se = [],
            ne = [],
            sw = [],
            nw = [];
        for (var i = 1; i < 8; i++) {
            if (this.pos.x + i <= 8 && this.pos.y + i <= 8) {
                se.push({ x: this.pos.y + i, y: this.pos.x + i })
            }
            if (this.pos.x + i <= 8 && this.pos.y - i > 0) {
                ne.push({ x: this.pos.y - i, y: this.pos.x + i })
            }
            if (this.pos.x - i > 0 && this.pos.y + i <= 8) {
                sw.push({ x: this.pos.y + i, y: this.pos.x - i })
            }
            if (this.pos.x - i > 0 && this.pos.y - i > 0) {
                nw.push({ x: this.pos.y - i, y: this.pos.x - i })
            }
        }
        return [se, ne, sw, nw];
    },
    QueenMovement: function() {
        var s = [],
            e = [],
            w = [],
            n = [],
            se = [],
            ne = [],
            sw = [],
            nw = [];
        for (var i = 1; i < 8; i++) {
            if (this.pos.y + i <= 8) {
                s.push({ x: this.pos.y + i, y: this.pos.x })
            }
            if (this.pos.x + i <= 8) {
                e.push({ x: this.pos.y, y: this.pos.x + i })
            }
            if (this.pos.x - i > 0) {
                w.push({ x: this.pos.y, y: this.pos.x - i })
            }
            if (this.pos.y - i > 0) {
                n.push({ x: this.pos.y - i, y: this.pos.x })
            }
            if (this.pos.x + i <= 8 && this.pos.y + i <= 8) {
                se.push({ x: this.pos.y + i, y: this.pos.x + i })
            }
            if (this.pos.x + i <= 8 && this.pos.y - i > 0) {
                ne.push({ x: this.pos.y - i, y: this.pos.x + i })
            }
            if (this.pos.x - i > 0 && this.pos.y + i <= 8) {
                sw.push({ x: this.pos.y + i, y: this.pos.x - i })
            }
            if (this.pos.x - i > 0 && this.pos.y - i > 0) {
                nw.push({ x: this.pos.y - i, y: this.pos.x - i })
            }
        }
        return [s, e, w, n, se, ne, sw, nw];
    },
    KingMovement: function() {
        var s = [],
            e = [],
            w = [],
            n = [],
            se = [],
            ne = [],
            sw = [],
            nw = [];
        if (this.pos.x + 1 <= 8) {
            e.push({ x: this.pos.y, y: this.pos.x + 1 })
        }
        if (this.pos.y - 1 > 0) {
            n.push({ x: this.pos.y - 1, y: this.pos.x })
        }
        if (this.pos.y + 1 <= 8) {
            s.push({ x: this.pos.y + 1, y: this.pos.x })
        }
        if (this.pos.x - 1 > 0) {
            w.push({ x: this.pos.y, y: this.pos.x - 1 })
        }
        if (this.pos.x + 1 <= 8 && this.pos.y + 1 <= 8) {
            se.push({ x: this.pos.y + 1, y: this.pos.x + 1 })
        }
        if (this.pos.x + 1 <= 8 && this.pos.y - 1 > 0) {
            ne.push({ x: this.pos.y - 1, y: this.pos.x + 1 })
        }
        if (this.pos.x - 1 > 0 && this.pos.y + 1 <= 8) {
            sw.push({ x: this.pos.y + 1, y: this.pos.x - 1 })
        }
        if (this.pos.x - 1 > 0 && this.pos.y - 1 > 0) {
            nw.push({ x: this.pos.y - 1, y: this.pos.x - 1 })
        }
        return [s, e, w, n, se, ne, sw, nw];
    }
};