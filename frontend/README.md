# chess-frontend

This project is deployed on [Heroku](https://chess-frontend-jh.herokuapp.com/)

## Latest Progress
In this iteration I focused on making the pieces move, changing the board orientation and picking the promotion piece. 
I have also added a config page that lets a user pick which game they want to play. A logged in user can see an online game type (although not implemented yet) and not logged in users can play against the computer that makes random moves and 2-player (local) when two people are at the same computer / iPad.
Currently refreshing the page will lose progress because I am still in the process of making the games presist in the back end.

## todos
- [x] make new google api key
- [x] see how is castling and promotion handled
- [ ] add license saying that this is for educational purposes
- [ ] acknowledge the [chess library](https://github.com/jhlywa/chess.js/) 
- [ ] should I animate the moves ? might need to change from svg <image> to <img> and use relative position ? figure out how to do smooth transition between states (piece movements)
- [ ] see why setOrientation is not working in set squares called when changing windows and coming back
- [ ] consider adding modes to gameplay. for example one machine two players would ask two people for logins and would display the game in their orientation (will be cool to play on the ipad and then see your blunders).
- [ ] see if i can add a login with chess.com
- [ ] see how to fit svg to screen and abstract the hard coded dimensions

### Author
Yevhen Horban