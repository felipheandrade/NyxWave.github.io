document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });

    const introScreen = document.getElementById('intro-screen');
    const loginScreen = document.getElementById('login-screen');
    const appContainer = document.getElementById('app-container');
    const overlay = document.getElementById('overlay');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const rememberCheckbox = document.getElementById('remember');

    const VALID_USERNAME = 'admin';
    const VALID_PASSWORD = '1234';

    const savedUser = localStorage.getItem('musicPlayerUser');
    if (savedUser) {
        usernameInput.value = savedUser;
        rememberCheckbox.checked = true;
    }

    togglePasswordBtn.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        togglePasswordBtn.innerHTML = type === 'password' 
            ? '<i class="far fa-eye"></i>' 
            : '<i class="far fa-eye-slash"></i>';
    });

    setTimeout(() => {
        introScreen.classList.add('hidden');
        setTimeout(() => {
            loginScreen.classList.add('active');
            overlay.classList.add('active');
        }, 300);
    }, 2000);

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (username === VALID_USERNAME && password === VALID_PASSWORD) {
            if (rememberCheckbox.checked) {
                localStorage.setItem('musicPlayerUser', username);
            } else {
                localStorage.removeItem('musicPlayerUser');
            }
            loginScreen.classList.remove('active');
            loginScreen.style.opacity = '0';
            loginScreen.style.visibility = 'hidden';
            overlay.classList.remove('active');

            setTimeout(() => {
                appContainer.style.display = 'block';
                initPlayer();
            }, 300);
        } else {
            loginError.textContent = 'Usuário ou senha inválidos.';
            loginForm.style.animation = 'shake 0.5s';
            setTimeout(() => loginForm.style.animation = '', 500);
        }
    });

    function initPlayer() {
        const cover = document.getElementById('cover');
        const title = document.getElementById('music-title');
        const artist = document.getElementById('music-artist');
        const currentTimeEl = document.getElementById('current-time');
        const durationEl = document.getElementById('duration');
        const progress = document.getElementById('progress');
        const playerProgress = document.getElementById('player-progress');
        const prevBtn = document.getElementById('prev');
        const nextBtn = document.getElementById('next');
        const playBtn = document.getElementById('play');
        const bgImg = document.getElementById('bg-img');
        const searchInput = document.getElementById('search-input');
        const favoritesBtn = document.getElementById('favorites-btn');
        const lyricsBtn = document.getElementById('lyrics-btn');
        const playlistBtn = document.getElementById('playlist-btn');
        const uploadBtn = document.getElementById('upload-btn');
        const fileUpload = document.getElementById('file-upload');
        const themeToggle = document.getElementById('theme-toggle');

        const favoritesModal = document.getElementById('favorites-modal');
        const lyricsModal = document.getElementById('lyrics-modal');
        const playlistModal = document.getElementById('playlist-modal');
        const closeFavorites = document.getElementById('close-favorites');
        const closeLyrics = document.getElementById('close-lyrics');
        const closePlaylist = document.getElementById('close-playlist');
        const favoritesList = document.getElementById('favorites-list');
        const playlistList = document.getElementById('playlist-list');
        const lyricsContent = document.getElementById('lyrics-content');
        const lyricsTitle = document.getElementById('lyrics-title');
        const favoriteToggle = document.getElementById('favorite-toggle');
        const shuffleBtn = document.getElementById('shuffle');
        const repeatBtn = document.getElementById('repeat');
        const volumeSlider = document.getElementById('volume');
        const volumeIcon = document.getElementById('volume-icon');
        const equalizerEl = document.getElementById('equalizer');

        const miniPlayer = document.getElementById('mini-player');
        const miniCover = document.getElementById('mini-cover');
        const miniTitle = document.getElementById('mini-title');
        const miniArtist = document.getElementById('mini-artist');
        const miniPlay = document.getElementById('mini-play');
        const miniPrev = document.getElementById('mini-prev');
        const miniNext = document.getElementById('mini-next');

        let audioCtx;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        } catch (e) {
            console.error("Erro ao criar AudioContext:", e);
        }

        const music = new Audio();

        let playlist = [
            {
                path: 'assets/1.mp3',
                displayName: 'Billie Jean',
                cover: 'assets/1.jpg',
                artist: 'HoodTrap Remix',
                favorite: false
            },
            {
                path: 'assets/2.mp3',
                displayName: 'Falling Down',
                cover: 'assets/2.jpg',
                artist: 'Xxtentacion',
                favorite: false
            },
            {
                path: 'assets/3.mp3',
                displayName: 'Gods Creation',
                cover: 'assets/3.jpg',
                artist: 'Daniel',
                favorite: false
            },
            {
                path: 'assets/4.mp3',
                displayName: 'Abyss (from Kaiju No. 8)',
                cover: 'assets/4.jpg',
                artist: 'YUNGBLUD',
                favorite: false
            },
            {
                path: 'assets/5.mp3',
                displayName: 'Gods Plan',
                cover: 'assets/5.jpg',
                artist: 'Drake',
                favorite: false
            },
            {
                path: 'assets/6.mp3',
                displayName: 'OQQELESVAOFALAR?',
                cover: 'assets/6.jpg',
                 artist: 'Teto',
                  favorite: false
            },
        ];

        let musicIndex = 0;
        let isPlaying = false;
        let isShuffle = false;
        let isRepeat = false;

        // Criar equalizador colorido
        const colors = [
            '#ff0000', '#ff4000', '#ff8000', '#ffbf00', '#ffff00',
            '#bfff00', '#80ff00', '#40ff00', '#00ff00', '#00ff40',
            '#00ff80', '#00ffbf', '#00ffff', '#00bfff', '#0080ff',
            '#0040ff', '#0000ff', '#4000ff', '#8000ff', '#bf00ff',
            '#ff00ff', '#ff00bf', '#ff0080', '#ff0040'
        ];

        for (let i = 0; i < 32; i++) {
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.backgroundColor = colors[i % colors.length] || '#0e0d0d';
            equalizerEl.appendChild(bar);
        }
        const bars = equalizerEl.querySelectorAll('.bar');

        function showToast(msg) {
            const t = document.createElement('div');
            t.className = 'toast';
            t.textContent = msg;
            document.body.appendChild(t);
            t.classList.add('show');
            setTimeout(() => t.classList.remove('show'), 2000);
            setTimeout(() => t.remove(), 2300);
        }

        function loadMusic(song) {
            music.src = song.path;
            title.textContent = song.displayName;
            artist.textContent = song.artist;
            cover.src = song.cover || 'https://via.placeholder.com/300?text=Capa';
            bgImg.src = song.cover || 'https://via.placeholder.com/1920?text=Fundo';
            updateFavoriteIcon();
            lyricsTitle.textContent = `Letra: ${song.displayName}`;
            updateMiniPlayer();
        }

        function updateFavoriteIcon() {
            favoriteToggle.innerHTML = playlist[musicIndex].favorite 
                ? '<i class="fas fa-heart"></i>' 
                : '<i class="far fa-heart"></i>';
        }

        function togglePlay() {
            if (isPlaying) {
                music.pause();
                playBtn.className = 'fas fa-play play-button';
                miniPlay.className = 'fas fa-play';
                isPlaying = false;
            } else {
                music.play();
                playBtn.className = 'fas fa-pause play-button';
                miniPlay.className = 'fas fa-pause';
                isPlaying = true;
                if (audioCtx) audioCtx.resume();
            }
        }

       function nextSong() {
    if (isShuffle && playlist.length > 1) {
        let idx;
        do { idx = Math.floor(Math.random() * playlist.length); }
        while (idx === musicIndex);
        musicIndex = idx;
    } else {
        musicIndex = (musicIndex + 1) % playlist.length;
    }
    loadMusic(playlist[musicIndex]);
    // Garante que a próxima música TOQUE automaticamente
    isPlaying = true;
    music.play();
    playBtn.className = 'fas fa-pause play-button';
    miniPlay.className = 'fas fa-pause';
    if (audioCtx) audioCtx.resume();
}

        function prevSong() {
    if (isShuffle && playlist.length > 1) {
        let idx;
        do { idx = Math.floor(Math.random() * playlist.length); }
        while (idx === musicIndex);
        musicIndex = idx;
    } else {
        musicIndex = (musicIndex - 1 + playlist.length) % playlist.length;
    }
    loadMusic(playlist[musicIndex]);
    // Garante que a música anterior TOQUE automaticamente
    isPlaying = true;
    music.play();
    playBtn.className = 'fas fa-pause play-button';
    miniPlay.className = 'fas fa-pause';
    if (audioCtx) audioCtx.resume();
}

        function updateProgress() {
            if (isNaN(music.duration)) return;
            const pct = (music.currentTime / music.duration) * 100;
            progress.style.width = `${pct}%`;
            const fmt = t => {
                const m = Math.floor(t / 60);
                const s = Math.floor(t % 60);
                return `${m}:${s.toString().padStart(2, '0')}`;
            };
            durationEl.textContent = fmt(music.duration);
            currentTimeEl.textContent = fmt(music.currentTime);
        }

        function setProgress(e) {
            const rect = playerProgress.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            music.currentTime = (clickX / rect.width) * music.duration;
        }

        function renderPlaylist() {
            playlistList.innerHTML = '';
            playlist.forEach((song, i) => {
                const item = document.createElement('div');
                item.className = 'music-item';
                if (i === musicIndex) item.classList.add('active');
                item.innerHTML = `
                    <img src="${song.cover || 'https://via.placeholder.com/50?text=Capa'}">
                    <div class="music-info">
                        <h4>${song.displayName}</h4>
                        <p>${song.artist}</p>
                    </div>
                `;
                item.addEventListener('click', () => {
                    musicIndex = i;
                    loadMusic(playlist[musicIndex]);
                    togglePlay();
                    closeAllModals();
                });
                playlistList.appendChild(item);
            });
        }

        function filterSongs() {
            const term = searchInput.value.toLowerCase().trim();
            playlistModal.style.display = 'flex';
            if (!term) {
                renderPlaylist();
                return;
            }
            const filtered = playlist.filter(s =>
                s.displayName.toLowerCase().includes(term) ||
                s.artist.toLowerCase().includes(term)
            );
            playlistList.innerHTML = '';
            if (filtered.length === 0) {
                playlistList.innerHTML = '<p style="text-align:center;color:#666;padding:20px;">Nenhuma música encontrada</p>';
                return;
            }
            filtered.forEach(song => {
                const item = document.createElement('div');
                item.className = 'music-item';
                item.innerHTML = `
                    <img src="${song.cover || 'https://via.placeholder.com/50?text=Capa'}">
                    <div class="music-info">
                        <h4>${song.displayName}</h4>
                        <p>${song.artist}</p>
                    </div>
                `;
                item.addEventListener('click', () => {
                    const idx = playlist.findIndex(s => s.path === song.path);
                    if (idx !== -1) {
                        musicIndex = idx;
                        loadMusic(playlist[musicIndex]);
                        togglePlay();
                        closeAllModals();
                        searchInput.value = '';
                    }
                });
                playlistList.appendChild(item);
            });
        }

        function toggleShuffle() {
            isShuffle = !isShuffle;
            shuffleBtn.classList.toggle('active-control', isShuffle);
        }

        function toggleRepeat() {
            isRepeat = !isRepeat;
            repeatBtn.classList.toggle('active-control', isRepeat);
        }

        function closeAllModals() {
            favoritesModal.style.display = 'none';
            lyricsModal.style.display = 'none';
            playlistModal.style.display = 'none';
        }

        function animateEqualizer() {
            if (!isPlaying) {
                bars.forEach(b => b.style.height = '2px');
                requestAnimationFrame(animateEqualizer);
                return;
            }
            analyser.getByteFrequencyData(dataArray);
            for (let i = 0; i < bars.length; i++) {
                const h = Math.max(2, dataArray[i] / 4);
                bars[i].style.height = `${h}px`;
            }
            requestAnimationFrame(animateEqualizer);
        }

        function updateMiniPlayer() {
            const song = playlist[musicIndex];
            miniCover.src = song.cover || 'https://via.placeholder.com/50';
            miniTitle.textContent = song.displayName;
            miniArtist.textContent = song.artist;
            miniPlay.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
        }

        function setupEventListeners() {
            playBtn.addEventListener('click', togglePlay);
            prevBtn.addEventListener('click', prevSong);
            nextBtn.addEventListener('click', nextSong);
            music.addEventListener('timeupdate', updateProgress);
            playerProgress.addEventListener('click', setProgress);
            music.addEventListener('ended', () => {
                if (isRepeat) {
                    music.currentTime = 0;
                    music.play();
                } else {
                    nextSong();
                }
            });

            favoriteToggle.addEventListener('click', () => {
                playlist[musicIndex].favorite = !playlist[musicIndex].favorite;
                updateFavoriteIcon();
                showToast(playlist[musicIndex].favorite ? '❤️ Favorito!' : '💔 Removido');
            });

            favoritesBtn.addEventListener('click', () => {
                favoritesModal.style.display = 'flex';
                favoritesList.innerHTML = playlist
                    .filter(s => s.favorite)
                    .map(s => `
                        <div class="music-item">
                            <img src="${s.cover || 'https://via.placeholder.com/50?text=Capa'}">
                            <div class="music-info">
                                <h4>${s.displayName}</h4>
                                <p>${s.artist}</p>
                            </div>
                        </div>
                    `).join('') || '<p style="text-align:center;padding:20px;color:#666;">Nenhum favorito</p>';
            });

            lyricsBtn.addEventListener('click', async () => {
                lyricsModal.style.display = 'flex';
                try {
                    const s = playlist[musicIndex];
                    const res = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(s.artist)}/${encodeURIComponent(s.displayName)}`);
                    const d = await res.json();
                    lyricsContent.textContent = d.lyrics || 'Letra não encontrada.';
                } catch {
                    lyricsContent.textContent = 'Erro ao carregar letra.';
                }
            });

            playlistBtn.addEventListener('click', () => {
                playlistModal.style.display = 'flex';
                renderPlaylist();
            });

            uploadBtn.addEventListener('click', () => fileUpload.click());
            fileUpload.addEventListener('change', e => {
                [...e.target.files].forEach(file => {
                    if (!file.type.startsWith('audio/')) return;
                    playlist.push({
                        path: URL.createObjectURL(file),
                        displayName: file.name.replace(/\.[^/.]+$/, ""),
                        cover: 'https://via.placeholder.com/300?text=Upload',
                        artist: 'Você',
                        favorite: false
                    });
                });
                renderPlaylist();
                showToast(`✅ ${e.target.files.length} música(s) adicionada(s)!`);
                e.target.value = '';
            });

            searchInput.addEventListener('input', filterSongs);

            [closeFavorites, closeLyrics, closePlaylist].forEach(btn =>
                btn.addEventListener('click', () => btn.closest('.modal').style.display = 'none')
            );

            // Fecha os modais ao clicar fora, mas não mexe no mini player
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
});
            shuffleBtn.addEventListener('click', toggleShuffle);
            repeatBtn.addEventListener('click', toggleRepeat);

            volumeSlider.addEventListener('input', () => {
                const v = volumeSlider.value / 100;
                music.volume = v;
                volumeIcon.className = v === 0 ? 'fas fa-volume-mute' : v < 0.5 ? 'fas fa-volume-down' : 'fas fa-volume-up';
            });

            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('light-theme');
                themeToggle.className = document.body.classList.contains('light-theme') ? 'fas fa-sun' : 'fas fa-moon';
            });

            miniPlay.addEventListener('click', togglePlay);
            miniPrev.addEventListener('click', prevSong);
            miniNext.addEventListener('click', nextSong);
        }

        // Web Audio API para equalizador
        const source = audioCtx.createMediaElementSource(music);
        const analyser = audioCtx.createAnalyser();
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        analyser.fftSize = 64;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                togglePlay();
            } else if (e.code === 'ArrowRight') {
                nextSong();
            } else if (e.code === 'ArrowLeft') {
                prevSong();
            }
        });

        music.addEventListener('play', () => {
            updateMiniPlayer();
            setTimeout(() => {
                miniPlayer.style.display = 'flex';
                miniPlayer.classList.add('show');
            }, 500);
        });

        loadMusic(playlist[musicIndex]);
        setupEventListeners();
        renderPlaylist();
        animateEqualizer();
    }
});
