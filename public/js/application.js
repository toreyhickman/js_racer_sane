function Game() {
  this.winner_id = null;
  this.game_duration = null;
}

Game.prototype.playerIds = function() {
  playerIds = []
  players = $('ol')
  players.each(function() {
    playerIds.push( $(this).attr('id') );
  });

  return playerIds;
}

Game.prototype.onKeyUp = function(activePlayer){
  game.advancePlayer(activePlayer);
  if (game.checkForWinner(activePlayer) == true)
  {
    game.endGame();
    game.recordResult(activePlayer);
    game.saveResult();
    game.displayResult(activePlayer);
    game.playAgain();
  }
}

Game.prototype.advancePlayer = function(player) {
  $("." + player + " li.active").removeClass("active").next().addClass("active");
}

Game.prototype.checkForWinner = function(player) {
  return $("." + player + " li:last-child").hasClass("active")
}

Game.prototype.endGame = function() {
  endTime = new Date().getTime();
  $(document).off('keyup');
}

Game.prototype.recordResult = function (winner_id) {
  winner_id = $("." + winner_id).parent().attr("class")
  game.winner_id = winner_id;
  game.game_duration = ((endTime - startTime) / 1000).toFixed(2);
}

Game.prototype.displayResult = function(player_id) {
  winner_name = $("." + player_id).prev().children('h4').first().html();
  $("#notify_winner").html(winner_name + " wins with a time of " + game.game_duration + " seconds!")
}

Game.prototype.saveResult = function () {
  var params = { game_duration: game.game_duration,
                 winner_id: game.winner_id,
                 player_ids: game.playerIds() };
  console.log(params);
  $.post("/game_over", params);
}

Game.prototype.playAgain = function() {
  $(".reset").removeClass("hidden");
}



var startTime
var endTime
var game = new Game();



$(document).ready(function() {

  $('#begin_race p').on('click', function() {
    $('#blocker').addClass("hidden");
    $('#begin_race').addClass("hidden");
    startTime = new Date().getTime();
  });

  $(document).on('keyup', function(event) {
    if ( $('#begin_race').hasClass("hidden") )
    {
      game.onKeyUp(event.which);
    }
  });

  $(".reset").on('click', function() {
    var playersToPost = {}
    var playerH4s = $("h4");
    playerH4s.each(function(index){
      playersToPost[index] = $(this).html();
    });
    window.location.replace("/");
  });
});