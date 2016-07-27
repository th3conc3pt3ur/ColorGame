function colorGame() {
    this.sequence = [];
    this.copy = [];
    this.round = 1;
    this.active = true;
    this.x = null;
    this.cpt = 3;
}
colorGame.prototype.lightUp = function(tile) {
    var tile = $('[data-tile=' + tile + ']').addClass('lit');
    window.setTimeout(function() {
        tile.removeClass('lit');
    }, 300);
};

colorGame.prototype.randNumber = function() {
    var randNumber = this.sequence[this.sequence.length-1];
    while(randNumber == this.sequence[this.sequence.length-1]) {
        randNumber = Math.floor((Math.random() * 6) + 1);
    }
    return randNumber;
};
colorGame.prototype.animated = function() {
    var _this = this;
    if(this.sequence.length > 0) {
        var monThis = this;
        var i = 0;
        var interval = setInterval(function() {
            monThis.lightUp(monThis.sequence[i]);
            i++;
            if (i >= monThis.sequence.length) {
                clearInterval(interval);
                monThis.activateBoard();
            }
        }, 700);
    }
};

colorGame.prototype.startGame = function(tile) {
    this.sequence = [];
    this.copy = [];
    this.round = 0;
    this.active = true;
    if($('.list-color').is(':hidden')){
        $('.list-color').show();
    }
    $('#gameover').html('');
    $('.btnStart').hide();
    $('.message').html('Regardez bien...');
    this.newRound();
};

colorGame.prototype.registerClick = function(e) {
    this.lightUp($(e.target).data('tile'));
    var desiredResponse = this.copy.shift();
    var actualResponse = $(e.target).data('tile');
    this.active = (desiredResponse === actualResponse);
    this.checkLose();
};

colorGame.prototype.checkLose = function() {
    var monThis = this;
    if(this.copy.length === 0 && this.active) {
        this.desactivateBoard();
        setTimeout(function() { monThis.newRound();},1000);
    } else if(!this.active) {
        this.desactivateBoard();
        this.endGame();
    }
};

colorGame.prototype.endGame = function() {
    $('#round').text('0');
    $('.message').html("Oops...");
    $('.list-color').hide();
    $('#gameover').html("<a onClick='colorGame.startGame();'><img src='assets/loose.png')}}' alt='C\'est perdu ! REJOUER'></a>");
    this.sequence = [];
    this.round = 0;
    this.copy = [];
    this.active = true;
};

colorGame.prototype.desactivateBoard = function(score) {
    $('.list-color li').off('click','img[data-tile]')
    .off('mouvedown','img[data-tile]')
    .off('mouseup','img[data-tile]');
    $('img[data-tile]').removeClass('hoverable');
    if (score == 10) {
        $('.message').html("BRAVO !");
    } else {
        $('.message').html("Regardez bien...");
    }
};

colorGame.prototype.activateBoard = function() {
    var monThis = this;
    $('.list-color li').on('click','img[data-tile]',function(e) {
        monThis.registerClick(e);
    })
    .on('mouvedown','img[data-tile]',function() {
        $(this).addClass('active');

        monThis.playSound($(this).data('tile'));
    })
    .on('mouseup','img[data-tile]',function() {
        $(this).removeClass('active');
    });
    $('img[data-tile]').addClass('hoverable');
    setTimeout(function() {
        $('.message').html("C'est à vous !")
    }, 500);
};

colorGame.prototype.newRound = function() {
    var _this = this;
    $('#round').text(_this.round++);
    if($('#round').text() == 10) {
        $('.list-color').hide();
        $('#gameover').html("<img src='{{ asset('bundles/acseofront/assets/win.png')}}' alt='C\'est gagné ! +70°'>");
        $.ajax({
            type        : 'GET',
            url         : "",
            success     : function(data) {
                if(data != "ok") {
                    alert('Une erreur est survenue lors de la validation du jeu');
                }
            }
        });
        this.desactivateBoard($('#round').text());

        this.active = false;
    } else {
        var numberRandom = this.randNumber();
        this.sequence.push(numberRandom);
        this.copy = _this.sequence.slice(0);
        this.animated(_this.sequence);
    }
};

colorGame.prototype.preload = function(arrayOfImages) {
     $(arrayOfImages).each(function(){
        $('<img/>')[0].src = this;
    });
};

colorGame.prototype.decompte = function() {
    if(this.cpt>=0)
    {
        if(this.cpt==3) {
            $(".chrono").html("<img src='assets/chrono/3.png' alt='Vous êtes prêt(e)? 3...'>")
        }
        if(this.cpt==2) {
            $(".chrono").html("<img src='assets/chrono/2.png' alt='Vous êtes prêt(e)? 2...'>")
        }
        if(this.cpt==1) {
            $(".chrono").html("<img src='assets/chrono/1.png' alt='Vous êtes prêt(e)? 1...'>")
        }
        if(this.cpt==0) {
            $(".chrono").html("<img src='assets/chrono/go.png' alt='Vous êtes prêt(e)? GO'>")
        }
        this.cpt-- ;
    }
    else
    {
        $(".chrono").hide();
        this.startGame();
        clearInterval(this.x) ;
    }
};

colorGame.prototype.init = function() {
    var monThis = this;
    this.preload([
        "assets/chrono/go.png",
        "assets/chrono/1.png",
        "assets/chrono/2.png",
        "assets/chrono/3.png"
        ]);
    this.x = setInterval(function() { return monThis.decompte()}, 1000);
};

