Known bugs:
- Chess engine is slow: possible replacement:
    - //https://github.com/josefjadrny/js-chess-engine <-- Replacement chess engine, possibly faster
    - // https://github.com/haensl/js-profiler <--- for profiling to find out
- the way I have use effects set up to fetch data causes several rerenders, with several extra api calls
  - some improvement made, could likely be better still
- security issues form packages
- fetching duplicate data with all chalenges/ my challenges
- edit name tooltip appears below, get cut off

- todo
  - add win counter to bots in DB so it can display on challengers page
  - autosave
  - add caching to server
  - script to schedule / run tournaments
  - make scrollbars less bad looking
  - actually integrate the login w/
  - allow challenging more than 1 bot at once (while one is pending)
  - allow right click actions on buttons, such as duplicate, delete, rename

  - API documentation

