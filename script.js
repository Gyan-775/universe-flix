/* NAV HIDE */
let lastScroll = 0;
const nav = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  const current = window.scrollY;
  if (current > lastScroll && current > 100) nav.classList.add("hide");
  else nav.classList.remove("hide");
  lastScroll = current;
});

/* SEARCH */
function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9]/g, "");
}

const searchInput = document.getElementById("search");
const rows = Array.from(document.querySelectorAll(".row"));
const noResults = document.getElementById("no-results");

const rowTags = {
  "Jurassic Park / Jurassic World": ["action", "sci-fi", "adventure"],
  "The Conjuring Universe": ["horror"],
  "Insidious": ["horror"],
  "MonsterVerse": ["action", "sci-fi", "adventure"],
  "Wizarding World [Harry Potter]": ["fantasy", "adventure"],
  "Star Wars": ["sci-fi", "adventure", "action"],
  "Middle-earth (LOTR + Hobbit)": ["fantasy", "adventure"],
  "Mission: Impossible": ["action"],
  "James Bond": ["action"],
  "John Wick": ["action"],
  "The Matrix": ["sci-fi", "action"],
  "Mad Max": ["action", "adventure"],
  "Planet of the Apes (Reboot)": ["sci-fi", "action"],
  "Fast & Furious": ["action"],
  "Transformers": ["action", "sci-fi"],
  "Terminator": ["sci-fi", "action"],
  "Men in Black": ["sci-fi", "action"],
  "Pirates of the Caribbean": ["fantasy", "adventure"],
  "Indiana Jones": ["adventure", "action"],
  "Star Trek (Movies)": ["sci-fi", "adventure"],
  "Saw": ["horror"],
  "The Purge": ["horror"],
  "Paranormal Activity": ["horror"],
  "Resident Evil": ["horror", "action"],
  "Halloween": ["horror"],
  "Scream": ["horror"],
  "Final Destination": ["horror"],
  "Cloverfield": ["sci-fi", "horror"],
  "Toy Story": ["animation", "adventure"],
  "Shrek": ["animation", "fantasy"],
  "Ice Age": ["animation", "adventure"],
  "Kung Fu Panda": ["animation", "adventure"],
  "How to Train Your Dragon": ["animation", "fantasy", "adventure"],
  "Despicable Me / Minions": ["animation"],
  "The Hunger Games": ["sci-fi", "action"],
  "The Maze Runner": ["sci-fi", "action"],
  "Divergent": ["sci-fi", "action"],
  "Back to the Future": ["sci-fi", "adventure"],
  "Die Hard": ["action"],
  "Lethal Weapon": ["action"],
  "Rambo": ["action"],
  "The Godfather": ["action"],
  "Rocky / Creed": ["action"],
  "Ocean’s": ["action"],
  "Jaws": ["adventure", "horror"],
  "Avatar": ["sci-fi", "adventure"],
  "Alien": ["sci-fi", "horror"],
  "Predator": ["sci-fi", "action"],
  "Blade Runner": ["sci-fi"],
  "The Mummy": ["adventure", "fantasy"],
  "Ghostbusters": ["fantasy", "sci-fi"],
  "The Karate Kid": ["action"],
  "The Chronicles of Narnia": ["fantasy", "adventure"],
  "The Pink Panther": ["action"]
};

const rowData = rows.map(row => {
  const title = row.querySelector("h2");
  const cards = Array.from(row.querySelectorAll(".card"));
  const titleText = title ? title.textContent.trim() : "";
  return {
    row,
    titleNorm: normalize(titleText),
    tags: rowTags[titleText] || [],
    cards: cards.map(card => ({
      el: card,
      textNorm: normalize(card.textContent)
    }))
  };
});

const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
let activeFilter = "all";

function rowMatchesFilter(tags) {
  if (activeFilter === "all") return true;
  return tags.includes(activeFilter);
}

function setHidden(el, hidden) {
  if (!el) return;
  el.classList.toggle("is-hidden", hidden);
}

