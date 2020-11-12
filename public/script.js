var elemSchedule;
var elemShows;
var elemEpisodes;
var elemCast;

var showPages = 0;
var loaded = 0;
var loadStart = 0;
var loadEnd = 31;
var currentGenre;

var showIndex = false;
var genreIndex = false;

var array = [];

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyA7Ok-N1ybJ6IMaWE71sg7fhAIMpEQMP5s",
  authDomain: "open-channel-database.firebaseapp.com",
  databaseURL: "https://open-channel-database.firebaseio.com",
  projectId: "open-channel-database",
  storageBucket: "open-channel-database.appspot.com",
  messagingSenderId: "260383576319",
  appId: "1:260383576319:web:1510cd33c17c89c5457cca",
  measurementId: "G-DXD519HEXJ"
};

// initialize variables after page loads
window.onload = function() {
  elemShows = document.getElementById("shows");
  elemSchedule = document.getElementById("schedule");
  homePage();
}; // window.onload

//api urls
const url_base = "https://api.tvmaze.com/search/shows?q=";
const url_base2 = "https://api.tvmaze.com/search/people?q=";
const url_2 = "https://api.tvmaze.com/shows/";

//call search function
function searchfunction() {
  search();
}

//search function
function search() {
  let searchTerm = document.getElementById("search-input").value;

  if (searchTerm == ""){
    return;
  }
  //perform search
  if (document.getElementById("home").className == "unhidden") {
    changeVisibility("home");
  }
  if (document.getElementById("index").className == "unhidden") {
    changeVisibility("index");
    showIndex = false;
    genreIndex = false;
  }
  showPages = 0;
  if (document.getElementById("main").className == "hidden") {
    changeVisibility("main");
  }
  if (document.getElementById("previous").className == "unhidden") {
    changeVisibility("previous");
  }
  document.getElementById("showResults").innerHTML = "";
  document.getElementById("actorResults").innerHTML = "";
  fetchData(searchTerm);
}

// home page for tv shows
function homePage() {
  if (document.getElementById("main").className == "unhidden") {
    changeVisibility("main");
  }
  if (document.getElementById("home").className == "hidden") {
    changeVisibility("home");
  }
  if (document.getElementById("index").className == "unhidden") {
    changeVisibility("index");
    showIndex = false;
    genreIndex = false;
  }
  if (document.getElementById("previous").className == "unhidden") {
    changeVisibility("previous");
  }
  showPages = 0;
  fetchRandShows();
  fetchSchedule();
}

//library for tv shows
function showLibrary() {
  if (document.getElementById("main").className == "unhidden") {
    changeVisibility("main");
  }
  if (document.getElementById("home").className == "unhidden") {
    changeVisibility("home");
  }
  if (document.getElementById("index").className == "hidden") {
    changeVisibility("index");
  }
  if (document.getElementById("previous").className == "unhidden") {
    changeVisibility("previous");
  }
  document.getElementById("previous").classNAME = "hidden";
  document.getElementById("library").innerHTML = "";
  showIndex = true;
  genreIndex = false;
  fetchShows();
}

// going to next page
function next() {
  loadStart += 31;
  loadEnd += 31;
  if (genreIndex == true) {
    if (document.getElementById("previous").className == "hidden") {
      changeVisibility("previous");
    }
    document.getElementById("library").innerHTML = "";
    createGenreShows(currentGenre);
  }

  if (showIndex == true) {
    ++showPages;
    if (document.getElementById("previous").className == "hidden") {
      changeVisibility("previous");
    }
    if (showPages == 206) {
      changeVisibility("next");
    }
    document.getElementById("library").innerHTML = "";
    fetchShows();
  }
}

// going back to previous page
function previous() {
  loadStart -= 31;
  loadEnd -= 31;
  if (genreIndex == true) {
    if (document.getElementById("next").className == "hidden") {
      changeVisibility("next");
    }
    if (loadStart == 0) {
      changeVisibility("previous");
    }
    document.getElementById("library").innerHTML = "";
    createGenreShows(currentGenre);
  }

  if (showIndex == true) {
    --showPages;
    if (document.getElementById("next").className == "hidden") {
      changeVisibility("next");
    }
    if (showPages == 0) {
      changeVisibility("previous");
    }
    document.getElementById("library").innerHTML = "";
    fetchShows();
  }
}

