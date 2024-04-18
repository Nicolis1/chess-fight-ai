Known bugs:
- Chess engine is slow: possible replacement:
    - //https://github.com/josefjadrny/js-chess-engine <-- Replacement chess engine, possibly faster
    - // https://github.com/haensl/js-profiler <--- for profiling to find out
- the way I have use effects set up to fetch data causes several rerenders, with several extra api calls
  - fixed in compete page, todo in editor and topnav
- security issues form packages
- fetching duplicate data with all chalenges/ my challenges
- error handling for failed login

- todo
  - do your recent matches ui
    - this needs to include a better way to visualize all game results
    - add this to editor page as well
  - add win counter to bots in DB so it can display on challengers page
  - autosave
  - delete bots
  - delete account
  - add caching to server
  - script to schedule / run tournaments
  - make scrollbars less bad looking
  - actually integrate the login w/
  - allow challenging more than 1 bot at once (while one is pending)
  - better style bot selection modal
  - disallow entering the same tournament with more than 1 bot
  - disallow private bots from joining tournament