function applySearchAndFilters() {
  const query = normalize(searchInput ? searchInput.value : "");
  let visibleCount = 0;

  rowData.forEach(({ row, titleNorm, tags, cards }) => {
    if (!rowMatchesFilter(tags)) {
      setHidden(row, true);
      return;
    }

    // If the universe title matches (or query is empty), show the whole row.
    if (query === "" || titleNorm.includes(query)) {
      setHidden(row, false);
      cards.forEach(({ el }) => setHidden(el, false));
      visibleCount += cards.length;
      return;
    }

    let rowVisible = false;
    cards.forEach(({ el, textNorm }) => {
      const match = textNorm.includes(query);
      setHidden(el, !match);
      if (match) {
        rowVisible = true;
        visibleCount++;
      }
    });

    setHidden(row, !rowVisible);
  });

  setHidden(noResults, visibleCount !== 0);
}

let applyScheduled = false;
function scheduleApplySearchAndFilters() {
  if (applyScheduled) return;
  applyScheduled = true;
  requestAnimationFrame(() => {
    applyScheduled = false;
    applySearchAndFilters();
  });
}

if (searchInput) {
  searchInput.addEventListener("input", scheduleApplySearchAndFilters);
}

if (filterButtons.length) {
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      activeFilter = btn.dataset.filter || "all";
      filterButtons.forEach(b => b.classList.toggle("active", b === btn));
      scheduleApplySearchAndFilters();
    });
  });
}

// Ensure initial UI is consistent with the default filter/search state.
applySearchAndFilters();




/* MAGNETIC LIGHT */
const cards = Array.from(document.querySelectorAll(".card"));
cards.forEach(card => {
  card.addEventListener("mousemove", e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--x", `${(e.clientX-r.left)/r.width*100}%`);
    card.style.setProperty("--y", `${(e.clientY-r.top)/r.height*100}%`);
  });
});

/*BACKGROUND */
const canvas = document.getElementById("bg-canvas");
const ctx = canvas ? canvas.getContext("2d") : null;
let w = 0;
let h = 0;
let pts = [];

const prefersReducedMotion =
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function pointCountForViewport() {
  const area = innerWidth * innerHeight;
  // Roughly scales density while staying lightweight.
  return Math.max(70, Math.min(120, Math.round(area / 18000)));
}

function initPoints() {
  pts = Array.from({ length: pointCountForViewport() }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6
  }));
}

function resize(){
  if (!canvas) return;
  w = canvas.width = innerWidth;
  h = canvas.height = innerHeight;
  initPoints();
}
window.addEventListener("resize",resize);
resize();

let bgRaf = null;
let bgRunning = false;

function loop() {
  if (!bgRunning || !ctx) return;
  ctx.clearRect(0,0,w,h);
  pts.forEach((p,i)=>{
    p.x+=p.vx; p.y+=p.vy;
    if(p.x<0||p.x>w) p.vx*=-1;
    if(p.y<0||p.y>h) p.vy*=-1;
    ctx.fillStyle="rgba(90,120,255,.9)";
    ctx.fillRect(p.x,p.y,1.6,1.6);
    for(let j=i+1;j<pts.length;j++){
      const q=pts[j];
      const d=Math.hypot(p.x-q.x,p.y-q.y);
      if(d<140){
        ctx.strokeStyle=`rgba(90,120,255,${1-d/140})`;
        ctx.lineWidth=.4;
        ctx.beginPath();
        ctx.moveTo(p.x,p.y);
        ctx.lineTo(q.x,q.y);
        ctx.stroke();
      }
    }
  });
  bgRaf = requestAnimationFrame(loop);
}

function startBackground() {
  if (prefersReducedMotion || !ctx) return;
  if (bgRunning) return;
  bgRunning = true;
  bgRaf = requestAnimationFrame(loop);
}

function stopBackground() {
  bgRunning = false;
  if (bgRaf !== null) {
    cancelAnimationFrame(bgRaf);
    bgRaf = null;
  }
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopBackground();
  else startBackground();
});

startBackground();
// MICRO GLITCH (CYBERPUNK FEEL)
cards.forEach(card => {
  card.addEventListener("mouseenter", () => {
    card.style.animation = "glitch .18s linear";
    setTimeout(() => card.style.animation = "", 180);
  });
});