// get data from TV Maze
function pushData() {
  for (var i = 0; i < 206; i++) {
    fetch("https://api.tvmaze.com/shows?page=" + i)
      .then(response => response.json())
      .then(data => {
        array.push(data);
      });
  }
}

//different genre of shows
function loadGenre(genre) {
  if (document.getElementById("main").className == "unhidden") {
    changeVisibility("main");
  }
  if (document.getElementById("home").className == "unhidden") {
    changeVisibility("home");
  }
  if (document.getElementById("index").className == "hidden") {
    changeVisibility("index");
  }
  if (document.getElementById("previous").className == "unhidden") {
    changeVisibility("previous");
  }
  document.getElementById("library").innerHTML = "";
  loadStart = 0;
  loadEnd = 31;
  currentGenre = genre;
  showIndex = false;
  genreIndex = true;
  createGenreShows(currentGenre);
}

// get data from TV Maze
function fetchData(searchTerm) {
  fetch(url_base + searchTerm)
    .then(response => response.json())
    .then(data => updatePage(data));
  fetch(url_base2 + searchTerm)
    .then(response => response.json())
    .then(data => updatePage2(data));
}

// schedule of shows on the bottom page
function fetchSchedule() {
  fetch("https://api.tvmaze.com/schedule?country=US")
    .then(response => response.json())
    .then(data => loadSchedule(data));
}

//random tv shows on home page when first loaded
function fetchRandShows() {
  fetch(
    "https://api.tvmaze.com/shows?page=" + 1
  )
    .then(response => response.json())
    .then(data => loadRandShows(data));
}

// fetch tv shows
function fetchShows() {
  fetch("https://api.tvmaze.com/shows?page=" + showPages)
    .then(response => response.json())
    .then(data => loadShows(data));
}

//fetch episodes
function fetchEpisodes(id, elemDiv) {
  //let searchTerm = document.getElementById("search-input").value;
  var url = url_2 + id + "/episodes";
  console.log("Episodes URL " + url);
  fetch(url)
    .then(response => response.json())
    .then(data => updateEpisodes(data, elemDiv));
}

//fetch casts
function fetchCast(id, elemDiv) {
  //let searchTerm = document.getElementById("search-input").value;
  var url = url_2 + id + "/cast";
  console.log("Cast URL " + url);
  fetch(url)
    .then(response => response.json())
    .then(data => updateCast(data, elemDiv));
}

//list of episodes in a collapsible overflow
function updateEpisodes(data, elemDiv) {
  // pass in elemDiv, create elemEpisodes here, add the list of episodes to elemEpisodes innerHTNL
  // and then append elemEpisdoes to elemDiv
  var elemButton = document.createElement("button");
  var episodesList = document.createElement("div");
  elemButton.className = "collapsible";
  episodesList.className = "content";

  var collapsible = document.getElementsByClassName("collapsible");

  var output = "<ol>";

  for (episode in data) {
    output += "<li class='episodesList'>" + data[episode].name + "</li>";
  }
  output += "</ol>";

  elemButton.addEventListener("click", function() {
    episodesList.classList.toggle("active");
    if (episodesList.style.display === "none") {
      episodesList.style.display = "block";
    } else {
      episodesList.style.display = "none";
    }
  });

  episodesList.style.display = "none";

  episodesList.innerHTML = output;

  elemButton.innerHTML = "Episodes" + "<hr>";

  elemDiv.appendChild(elemButton);
  elemDiv.appendChild(episodesList);
}

