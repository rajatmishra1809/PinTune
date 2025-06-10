document.addEventListener('DOMContentLoaded', function() {
    const surpriseBtn = document.getElementById('surprise-me-button');
    const getTunesBtn = document.getElementById('get-tunes-button');
    const descInput = document.getElementById('aesthetic-description');
    const musicDiv = document.getElementById('music-recommendations');

    function renderSongs(songs) {
        musicDiv.innerHTML = '';
        if (!songs || songs.length === 0) {
            musicDiv.innerHTML = '<p class="text-gray-500 text-center col-span-full text-xl font-medium animate-pulse">No recommendations found!</p>';
            return;
        }
        songs.forEach(song => {
            const card = document.createElement('div');
            card.className = 'song-card';
            card.innerHTML = `
                <img src="${song.album_art || 'https://placehold.co/96x96/9CA3AF/ffffff?text=No+Art'}" class="song-album-art" alt="Album Art">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">Artist: ${song.artist}</div>
                <a href="${song.youtube_url || '#'}" target="_blank" class="spotify-link">Listen on YouTube Music</a>
            `;
            musicDiv.appendChild(card);
        });
    }

    async function fetchRecommendations(description) {
        musicDiv.innerHTML = `<p class="text-gray-500 text-center col-span-full text-xl font-medium animate-pulse">Loading recommendations...</p>`;
        try {
            const response = await fetch('/recommend_music', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description })
            });
            const data = await response.json();
            renderSongs(data.songs || []);
        } catch (error) {
            musicDiv.innerHTML = '<p class="text-red-500 text-center col-span-full text-xl font-medium">Failed to load recommendations.</p>';
        }
    }

    surpriseBtn.addEventListener('click', function() {
        descInput.value = "cozy indie vibes";
        fetchRecommendations(descInput.value);
    });

    getTunesBtn.addEventListener('click', function() {
        fetchRecommendations(descInput.value);
    });
});
