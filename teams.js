// NFL team config — logo matches assets/logos/nfl/, video matches assets/team_previews/
// Same basenames as the Full Throttle overlay. Order = board reading order (8x4).
const NFL_TEAMS = [
  { id:'ari', abbr:'ARI', name:'Cardinals',  city:'Arizona',      logo:'cardinals.png',  video:'cardinals.mp4',  color:'#97233F', accent:'#FFB612' },
  { id:'atl', abbr:'ATL', name:'Falcons',    city:'Atlanta',      logo:'falcons.png',    video:'falcons.mp4',    color:'#A71930', accent:'#A71930' },
  { id:'bal', abbr:'BAL', name:'Ravens',     city:'Baltimore',    logo:'ravens.png',     video:'ravens.mp4',     color:'#241773', accent:'#9E7C0C' },
  { id:'buf', abbr:'BUF', name:'Bills',      city:'Buffalo',      logo:'bills.png',      video:'bills.mp4',      color:'#00338D', accent:'#C60C30' },
  { id:'car', abbr:'CAR', name:'Panthers',   city:'Carolina',     logo:'panthers.png',   video:'panthers.mp4',   color:'#0085CA', accent:'#101820' },
  { id:'chi', abbr:'CHI', name:'Bears',      city:'Chicago',      logo:'bears.png',      video:'bears.mp4',      color:'#0B162A', accent:'#C83803' },
  { id:'cin', abbr:'CIN', name:'Bengals',    city:'Cincinnati',   logo:'bengals.png',    video:'bengals.mp4',    color:'#FB4F14', accent:'#FB4F14' },
  { id:'cle', abbr:'CLE', name:'Browns',     city:'Cleveland',    logo:'browns.png',     video:'browns.mp4',     color:'#311D00', accent:'#FF3C00' },
  { id:'dal', abbr:'DAL', name:'Cowboys',    city:'Dallas',       logo:'cowboys.png',    video:'cowboys.mp4',    color:'#003594', accent:'#869397' },
  { id:'den', abbr:'DEN', name:'Broncos',    city:'Denver',       logo:'broncos.png',    video:'broncos.mp4',    color:'#FB4F14', accent:'#002244' },
  { id:'det', abbr:'DET', name:'Lions',      city:'Detroit',      logo:'lions.png',      video:'lions.mp4',      color:'#0076B6', accent:'#B0B7BC' },
  { id:'gb',  abbr:'GB',  name:'Packers',    city:'Green Bay',    logo:'packers.png',    video:'packers.mp4',    color:'#203731', accent:'#FFB612' },
  { id:'hou', abbr:'HOU', name:'Texans',     city:'Houston',      logo:'texans.png',     video:'texans.mp4',     color:'#03202F', accent:'#A71930' },
  { id:'ind', abbr:'IND', name:'Colts',      city:'Indianapolis', logo:'colts.png',      video:'colts.mp4',      color:'#002C5F', accent:'#A2AAAD' },
  { id:'jax', abbr:'JAX', name:'Jaguars',    city:'Jacksonville', logo:'jaguars.png',    video:'jaguars.mp4',    color:'#101820', accent:'#D7A22A' },
  { id:'kc',  abbr:'KC',  name:'Chiefs',     city:'Kansas City',  logo:'chiefs.png',     video:'chiefs.mp4',     color:'#E31837', accent:'#FFB81C' },
  { id:'lv',  abbr:'LV',  name:'Raiders',    city:'Las Vegas',    logo:'raiders.png',    video:'raiders.mp4',    color:'#000000', accent:'#A5ACAF' },
  { id:'lac', abbr:'LAC', name:'Chargers',   city:'Los Angeles',  logo:'chargers.png',   video:'chargers.mp4',   color:'#0080C6', accent:'#FFC20E' },
  { id:'lar', abbr:'LAR', name:'Rams',       city:'Los Angeles',  logo:'rams.png',       video:'rams.mp4',       color:'#003594', accent:'#FFA300' },
  { id:'mia', abbr:'MIA', name:'Dolphins',   city:'Miami',        logo:'dolphins.png',   video:'dolphins.mp4',   color:'#008E97', accent:'#FC4C02' },
  { id:'min', abbr:'MIN', name:'Vikings',    city:'Minnesota',    logo:'vikings.png',    video:'vikings.mp4',    color:'#4F2683', accent:'#FFC62F' },
  { id:'ne',  abbr:'NE',  name:'Patriots',   city:'New England',  logo:'patriots.png',   video:'patriots.mp4',   color:'#002244', accent:'#C60C30' },
  { id:'no',  abbr:'NO',  name:'Saints',     city:'New Orleans',  logo:'saints.png',     video:'saints.mp4',     color:'#101820', accent:'#D3BC8D' },
  { id:'nyg', abbr:'NYG', name:'Giants',     city:'New York',     logo:'giants.png',     video:'giants.mp4',     color:'#0B2265', accent:'#A71930' },
  { id:'nyj', abbr:'NYJ', name:'Jets',       city:'New York',     logo:'jets.png',       video:'jets.mp4',       color:'#125740', accent:'#FFFFFF' },
  { id:'phi', abbr:'PHI', name:'Eagles',     city:'Philadelphia', logo:'eagles.png',     video:'eagles.mp4',     color:'#004C54', accent:'#A5ACAF' },
  { id:'pit', abbr:'PIT', name:'Steelers',   city:'Pittsburgh',   logo:'steelers.png',   video:'steelers.mp4',   color:'#FFB612', accent:'#101820' },
  { id:'sf',  abbr:'SF',  name:'49ers',      city:'San Francisco',logo:'49ers.png',      video:'49ers.mp4',      color:'#AA0000', accent:'#B3995D' },
  { id:'sea', abbr:'SEA', name:'Seahawks',   city:'Seattle',      logo:'seahawks.png',   video:'seahawks.mp4',   color:'#002244', accent:'#69BE28' },
  { id:'tb',  abbr:'TB',  name:'Buccaneers', city:'Tampa Bay',    logo:'buccaneers.png', video:'buccaneers.mp4', color:'#D50A0A', accent:'#FF7900' },
  { id:'ten', abbr:'TEN', name:'Titans',     city:'Tennessee',    logo:'titans.png',     video:'titans.mp4',     color:'#0C2340', accent:'#4B92DB' },
  { id:'was', abbr:'WAS', name:'Commanders', city:'Washington',   logo:'commanders.png', video:'commanders.mp4', color:'#5A1414', accent:'#FFB612' },
];

