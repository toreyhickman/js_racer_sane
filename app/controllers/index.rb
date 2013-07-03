get '/' do
  # Look in app/views/index.erb
  erb :index
end

post '/enter_race' do
  @players = []

  params[:players].each do |player, player_name|
    @players << Player.find_or_create_by_player_name(player_name)
  end

  @players.each do |player|
    erb :index if player.errors.any? 
  end
    
  erb :race
end

post '/game_over' do 
  @game = Game.create( { :player_ids => params[:player_ids],
                         :winner_id => params[:winner_id],
                         :game_duration => params[:game_duration].to_f } ) 
  200
end