// update the casts
function updateCast(data, elemDiv) {
  // pass in elemDiv, create elemCast here, add the list of actors to elemCast innerHTNL
  // and then append elemCast to elemDiv
  var castList = document.createElement("div");
  castList.className = "castings";

  var output = "<ol>";

  for (actor in data) {
    console.log(data[actor].person.image.medium);
    if(data[actor].person.image.medium !== null){
    output +=
      "<li class='castList'>" +
      data[actor].person.name +
      "<img src='" +
      data[actor].person.image.medium +
      "'  alt='' >" +
      "</li>";
    } else {
        output += "<div id='nullImage'> Missing Image </div>"
      }
  }
  output += "</ol>";

  castList.innerHTML = output;

  elemDiv.appendChild(castList);
}

// change the activity displayed
function updatePage(data) {
  var tvshow;
  for (tvshow in data) {
    createTVShow(data[tvshow]);
  }
}

//load actors
function updatePage2(data) {
  var tvshow;
  for (tvshow in data) {
    createActors(data[tvshow]);
  }
}

// loads schedule
function loadSchedule(data) {
  var tvshow;
  for (tvshow in data) {
    createSchedule(data[tvshow]);
  }
}

// loads random tv shows on homepage
function loadRandShows(data) {
  var tvshow;
  for (tvshow in data) {
    createRandShows(data[tvshow]);
  }
}

// loads tv shows
function loadShows(data) {
  var tvshow;
  for (tvshow in data) {
    createShows(data[tvshow]);
  }
}

// returns a string of formatted genres
function showGenres(genres) {
  var g;
  var output = "<ul class='genreList'>";
  for (g in genres) {
    output += "<li class='genreListItem'>" + genres[g] + "</li>";
  } // for
  output += "</ul>";
  return output;
} // showGenres

// creates TV shows
function createTVShow(tvshowJSON) {
  var tvshowId = tvshowJSON.show.id;

  var elemResults = document.getElementById("showResults");

  var elemDiv = document.createElement("div");
  elemDiv.id = "results";
  if (tvshowJSON.show.image !== null) {
    var elemImage = document.createElement("img");
  } else {
    elemImage = document.createElement("div");
    elemImage.id = "nullImage";
  }

  var elemShowTitle = document.createElement("h2");
  elemShowTitle.classList.add("showtitle"); // add a class to apply css
  elemShowTitle.onclick = function() {
    changeVisibility("pageContent");
    changeVisibility("lightbox");
    changeVisibility("infobox");
    createInfo(tvshowJSON);
  };

  var elemGenre = document.createElement("div");
  var elemRating = document.createElement("div");

  // add JSON data to elements
  if (tvshowJSON.show.image !== null) {
    elemImage.src = tvshowJSON.show.image.medium;
    elemImage.alt = "image";
  } else {
    elemImage.innerHTML = " Missing Image ";
  }

  elemShowTitle.innerHTML = tvshowJSON.show.name;
  elemGenre.innerHTML = showGenres(tvshowJSON.show.genres);
  elemRating.innerHTML = tvshowJSON.show.rating.average;

  // add 6 elements to the div tag
  elemDiv.appendChild(elemShowTitle);
  elemDiv.appendChild(elemGenre);
  elemDiv.appendChild(elemRating);
  elemDiv.appendChild(elemImage);

  // add this entry to main
  elemResults.appendChild(elemDiv);
} // createTVS

// creates actors for each tv shows
function createActors(tvshowJSON) {
  var elemResults = document.getElementById("actorResults");

  var elemDiv = document.createElement("div");
  elemDiv.id = "show";
  if (tvshowJSON.image !== null) {
    var elemImage = document.createElement("img");
  } else {
    elemImage = document.createElement("div");
    elemImage.id = "nullImage";
  }

  var elemShowTitle = document.createElement("h2");
  elemShowTitle.classList.add("showtitle"); // add a class to apply css
  //elemShowTitle.onclick =  ;

  // add JSON data to elements
  if (tvshowJSON.person.image !== null) {
    elemImage.src = tvshowJSON.person.image.medium;
    elemImage.alt = "image";
  } else {
    elemImage.innerHTML = " Missing Image ";
  }

  elemShowTitle.innerHTML = tvshowJSON.person.name;

  // add 6 elements to the div tag
  elemDiv.appendChild(elemShowTitle);
  elemDiv.appendChild(elemImage);

  // add this entry to main
  elemResults.appendChild(elemDiv);
} // create actors