// === DROP YOUR YOUTUBE LINKS HERE ===
// Paste full watch URLs, short youtu.be URLs, or bare IDs — all work.
// Add or remove as many as you want; the carousel adapts automatically.
const YOUTUBE_VIDEOS = [
  "https://www.youtube.com/watch?v=AdDKudyShtY",
  "https://youtu.be/6KakZyf57fI?si=3u1cip_pNgFNibRj&t=14",
];

// === INSTRUMENTALS pool (files live in assets/instrumentals/) ===
// IMPORTANT: these filenames must EXACTLY match the .mp3 files you have in
// assets/instrumentals/. Open DevTools (F12) → Console after clicking a team
// to see warnings if a track can't be loaded. Random pick on each reveal.
const INSTRUMENTALS = [
  "2024.mp3", "5tint.mp3", "astrothunder.mp3", "bluenotes.mp3",
  "devilinanewdress.mp3", "didntchaknow.mp3", "eviljordan.mp3", "faneto.mp3",
  "letitgo.mp3", "location.mp3", "michigan.mp3", "needit.mp3", "nodate.mp3",
  "nomorepartiesinla.mp3", "orangesoda.mp3", "percocetandstripperjoint.mp3",
  "peso.mp3", "ronartest.mp3", "sakpase.mp3", "toxic.mp3",
  "transportin.mp3", "youngmetro.mp3",
];