const imdbLinks = {
  "Jurassic Park (1993)": "https://www.imdb.com/title/tt0107290/",
  "The Lost World (1997)": "https://www.imdb.com/title/tt0119567/",
  "Jurassic Park III (2001)": "https://www.imdb.com/title/tt0163025/",
  "Jurassic World (2015)": "https://www.imdb.com/title/tt0369610/",
  "Fallen Kingdom (2018)": "https://www.imdb.com/title/tt4881806/",
  "Dominion (2022)": "https://www.imdb.com/title/tt8041270/",

  "The Conjuring (2013)": "https://www.imdb.com/title/tt1457767/",
  "Annabelle (2014)": "https://www.imdb.com/title/tt3322940/",
  "The Conjuring 2 (2016)": "https://www.imdb.com/title/tt3065204/",
  "Annabelle: Creation (2017)": "https://www.imdb.com/title/tt5140878/",
  "The Nun (2018)": "https://www.imdb.com/title/tt5814060/",
  "The Curse of La Llorona (2019)": "https://www.imdb.com/title/tt7784604/",
  "Annabelle Comes Home (2019)": "https://www.imdb.com/title/tt8350360/",
  "The Devil Made Me Do It (2021)": "https://www.imdb.com/title/tt7069210/",
  "The Nun II (2023)": "https://www.imdb.com/title/tt10160976/",

  "Insidious (2010)": "https://www.imdb.com/title/tt1591095/",
  "Chapter 2 (2013)": "https://www.imdb.com/title/tt2226417/",
  "Chapter 3 (2015)": "https://www.imdb.com/title/tt3195644/",
  "The Last Key (2018)": "https://www.imdb.com/title/tt5726086/",
  "The Red Door (2023)": "https://www.imdb.com/title/tt13405778/"
};
const imdbLinks2 = {
  "Godzilla (2014)": "https://www.imdb.com/title/tt0831387/",
  "Kong: Skull Island (2017)": "https://www.imdb.com/title/tt3731562/",
  "King of the Monsters (2019)": "https://www.imdb.com/title/tt3741700/",
  "Godzilla vs Kong (2021)": "https://www.imdb.com/title/tt5034838/",
  "The New Empire (2024)": "https://www.imdb.com/title/tt14539740/",

  "Sorcerer’s Stone (2001)": "https://www.imdb.com/title/tt0241527/",
  "Chamber of Secrets (2002)": "https://www.imdb.com/title/tt0295297/",
  "Prisoner of Azkaban (2004)": "https://www.imdb.com/title/tt0304141/",
  "Goblet of Fire (2005)": "https://www.imdb.com/title/tt0330373/",
  "Order of the Phoenix (2007)": "https://www.imdb.com/title/tt0373889/",
  "Half-Blood Prince (2009)": "https://www.imdb.com/title/tt0417741/",
  "Deathly Hallows – Part 1 (2010)": "https://www.imdb.com/title/tt0926084/",
  "Deathly Hallows – Part 2 (2011)": "https://www.imdb.com/title/tt1201607/",
  "Fantastic Beasts (2016)": "https://www.imdb.com/title/tt3183660/",
  "Crimes of Grindelwald (2018)": "https://www.imdb.com/title/tt4123430/",
  "Secrets of Dumbledore (2022)": "https://www.imdb.com/title/tt4123432/",

  "A New Hope (1977)": "https://www.imdb.com/title/tt0076759/",
  "The Empire Strikes Back (1980)": "https://www.imdb.com/title/tt0080684/",
  "Return of the Jedi (1983)": "https://www.imdb.com/title/tt0086190/",
  "The Phantom Menace (1999)": "https://www.imdb.com/title/tt0120915/"
};
const imdbLinks3 = {
  "Attack of the Clones (2002)": "https://www.imdb.com/title/tt0121765/",
  "Revenge of the Sith (2005)": "https://www.imdb.com/title/tt0121766/",
  "The Force Awakens (2015)": "https://www.imdb.com/title/tt2488496/",
  "Rogue One (2016)": "https://www.imdb.com/title/tt3748528/",
  "The Last Jedi (2017)": "https://www.imdb.com/title/tt2527338/",
  "Solo (2018)": "https://www.imdb.com/title/tt3778644/",
  "The Rise of Skywalker (2019)": "https://www.imdb.com/title/tt2527336/",

  "The Fellowship of the Ring (2001)": "https://www.imdb.com/title/tt0120737/",
  "The Two Towers (2002)": "https://www.imdb.com/title/tt0167261/",
  "The Return of the King (2003)": "https://www.imdb.com/title/tt0167260/",
  "An Unexpected Journey (2012)": "https://www.imdb.com/title/tt0903624/",
  "The Desolation of Smaug (2013)": "https://www.imdb.com/title/tt1170358/",
  "The Battle of the Five Armies (2014)": "https://www.imdb.com/title/tt2310332/",

  "Mission: Impossible (1996)": "https://www.imdb.com/title/tt0117060/",
  "Mission: Impossible II (2000)": "https://www.imdb.com/title/tt0120755/",
  "Mission: Impossible III (2006)": "https://www.imdb.com/title/tt0317919/",
  "Ghost Protocol (2011)": "https://www.imdb.com/title/tt1229238/",
  "Rogue Nation (2015)": "https://www.imdb.com/title/tt2381249/",
  "Fallout (2018)": "https://www.imdb.com/title/tt4912910/"
};
const imdbLinks4 = {
  "Dead Reckoning – Part One (2023)": "https://www.imdb.com/title/tt9603212/",

  "Dr. No (1962)": "https://www.imdb.com/title/tt0055928/",
  "Goldfinger (1964)": "https://www.imdb.com/title/tt0058150/",
  "Thunderball (1965)": "https://www.imdb.com/title/tt0059800/",
  "The Spy Who Loved Me (1977)": "https://www.imdb.com/title/tt0076752/",
  "GoldenEye (1995)": "https://www.imdb.com/title/tt0113189/",
  "Casino Royale (2006)": "https://www.imdb.com/title/tt0381061/",
  "Quantum of Solace (2008)": "https://www.imdb.com/title/tt0830515/",
  "Skyfall (2012)": "https://www.imdb.com/title/tt1074638/",
  "Spectre (2015)": "https://www.imdb.com/title/tt2379713/",
  "No Time to Die (2021)": "https://www.imdb.com/title/tt2382320/",

  "John Wick (2014)": "https://www.imdb.com/title/tt2911666/",
  "Chapter 2 (2017)": "https://www.imdb.com/title/tt4425200/",
  "Chapter 3 – Parabellum (2019)": "https://www.imdb.com/title/tt6146586/",
  "Chapter 4 (2023)": "https://www.imdb.com/title/tt10366206/",

  "The Matrix (1999)": "https://www.imdb.com/title/tt0133093/",
  "The Matrix Reloaded (2003)": "https://www.imdb.com/title/tt0234215/",
  "The Matrix Revolutions (2003)": "https://www.imdb.com/title/tt0242653/",
  "The Matrix Resurrections (2021)": "https://www.imdb.com/title/tt10838180/"
};
const imdbLinks5 = {
  "Mad Max (1979)": "https://www.imdb.com/title/tt0079501/",
  "The Road Warrior (1981)": "https://www.imdb.com/title/tt0082694/",
  "Beyond Thunderdome (1985)": "https://www.imdb.com/title/tt0089530/",
  "Fury Road (2015)": "https://www.imdb.com/title/tt1392190/",
  "Furiosa (2024)": "https://www.imdb.com/title/tt12037194/",

  "Rise of the Planet of the Apes (2011)": "https://www.imdb.com/title/tt1318514/",
  "Dawn of the Planet of the Apes (2014)": "https://www.imdb.com/title/tt2103281/",
  "War for the Planet of the Apes (2017)": "https://www.imdb.com/title/tt3450958/",
  "Kingdom of the Planet of the Apes (2024)": "https://www.imdb.com/title/tt11389872/",

  "The Fast and the Furious (2001)": "https://www.imdb.com/title/tt0232500/",
  "2 Fast 2 Furious (2003)": "https://www.imdb.com/title/tt0322259/",
  "Tokyo Drift (2006)": "https://www.imdb.com/title/tt0463985/",
  "Fast & Furious (2009)": "https://www.imdb.com/title/tt1013752/",
  "Fast Five (2011)": "https://www.imdb.com/title/tt1596343/",
  "Fast & Furious 6 (2013)": "https://www.imdb.com/title/tt1905041/",
  "Furious 7 (2015)": "https://www.imdb.com/title/tt2820852/",
  "The Fate of the Furious (2017)": "https://www.imdb.com/title/tt4630562/",
  "Hobbs & Shaw (2019)": "https://www.imdb.com/title/tt6806448/",
  "F9 (2021)": "https://www.imdb.com/title/tt5433138/",
  "Fast X (2023)": "https://www.imdb.com/title/tt5433140/"
};
const imdbLinks6 = {
  "Transformers (2007)": "https://www.imdb.com/title/tt0418279/",
  "Revenge of the Fallen (2009)": "https://www.imdb.com/title/tt1055369/",
  "Dark of the Moon (2011)": "https://www.imdb.com/title/tt1399103/",
  "Age of Extinction (2014)": "https://www.imdb.com/title/tt2109248/",
  "The Last Knight (2017)": "https://www.imdb.com/title/tt3371366/",
  "Bumblebee (2018)": "https://www.imdb.com/title/tt4701182/",
  "Rise of the Beasts (2023)": "https://www.imdb.com/title/tt5090568/",

  "The Terminator (1984)": "https://www.imdb.com/title/tt0088247/",
  "Judgment Day (1991)": "https://www.imdb.com/title/tt0103064/",
  "Rise of the Machines (2003)": "https://www.imdb.com/title/tt0181852/",
  "Salvation (2009)": "https://www.imdb.com/title/tt0438488/",
  "Genisys (2015)": "https://www.imdb.com/title/tt1340138/",
  "Dark Fate (2019)": "https://www.imdb.com/title/tt6450804/",

  "Men in Black (1997)": "https://www.imdb.com/title/tt0119654/",
  "Men in Black II (2002)": "https://www.imdb.com/title/tt0120912/",
  "Men in Black 3 (2012)": "https://www.imdb.com/title/tt1409024/",
  "Men in Black: International (2019)": "https://www.imdb.com/title/tt2283336/",

  "The Curse of the Black Pearl (2003)": "https://www.imdb.com/title/tt0325980/",
  "Dead Man’s Chest (2006)": "https://www.imdb.com/title/tt0383574/",
  "At World’s End (2007)": "https://www.imdb.com/title/tt0449088/"
};
const imdbLinks7 = {
  "On Stranger Tides (2011)": "https://www.imdb.com/title/tt1298650/",
  "Dead Men Tell No Tales (2017)": "https://www.imdb.com/title/tt1790809/",

  "Raiders of the Lost Ark (1981)": "https://www.imdb.com/title/tt0082971/",
  "Temple of Doom (1984)": "https://www.imdb.com/title/tt0087469/",
  "The Last Crusade (1989)": "https://www.imdb.com/title/tt0097576/",
  "Kingdom of the Crystal Skull (2008)": "https://www.imdb.com/title/tt0367882/",
  "Dial of Destiny (2023)": "https://www.imdb.com/title/tt1462764/",

  "Star Trek: The Motion Picture (1979)": "https://www.imdb.com/title/tt0079945/",
  "The Wrath of Khan (1982)": "https://www.imdb.com/title/tt0084726/",
  "The Search for Spock (1984)": "https://www.imdb.com/title/tt0088170/",
  "The Voyage Home (1986)": "https://www.imdb.com/title/tt0092007/",
  "The Final Frontier (1989)": "https://www.imdb.com/title/tt0098382/",
  "The Undiscovered Country (1991)": "https://www.imdb.com/title/tt0102975/",
  "Star Trek (2009)": "https://www.imdb.com/title/tt0796366/",
  "Into Darkness (2013)": "https://www.imdb.com/title/tt1408101/",
  "Beyond (2016)": "https://www.imdb.com/title/tt2660888/",

  "Saw (2004)": "https://www.imdb.com/title/tt0387564/",
  "Saw II (2005)": "https://www.imdb.com/title/tt0432348/",
  "Saw III (2006)": "https://www.imdb.com/title/tt0489270/",
  "Saw IV (2007)": "https://www.imdb.com/title/tt0890870/",
  "Saw V (2008)": "https://www.imdb.com/title/tt1132620/",
  "Saw VI (2009)": "https://www.imdb.com/title/tt1233227/",
  "Saw 3D (2010)": "https://www.imdb.com/title/tt1477076/",
  "Jigsaw (2017)": "https://www.imdb.com/title/tt3348730/",
  "Spiral (2021)": "https://www.imdb.com/title/tt10342730/",

  "The Purge (2013)": "https://www.imdb.com/title/tt2184339/",
  "Anarchy (2014)": "https://www.imdb.com/title/tt2975578/",
  "Election Year (2016)": "https://www.imdb.com/title/tt4094724/",
  "The First Purge (2018)": "https://www.imdb.com/title/tt6133466/",
  "The Forever Purge (2021)": "https://www.imdb.com/title/tt10327252/",

  "Paranormal Activity (2007)": "https://www.imdb.com/title/tt1179904/",
  "Paranormal Activity 2 (2010)": "https://www.imdb.com/title/tt1536044/",
  "Paranormal Activity 3 (2011)": "https://www.imdb.com/title/tt1778304/",
  "Paranormal Activity 4 (2012)": "https://www.imdb.com/title/tt2109184/",
  "The Marked Ones (2014)": "https://www.imdb.com/title/tt2473682/",
  "The Ghost Dimension (2015)": "https://www.imdb.com/title/tt2473510/",
  "Next of Kin (2021)": "https://www.imdb.com/title/tt12342790/",

  "Resident Evil (2002)": "https://www.imdb.com/title/tt0120804/",
  "Apocalypse (2004)": "https://www.imdb.com/title/tt0318627/",
  "Extinction (2007)": "https://www.imdb.com/title/tt0432021/"
};
const imdbLinks8 = {
  "Afterlife (2010)": "https://www.imdb.com/title/tt1220634/",
  "Retribution (2012)": "https://www.imdb.com/title/tt1220634/",
  "The Final Chapter (2016)": "https://www.imdb.com/title/tt2592614/",
  "Welcome to Raccoon City (2021)": "https://www.imdb.com/title/tt6920084/",

  "Halloween (1978)": "https://www.imdb.com/title/tt0077651/",
  "Halloween II (1981)": "https://www.imdb.com/title/tt0082495/",
  "Halloween (2018)": "https://www.imdb.com/title/tt1502407/",
  "Halloween Kills (2021)": "https://www.imdb.com/title/tt10665338/",
  "Halloween Ends (2022)": "https://www.imdb.com/title/tt10665342/",

  "Scream (1996)": "https://www.imdb.com/title/tt0117571/",
  "Scream 2 (1997)": "https://www.imdb.com/title/tt0120082/",
  "Scream 3 (2000)": "https://www.imdb.com/title/tt0134084/",
  "Scream 4 (2011)": "https://www.imdb.com/title/tt1262416/",
  "Scream (2022)": "https://www.imdb.com/title/tt11245972/",
  "Scream VI (2023)": "https://www.imdb.com/title/tt17663992/",

  "Final Destination (2000)": "https://www.imdb.com/title/tt0195714/",
  "Final Destination 2 (2003)": "https://www.imdb.com/title/tt0309593/",
  "Final Destination 3 (2006)": "https://www.imdb.com/title/tt0414982/",
  "The Final Destination (2009)": "https://www.imdb.com/title/tt1144884/",
  "Final Destination 5 (2011)": "https://www.imdb.com/title/tt1622979/",

  "Cloverfield (2008)": "https://www.imdb.com/title/tt1060277/",
  "10 Cloverfield Lane (2016)": "https://www.imdb.com/title/tt1179933/",
  "The Cloverfield Paradox (2018)": "https://www.imdb.com/title/tt2548396/",

  "Toy Story (1995)": "https://www.imdb.com/title/tt0114709/",
  "Toy Story 2 (1999)": "https://www.imdb.com/title/tt0120363/",
  "Toy Story 3 (2010)": "https://www.imdb.com/title/tt0435761/",
  "Toy Story 4 (2019)": "https://www.imdb.com/title/tt1979376/",

  "Shrek (2001)": "https://www.imdb.com/title/tt0126029/",
  "Shrek 2 (2004)": "https://www.imdb.com/title/tt0298148/",
  "Shrek the Third (2007)": "https://www.imdb.com/title/tt0413267/",
  "Shrek Forever After (2010)": "https://www.imdb.com/title/tt0892791/",

  "Ice Age (2002)": "https://www.imdb.com/title/tt0268380/",
  "The Meltdown (2006)": "https://www.imdb.com/title/tt0438097/",
  "Dawn of the Dinosaurs (2009)": "https://www.imdb.com/title/tt1080016/",
  "Continental Drift (2012)": "https://www.imdb.com/title/tt1667889/",
  "Collision Course (2016)": "https://www.imdb.com/title/tt3416828/"
};
const imdbLinks9 = {
  "Kung Fu Panda (2008)": "https://www.imdb.com/title/tt0441773/",
  "Kung Fu Panda 2 (2011)": "https://www.imdb.com/title/tt1302011/",
  "Kung Fu Panda 3 (2016)": "https://www.imdb.com/title/tt2267968/",
  "Kung Fu Panda 4 (2024)": "https://www.imdb.com/title/tt21692408/",

  "How to Train Your Dragon (2010)": "https://www.imdb.com/title/tt0892769/",
  "How to Train Your Dragon 2 (2014)": "https://www.imdb.com/title/tt1646971/",
  "The Hidden World (2019)": "https://www.imdb.com/title/tt2386490/",

  "Despicable Me (2010)": "https://www.imdb.com/title/tt1323594/",
  "Despicable Me 2 (2013)": "https://www.imdb.com/title/tt1690953/",
  "Minions (2015)": "https://www.imdb.com/title/tt2293640/",
  "Despicable Me 3 (2017)": "https://www.imdb.com/title/tt3469046/",
  "Minions: The Rise of Gru (2022)": "https://www.imdb.com/title/tt5113044/",

  "The Hunger Games (2012)": "https://www.imdb.com/title/tt1392170/",
  "Catching Fire (2013)": "https://www.imdb.com/title/tt1951264/",
  "Mockingjay – Part 1 (2014)": "https://www.imdb.com/title/tt1951265/",
  "Mockingjay – Part 2 (2015)": "https://www.imdb.com/title/tt1951266/",
  "The Ballad of Songbirds & Snakes (2023)": "https://www.imdb.com/title/tt10545296/",

  "The Maze Runner (2014)": "https://www.imdb.com/title/tt1790864/",
  "The Scorch Trials (2015)": "https://www.imdb.com/title/tt4046784/",
  "The Death Cure (2018)": "https://www.imdb.com/title/tt4500922/",

  "Divergent (2014)": "https://www.imdb.com/title/tt1840309/",
  "Insurgent (2015)": "https://www.imdb.com/title/tt2908446/",
  "Allegiant (2016)": "https://www.imdb.com/title/tt3410834/",

  "Back to the Future (1985)": "https://www.imdb.com/title/tt0088763/",
  "Back to the Future Part II (1989)": "https://www.imdb.com/title/tt0096874/",
  "Back to the Future Part III (1990)": "https://www.imdb.com/title/tt0099088/",

  "Die Hard (1988)": "https://www.imdb.com/title/tt0095016/",
  "Die Hard 2 (1990)": "https://www.imdb.com/title/tt0099423/",
  "With a Vengeance (1995)": "https://www.imdb.com/title/tt0112864/",
  "Live Free or Die Hard (2007)": "https://www.imdb.com/title/tt0337978/",
  "A Good Day to Die Hard (2013)": "https://www.imdb.com/title/tt1606378/",

  "Lethal Weapon (1987)": "https://www.imdb.com/title/tt0093409/",
  "Lethal Weapon 2 (1989)": "https://www.imdb.com/title/tt0097733/",
  "Lethal Weapon 3 (1992)": "https://www.imdb.com/title/tt0104714/",
  "Lethal Weapon 4 (1998)": "https://www.imdb.com/title/tt0122151/"
};
const imdbLinks10 = {
  "First Blood (1982)": "https://www.imdb.com/title/tt0083944/",
  "Rambo: First Blood Part II (1985)": "https://www.imdb.com/title/tt0089880/",
  "Rambo III (1988)": "https://www.imdb.com/title/tt0095956/",
  "Rambo (2008)": "https://www.imdb.com/title/tt0462499/",
  "Last Blood (2019)": "https://www.imdb.com/title/tt1206885/",

  "The Godfather (1972)": "https://www.imdb.com/title/tt0068646/",
  "The Godfather Part II (1974)": "https://www.imdb.com/title/tt0071562/",
  "The Godfather Part III (1990)": "https://www.imdb.com/title/tt0099674/",

  "Rocky (1976)": "https://www.imdb.com/title/tt0075148/",
  "Rocky II (1979)": "https://www.imdb.com/title/tt0079817/",
  "Rocky III (1982)": "https://www.imdb.com/title/tt0084602/",
  "Rocky IV (1985)": "https://www.imdb.com/title/tt0089927/",
  "Rocky V (1990)": "https://www.imdb.com/title/tt0100507/",
  "Rocky Balboa (2006)": "https://www.imdb.com/title/tt0479143/",
  "Creed (2015)": "https://www.imdb.com/title/tt3076658/",
  "Creed II (2018)": "https://www.imdb.com/title/tt6343314/",
  "Creed III (2023)": "https://www.imdb.com/title/tt11145118/",

  "Ocean’s Eleven (2001)": "https://www.imdb.com/title/tt0240772/",
  "Ocean’s Twelve (2004)": "https://www.imdb.com/title/tt0349903/",
  "Ocean’s Thirteen (2007)": "https://www.imdb.com/title/tt0496806/",
  "Ocean’s 8 (2018)": "https://www.imdb.com/title/tt5164214/",

  "Jaws (1975)": "https://www.imdb.com/title/tt0073195/",
  "Jaws 2 (1978)": "https://www.imdb.com/title/tt0077766/",
  "Jaws 3-D (1983)": "https://www.imdb.com/title/tt0085750/",
  "Jaws: The Revenge (1987)": "https://www.imdb.com/title/tt0093300/",

  "Avatar (2009)": "https://www.imdb.com/title/tt0499549/",
  "The Way of Water (2022)": "https://www.imdb.com/title/tt1630029/",

  "Alien (1979)": "https://www.imdb.com/title/tt0078748/",
  "Aliens (1986)": "https://www.imdb.com/title/tt0090605/",
  "Alien 3 (1992)": "https://www.imdb.com/title/tt0103644/",
  "Alien: Resurrection (1997)": "https://www.imdb.com/title/tt0118583/",
  "Prometheus (2012)": "https://www.imdb.com/title/tt1446714/",
  "Alien: Covenant (2017)": "https://www.imdb.com/title/tt2316204/",

  "Predator (1987)": "https://www.imdb.com/title/tt0093773/",
  "Predator 2 (1990)": "https://www.imdb.com/title/tt0100403/",
  "Predators (2010)": "https://www.imdb.com/title/tt1424381/",
  "The Predator (2018)": "https://www.imdb.com/title/tt3829266/",
  "Prey (2022)": "https://www.imdb.com/title/tt11866324/",

  "Blade Runner (1982)": "https://www.imdb.com/title/tt0083658/",
  "Blade Runner 2049 (2017)": "https://www.imdb.com/title/tt1856101/",

  "The Mummy (1999)": "https://www.imdb.com/title/tt0120616/",
  "The Mummy Returns (2001)": "https://www.imdb.com/title/tt0209163/",
  "The Mummy: Tomb of the Dragon Emperor (2008)": "https://www.imdb.com/title/tt0859163/",
  "The Scorpion King (2002)": "https://www.imdb.com/title/tt0277296/",

  "Ghostbusters (1984)": "https://www.imdb.com/title/tt0087332/",
  "Ghostbusters II (1989)": "https://www.imdb.com/title/tt0097428/",
  "Ghostbusters: Afterlife (2021)": "https://www.imdb.com/title/tt4513678/",
  "Ghostbusters: Frozen Empire (2024)": "https://www.imdb.com/title/tt21235248/",

  "The Karate Kid (1984)": "https://www.imdb.com/title/tt0087538/",
  "The Karate Kid Part II (1986)": "https://www.imdb.com/title/tt0091326/",
  "The Karate Kid Part III (1989)": "https://www.imdb.com/title/tt0097647/",
  "The Next Karate Kid (1994)": "https://www.imdb.com/title/tt0110657/",
  "The Karate Kid (2010)": "https://www.imdb.com/title/tt1155076/",

  "The Lion, the Witch and the Wardrobe (2005)": "https://www.imdb.com/title/tt0363771/",
  "Prince Caspian (2008)": "https://www.imdb.com/title/tt0499448/",
  "The Voyage of the Dawn Treader (2010)": "https://www.imdb.com/title/tt0980970/",

  "The Pink Panther (1963)": "https://www.imdb.com/title/tt0057413/",
  "A Shot in the Dark (1964)": "https://www.imdb.com/title/tt0058329/",
  "The Pink Panther (2006)": "https://www.imdb.com/title/tt0383216/",
  "The Pink Panther 2 (2009)": "https://www.imdb.com/title/tt0838232/"
};
const allImdbLinks = {
  ...imdbLinks,
  ...imdbLinks2,
  ...imdbLinks3,
  ...imdbLinks4,
  ...imdbLinks5,
  ...imdbLinks6,
  ...imdbLinks7,
  ...imdbLinks8,
  ...imdbLinks9,
  ...imdbLinks10
};



document.addEventListener("click", event => {
  const card = event.target.closest(".card");
  if (!card) return;

  const movieName = card.textContent.trim();
  if (allImdbLinks[movieName]) {
    window.open(allImdbLinks[movieName], "_blank");
  } else {
    alert("IMDb link not found for: " + movieName);
  }
});