// constructs schedules on homepage
function createSchedule(tvshowJSON) {

  var elemDiv = document.createElement("div");

  var elemShowTitle = document.createElement("h2");
  elemShowTitle.classList.add("scheduletitle"); // add a class to apply css
  elemShowTitle.onclick = function() {
    changeVisibility("pageContent");
    changeVisibility("lightbox");
    changeVisibility("infobox");
    createInfo(tvshowJSON);
  };
  var elemAirtime = document.createElement("h3");
  var elemChannel = document.createElement("h3");

  // add JSON data to elements
  elemShowTitle.innerHTML = tvshowJSON.show.name;
  elemAirtime.innerHTML = tvshowJSON.airtime;

  if (tvshowJSON.show.network !== null) {
    elemChannel.innerHTML = tvshowJSON.show.network.name;
  } else {
    elemChannel.innerHTML = tvshowJSON.show.webChannel.name;
  }

  elemSchedule.appendChild(elemDiv);

  // add 5 elements to the div tag
  elemDiv.appendChild(elemShowTitle);
  elemDiv.appendChild(elemAirtime);
  elemDiv.appendChild(elemChannel);
} // create schedule

// construct random tv shows for homepage
function createRandShows(tvshowJSON) {
  console.log("function loaded")
  if (loaded < 5) {

    var elemDiv = document.createElement("div");

    var elemShowTitle = document.createElement("h2");
    elemShowTitle.classList.add("showtitle"); // add a class to apply css
    elemShowTitle.onclick = function() {
      changeVisibility("pageContent");
      changeVisibility("lightbox");
      changeVisibility("infobox");
      createInfo(tvshowJSON);
    };
    var elemChannel = document.createElement("h3");
    if (tvshowJSON.image !== null) {
      var elemImage = document.createElement("img");
      elemImage.alt = "image";
    } else {
      elemImage = document.createElement("div");
      elemImage.id = "nullImage";
    }

    // add JSON data to elements
    elemShowTitle.innerHTML = tvshowJSON.name;
    // add JSON data to elements
    if (tvshowJSON.image !== null) {
      elemImage.src = tvshowJSON.image.medium;
    } else {
      elemImage.innerHTML = " Missing Image ";
    }

    if (tvshowJSON.network !== null) {
      elemChannel.innerHTML = tvshowJSON.network.name;
    } else {
      elemChannel.innerHTML = tvshowJSON.webChannel.name;
    }

    elemShows.appendChild(elemDiv);

    // add 5 elements to the div tag
    elemDiv.appendChild(elemShowTitle);
    elemDiv.appendChild(elemChannel);
    elemDiv.appendChild(elemImage);

    loaded++;
  }
} // creare random tv shows

// constructs one TV show entry on homepage
function createShows(tvshowJSON) {
  var elemLibrary = document.getElementById("library");

  var elemDiv = document.createElement("div");
  if (tvshowJSON.image !== null) {
    var elemImage = document.createElement("img");
    elemImage.alt = "image";
  } else {
    elemImage = document.createElement("div");
    elemImage.id = "nullImage";
  }

  var elemShowTitle = document.createElement("h2");
  elemShowTitle.classList.add("showtitle"); // add a class to apply css
  elemShowTitle.onclick = function() {
    changeVisibility("pageContent");
    changeVisibility("lightbox");
    changeVisibility("infobox");
    createInfo(tvshowJSON);
  };

  var elemGenre = document.createElement("div");
  var elemRating = document.createElement("div");
  var elemStatus = document.createElement("div");

  // add JSON data to elements
  if (tvshowJSON.image !== null) {
    elemImage.src = tvshowJSON.image.medium;
  } else {
    elemImage.innerHTML = " Missing Image ";
  }

  elemShowTitle.innerHTML = tvshowJSON.name;
  if (tvshowJSON.rating.average !== null) {
    elemRating.innerHTML = "&#9733; " + tvshowJSON.rating.average;
  } else {
    elemRating.innerHTML = "&#9733; unrated";
  }
  elemStatus.innerHTML = tvshowJSON.status;

  elemLibrary.appendChild(elemDiv);

  // add 5 elements to the div tag
  elemDiv.appendChild(elemShowTitle);
  elemDiv.appendChild(elemGenre);
  elemDiv.appendChild(elemRating);
  elemDiv.appendChild(elemStatus);
  elemDiv.appendChild(elemImage);
} // createTVShows

