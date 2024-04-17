Known bugs:
- Chess engine is slow: possible replacement:
    - //https://github.com/josefjadrny/js-chess-engine <-- Replacement chess engine, possibly faster
    - // https://github.com/haensl/js-profiler <--- for profiling to find out
- long bot titles fail in side nav
- lots of challengers breaks scrolling on compete page
- view code in bot selection modal should have special hover behavior
- the way I have use effects set up to fetch data causes several rerenders, with several extra api calls
- security issues form packages
- edit pencil no longer appears when hovering title on editor page
- state does not refresh upon a new challenge result finishing (add loading state to challenge request)

- todo
  - better style bot selection modal
  - finish challengers ui
  - do your recent matched ui
    - this needs to include a better way to visualize all game results
    - add this to editor page as well
  - do all recent mathes ui
  - bot code visualization modal (for view code buttons)
  - add win counter to bots in DB so it can display on challengers page
  - autosave
  - delete bots
  - delete account
  - add caching to server
  - script to schedule / run tournaments
  - active page selector for topnav
  - make scrollbars less bad looking
  - actually integrate the login w/
  
