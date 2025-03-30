document.addEventListener("DOMContentLoaded", () => {
    const globalRanking = document.getElementById("global-ranking");
    const countryRanking = document.getElementById("country-ranking");
    const countrySelect = document.getElementById("country-select");
    
    let songs = JSON.parse(localStorage.getItem("songs")) || [];
    let countries = ["Polska", "USA", "UK", "Niemcy"];

    function assignRandomStreams() {
        songs.forEach(song => {
            song.streams += Math.floor(Math.random() * 10000000);
        });
        localStorage.setItem("songs", JSON.stringify(songs));
    }

    function updateRankings() {
        globalRanking.innerHTML = "";
        countryRanking.innerHTML = "";

        songs.sort((a, b) => b.streams - a.streams);
        
        songs.slice(0, 100).forEach((song, index) => {
            let li = document.createElement("li");
            li.textContent = `#${index + 1} ${song.artist} - ${song.title} (${song.streams} odsłuchań)`;
            globalRanking.appendChild(li);
        });

        let selectedCountry = countrySelect.value;
        let countrySongs = songs.filter(song => song.country === selectedCountry);
        countrySongs.sort((a, b) => b.streams - a.streams);

        countrySongs.slice(0, 10).forEach((song, index) => {
            let li = document.createElement("li");
            li.textContent = `#${index + 1} ${song.artist} - ${song.title} (${song.streams} odsłuchań)`;
            countryRanking.appendChild(li);
        });
    }

    function loadArtistProfile() {
        let params = new URLSearchParams(window.location.search);
        let artistName = params.get("artist");
        let artistHeader = document.getElementById("artist-name");
        let artistLabel = document.getElementById("artist-label");
        let songList = document.getElementById("song-list");

        artistHeader.textContent = artistName;

        let artistSongs = songs.filter(song => song.artist === artistName);
        let totalStreams = artistSongs.reduce((sum, song) => sum + song.streams, 0);
        
        artistLabel.textContent = `Łączna liczba odsłuchań: ${totalStreams}`;

        artistSongs.sort((a, b) => b.streams - a.streams);
        artistSongs.forEach(song => {
            let li = document.createElement("li");
            li.textContent = `${song.title} - ${song.streams} odsłuchań`;
            songList.appendChild(li);
        });
    }

    if (window.location.pathname.includes("artist.html")) {
        loadArtistProfile();
    } else {
        assignRandomStreams();
        updateRankings();
        setInterval(updateRankings, 24 * 60 * 60 * 1000);
    }

    countrySelect.addEventListener("change", updateRankings);
});