//create shows for a genre
function createGenreShows(genre) {
  var num = 0;

  for (var i = 0; i < array.length; i++) {
    for (var x = 0; x < array[i].length; x++) {
      if (array[i] && array[i][x].genres.includes(genre)) {
        num++;
        if (num < loadEnd && num > loadStart) {
          var elemLibrary = document.getElementById("library");

          var elemDiv = document.createElement("div");
          elemDiv.id = "show";
          if (array[i][x].image !== null) {
            var elemImage = document.createElement("img");
            elemImage.alt = "image";
          } else {
            elemImage = document.createElement("div");
            elemImage.id = "nullImage";
          }

          var elemShowTitle = document.createElement("h2");
          elemShowTitle.classList.add("showtitle"); // add a class to apply css
          function someInfo(index, show) {
            elemShowTitle.addEventListener("click", function() {
              if (array[index]) {
                changeVisibility("pageContent");
                changeVisibility("lightbox");
                changeVisibility("infobox");
                createInfo(array[index][show]);
              }
            });
          }

          someInfo(i, x);

          var elemGenre = document.createElement("div");
          var elemRating = document.createElement("div");
          var elemStatus = document.createElement("div");

          // add JSON data to elements
          if (array[i][x].image !== null) {
            elemImage.src = array[i][x].image.medium;
            elemImage.alt = "image";
          } else {
            elemImage.innerHTML = " Missing Image ";
          }
          elemShowTitle.innerHTML = array[i][x].name;
          elemGenre.innerHTML = showGenres(array[i][x].genres);
          if (array[i][x].rating.average !== null) {
            elemRating.innerHTML = "&#9733; " + array[i][x].rating.average;
          } else {
            elemRating.innerHTML = "&#9733; unrated";
          }
          elemStatus.innerHTML = array[i][x].status;

          elemLibrary.appendChild(elemDiv);

          // add 5 elements to the div tag
          elemDiv.appendChild(elemShowTitle);
          elemDiv.appendChild(elemGenre);
          elemDiv.appendChild(elemRating);
          elemDiv.appendChild(elemStatus);
          elemDiv.appendChild(elemImage);
        }
      }
    }
  }
} // createTVS

// creats info for the tv show
function createInfo(tvshowJSON) {
  if (tvshowJSON.hasOwnProperty("show")) {
    var tvshowId = tvshowJSON.show.id;

    var elemBox = document.getElementById("infobox");
    var elemMiniDiv = document.createElement("div");
    elemMiniDiv.id = "sortBox";

    var elemDiv = document.createElement("div");
    elemDiv.id = "showInfo";
    if (tvshowJSON.show.image !== null) {
      var elemImage = document.createElement("img");
      elemImage.alt = "image";
    } else {
      elemImage = document.createElement("div");
      elemImage.id = "nullImage";
    }

    var elemShowTitle = document.createElement("h2");

    var elemGenre = document.createElement("div");
    var elemRating = document.createElement("div");
    var elemStatus = document.createElement("div");
    var elemSummary = document.createElement("div");
    elemSummary.id = "summary";
    elemEpisodes = document.createElement("div");
    elemCast = document.createElement("div");

    // add JSON data to elements
    if (tvshowJSON.show.image !== null) {
      elemImage.src = tvshowJSON.show.image.medium;
      elemImage.alt = "image";
    } else {
      elemImage.innerHTML = " Missing Image ";
    }
    elemShowTitle.innerHTML = tvshowJSON.show.name;
    elemGenre.innerHTML = showGenres(tvshowJSON.show.genres);
    if (tvshowJSON.show.rating.average !== null) {
      elemRating.innerHTML = "&#9733; " + tvshowJSON.show.rating.average;
    } else {
      elemRating.innerHTML = "&#9733; unrated";
    }
    elemStatus.innerHTML = tvshowJSON.show.status;
    elemSummary.innerHTML = tvshowJSON.show.summary;
    fetchEpisodes(tvshowId, elemEpisodes);
    fetchCast(tvshowId, elemCast);

    elemMiniDiv.appendChild(elemImage);
    elemMiniDiv.appendChild(elemSummary);

    // add 6 elements to the div tag
    elemDiv.appendChild(elemShowTitle);
    elemDiv.appendChild(elemGenre);
    elemDiv.appendChild(elemStatus);
    elemDiv.appendChild(elemRating);
    elemDiv.appendChild(elemCast);
    elemDiv.appendChild(elemMiniDiv);
    elemDiv.appendChild(elemEpisodes);
    elemDiv.appendChild(elemCast);

    // add this entry to main
    elemBox.appendChild(elemDiv);
  } else {
    var tvshowId = tvshowJSON.id;

    var elemBox = document.getElementById("infobox");
    var elemMiniDiv = document.createElement("div");
    elemMiniDiv.id = "sortBox";

    var elemDiv = document.createElement("div");
    if (tvshowJSON.image !== null) {
      var elemImage = document.createElement("img");
      elemImage.alt = "image";
    } else {
      elemImage = document.createElement("div");
      elemImage.id = "nullImage";
    }

    var elemShowTitle = document.createElement("h2");
    elemShowTitle.classList.add("showtitle"); // add a class to apply css

    var elemGenre = document.createElement("div");
    var elemRating = document.createElement("div");
    elemRating.id = "showrating";
    var elemSummary = document.createElement("div");
    elemSummary.id = "summary";
    var elemStatus = document.createElement("div");
    elemEpisodes = document.createElement("div");
    elemCast = document.createElement("div");

    // add JSON data to elements
    if (tvshowJSON.image !== null) {
      elemImage.src = tvshowJSON.image.medium;
      elemImage.alt = "image";
    } else {
      elemImage.innerHTML = " Missing Image ";
    }
    elemShowTitle.innerHTML = tvshowJSON.name;
    elemGenre.innerHTML = showGenres(tvshowJSON.genres);
    if (tvshowJSON.rating.average !== null) {
      elemRating.innerHTML = "&#9733; " + tvshowJSON.rating.average;
    } else {
      elemRating.innerHTML = "&#9733; unrated";
    }
    elemStatus.innerHTML = tvshowJSON.status;
    elemSummary.innerHTML = tvshowJSON.summary;
    fetchEpisodes(tvshowId, elemEpisodes);
    fetchCast(tvshowId, elemCast);

    elemMiniDiv.appendChild(elemImage);
    elemMiniDiv.appendChild(elemSummary);

    // add 6 elements to the div tag
    elemDiv.appendChild(elemShowTitle);
    elemDiv.appendChild(elemGenre);
    elemDiv.appendChild(elemStatus);
    elemDiv.appendChild(elemRating);
    elemDiv.appendChild(elemCast);
    elemDiv.appendChild(elemMiniDiv);
    elemDiv.appendChild(elemEpisodes);
    elemDiv.appendChild(elemCast);

    // add this entry to main
    elemBox.appendChild(elemDiv);
  }
} // createTVS

// change the visibility of divID
function changeVisibility(divID) {
  var element = document.getElementById(divID);

  // if element exists, switch it's class
  // between hidden and unhidden
  if (element) {
    element.className = element.className == "hidden" ? "unhidden" : "hidden";
  } // if
} // changeVisibility

function exitInfo() {
  changeVisibility("pageContent");
  changeVisibility("lightbox");
  changeVisibility("infobox");
  document.getElementById("infobox").innerHTML = "";
}
