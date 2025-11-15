// Inicialização de partículas musicais para fundo da tela de carregamento
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = Math.min(100, Math.floor(window.innerWidth / 10));

    // Ícones musicais para usar
    const musicIcons = ['♪', '♫', '♩', '♬', '♭', '♮', '♯'];
    const iconSize = [13, 15, 16, 18];

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = iconSize[Math.floor(Math.random() * iconSize.length)];
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.icon = musicIcons[Math.floor(Math.random() * musicIcons.length)];
            this.color = `rgba(255, 46, 99, ${Math.random() * 0.4 + 0.1})`;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;
            if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
            if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.font = `${this.size}px Arial`;
            ctx.fillStyle = this.color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.icon, 0, 0);
            ctx.restore();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}
document.addEventListener('DOMContentLoaded', () => {
    // Iniciar partículas
    initParticles();

    // === TOKEN DO SPOTIFY ===
   let SPOTIFY_ACCESS_TOKEN = 'BQAPJFs5PU1JINZbr5LsS7jtr6dy3YX4LIDLe13XJqcnwjbwkfiUIkSLNzQPOKgR2ANf8ZcIzudc5_efkIPolYLwdcR9nweqMfFfa6HpyLQobkFzgLlN4UVkG4Fq527W49QkIK6e3NE';;
    let spotifyPlayer = null;
    let isSpotifyPlaying = false;
    let isTokenValid = true;

    // === FUNÇÃO TOAST (PRIMEIRO) ===
    function showToast(msg) {
        const t = document.createElement('div');
        t.className = 'toast';
        t.textContent = msg;
        document.body.appendChild(t);
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 2000);
        setTimeout(() => t.remove(), 2300);
    }

    // === ESQUECEU A SENHA? ===
    document.querySelector('.forgot-password-large').addEventListener('click', (e) => {
        e.preventDefault();
        const username = prompt('Digite seu nome de usuário:');
        if (!username) return;

        const users = JSON.parse(localStorage.getItem('nyxwave_users') || '{}');
        const password = users[username];

        if (password) {
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.innerHTML = `
                <strong>${username}</strong><br>
                Senha: <code style="color:#ff2e63; background:rgba(0,0,0,0.3); padding:2px 6px; border-radius:4px;">${password}</code>
            `;
            document.body.appendChild(toast);
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2500);
            setTimeout(() => toast.remove(), 2800);

            document.getElementById('username').value = username;
            document.getElementById('password').value = password;
        } else {
            showToast('Usuário não encontrado.');
        }
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });

    const introScreen = document.getElementById('intro-screen');
    const loginScreen = document.getElementById('login-screen');
    const appContainer = document.getElementById('app-container');
    const overlay = document.getElementById('overlay');

    // === TELA DE CADASTRO ===
    const signupScreen = document.createElement('div');
    signupScreen.id = 'signup-screen';
    signupScreen.innerHTML = `
        <div class="login-container-large">
            <div class="login-left-large">
                <div class="logo-center">
                    <img src="assets/nyxwave-logo-transparent.png" alt="NyxWave Logo" class="nyxwave-logo-full">
                </div>
                <div class="welcome-text-large">
                    <h2>Crie sua Conta</h2>
                    <p>NyxWave High Quality</p>
                </div>
            </div>
            <div class="login-right-large">
                <h2><i class="fas fa-user-plus"></i> Registrar</h2>
                <form id="signup-form">
                    <div class="input-group-large">
                        <i class="fas fa-user"></i>
                        <input type="text" id="new-username" placeholder="Nome de usuário" autocomplete="off" required minlength="3">
                    </div>
                    <div class="input-group-large password-group-large">
                        <i class="fas fa-key"></i>
                        <input type="password" id="new-password" placeholder="Senha" required minlength="4">
                        <button type="button" id="toggle-signup-password" class="toggle-btn-large">
                            <i class="far fa-eye"></i>
                        </button>
                    </div>
                    <div class="input-group-large password-group-large">
                        <i class="fas fa-key"></i>
                        <input type="password" id="confirm-password" placeholder="Confirmar senha" required>
                        <button type="button" id="toggle-confirm-password" class="toggle-btn-large">
                            <i class="far fa-eye"></i>
                        </button>
                    </div>
                    <button type="submit">Criar Conta</button>
                    <p id="signup-error" class="error-message"></p>
                    <div class="signup-link">
                        <a href="#" id="back-to-login">Já tem conta? Entrar</a>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(signupScreen);

    // === FUNÇÕES DE USUÁRIO ===
    function getUsers() {
        return JSON.parse(localStorage.getItem('nyxwave_users') || '{}');
    }
    function saveUsers(users) {
        localStorage.setItem('nyxwave_users', JSON.stringify(users));
    }
    function savePlaybackStats(username, songPath) {
        const key = `nyxwave_playback_${username}`;
        const stats = JSON.parse(localStorage.getItem(key) || '{}');
        stats[songPath] = (stats[songPath] || 0) + 1;
        localStorage.setItem(key, JSON.stringify(stats));
    }
    function getPlaybackStats(username) {
        const key = `nyxwave_playback_${username}`;
        return JSON.parse(localStorage.getItem(key) || '{}');
    }

    // === RESTAURAR USUÁRIO ===
    const savedUser = localStorage.getItem('musicPlayerUser');
    if (savedUser) {
        document.getElementById('username').value = savedUser;
        document.getElementById('remember').checked = true;
    }

    // === TOGGLE SENHAS ===
    document.getElementById('toggle-password').addEventListener('click', () => {
        const input = document.getElementById('password');
        const btn = document.getElementById('toggle-password');
        const type = input.type === 'password' ? 'text' : 'password';
        input.type = type;
        btn.innerHTML = type === 'password' ? '<i class="far fa-eye"></i>' : '<i class="far fa-eye-slash"></i>';
    });

    document.addEventListener('click', (e) => {
        if (e.target.closest('#toggle-signup-password')) {
            const input = document.getElementById('new-password');
            const btn = e.target.closest('button');
            const type = input.type === 'password' ? 'text' : 'password';
            input.type = type;
            btn.innerHTML = type === 'password' ? '<i class="far fa-eye"></i>' : '<i class="far fa-eye-slash"></i>';
        }
        if (e.target.closest('#toggle-confirm-password')) {
            const input = document.getElementById('confirm-password');
            const btn = e.target.closest('button');
            const type = input.type === 'password' ? 'text' : 'password';
            input.type = type;
            btn.innerHTML = type === 'password' ? '<i class="far fa-eye"></i>' : '<i class="far fa-eye-slash"></i>';
        }
    });

    // === NAVEGAÇÃO ===
    document.getElementById('show-signup').addEventListener('click', (e) => {
        e.preventDefault();
        loginScreen.classList.remove('active');
        setTimeout(() => {
            signupScreen.classList.add('active');
            overlay.classList.add('active');
        }, 300);
    });

    document.addEventListener('click', (e) => {
        if (e.target.id === 'back-to-login') {
            e.preventDefault();
            signupScreen.classList.remove('active');
            setTimeout(() => {
                loginScreen.classList.add('active');
                overlay.classList.add('active');
            }, 300);
        }
    });

    // === CADASTRO ===
    document.addEventListener('submit', (e) => {
        if (e.target.id === 'signup-form') {
            e.preventDefault();
            const un = document.getElementById('new-username').value.trim();
            const pw = document.getElementById('new-password').value;
            const cp = document.getElementById('confirm-password').value;
            const err = document.getElementById('signup-error');

            if (pw !== cp) return err.textContent = 'As senhas não coincidem.';
            if (getUsers()[un]) return err.textContent = 'Usuário já existe.';

            saveUsers({ ...getUsers(), [un]: pw });
            err.textContent = 'Conta criada com sucesso!';
            setTimeout(() => {
                document.getElementById('username').value = un;
                document.getElementById('login-error').textContent = '';
                signupScreen.classList.remove('active');
                overlay.classList.remove('active');
                setTimeout(() => {
                    loginScreen.classList.add('active');
                    overlay.classList.add('active');
                }, 300);
            }, 1200);
        }
    });

    // === LOGIN ===
    document.addEventListener('submit', (e) => {
        if (e.target.id === 'login-form') {
            e.preventDefault();
            const un = document.getElementById('username').value.trim();
            const pw = document.getElementById('password').value;
            const users = getUsers();

            if (users[un] && users[un] === pw) {
                if (document.getElementById('remember').checked) {
                    localStorage.setItem('musicPlayerUser', un);
                } else {
                    localStorage.removeItem('musicPlayerUser');
                }
                loginScreen.classList.remove('active');
                overlay.classList.remove('active');
                setTimeout(() => {
                    appContainer.style.display = 'block';
                    initPlayer(un);
                }, 300);
            } else {
                document.getElementById('login-error').textContent = 'Usuário ou senha inválidos.';
                const form = document.getElementById('login-form');
                form.style.animation = 'none';
                void form.offsetWidth;
                form.style.animation = 'shake 0.5s';
                setTimeout(() => form.style.animation = '', 500);
            }
        }
    });

    // === ANIMAÇÃO INICIAL ===
    setTimeout(() => {
        introScreen.classList.add('hidden');
        setTimeout(() => {
            loginScreen.classList.add('active');
            overlay.classList.add('active');
        }, 1000);
    }, 4000);

    // === PLAYER ===
    function initPlayer(loggedUser) {
        const music = new Audio();
        let playlist = [
            { path: 'assets/1.mp3', displayName: 'Billie Jean', cover: 'assets/1.jpg', artist: 'HoodTrap Remix', favorite: false },
            { path: 'assets/2.mp3', displayName: 'Falling Down', cover: 'assets/2.jpg', artist: 'Xxtentacion', favorite: false },
            { path: 'assets/3.mp3', displayName: 'Gods Creation', cover: 'assets/3.jpg', artist: 'Daniel', favorite: false },
            { path: 'assets/4.mp3', displayName: 'Abyss (from Kaiju No. 8)', cover: 'assets/4.jpg', artist: 'YUNGBLUD', favorite: false },
            { path: 'assets/5.mp3', displayName: 'Gods Plan', cover: 'assets/5.jpg', artist: 'Drake', favorite: false },
            { path: 'assets/6.mp3', displayName: 'OQQELESVAOFALAR?', cover: 'assets/6.jpg', artist: 'Teto', favorite: false },
        ];
        let musicIndex = 0;
        let isPlaying = false;
        let isShuffle = false;
        let isRepeat = false;
        let lastPlayedSongPath = null;
        let userInteracted = false;

        // Elementos do DOM
        const cover = document.getElementById('cover');
        const title = document.getElementById('music-title');
        const artist = document.getElementById('music-artist');
        const playBtn = document.getElementById('play');
        const miniPlayer = document.getElementById('mini-player');
        const miniPlay = document.getElementById('mini-play');
        const miniPrev = document.getElementById('mini-prev');
        const miniNext = document.getElementById('mini-next');
        const prevBtn = document.getElementById('prev');
        const nextBtn = document.getElementById('next');
        const favoriteToggle = document.getElementById('favorite-toggle');
        const favoritesBtn = document.getElementById('favorites-btn');
        const lyricsBtn = document.getElementById('lyrics-btn');
        const playlistBtn = document.getElementById('playlist-btn');
        const uploadBtn = document.getElementById('upload-btn');
        const fileUpload = document.getElementById('file-upload');
        const searchInput = document.getElementById('search-input');
        const volumeSlider = document.getElementById('volume');
        const volumeIcon = document.getElementById('volume-icon');
        const shuffleBtn = document.getElementById('shuffle');
        const repeatBtn = document.getElementById('repeat');
        const themeToggle = document.getElementById('theme-toggle');
        const themeNeon = document.getElementById('theme-neon');
        const equalizerEl = document.getElementById('equalizer');
        const playerProgress = document.getElementById('player-progress');
        const progress = document.getElementById('progress');
        const currentTimeEl = document.getElementById('current-time');
        const durationEl = document.getElementById('duration');
        const bgImg = document.getElementById('bg-img');

        const favoritesModal = document.getElementById('favorites-modal');
        const lyricsModal = document.getElementById('lyrics-modal');
        const playlistModal = document.getElementById('playlist-modal');
        const profileModal = document.getElementById('profile-modal');
        const closeFavorites = document.getElementById('close-favorites');
        const closeLyrics = document.getElementById('close-lyrics');
        const closePlaylist = document.getElementById('close-playlist');
        const closeProfile = document.getElementById('close-profile');
        const favoritesList = document.getElementById('favorites-list');
        const playlistList = document.getElementById('playlist-list');
        const profileContent = document.getElementById('profile-content');
        const lyricsContent = document.getElementById('lyrics-content');
        const lyricsTitle = document.getElementById('lyrics-title');

        const usernameDisplay = document.getElementById('username-display');
        const playCountEl = document.getElementById('play-count');

        // === SLEEP TIMER ===
let sleepTimer = null;
const setSleepTimerBtn = document.getElementById('set-sleep-timer');
const cancelSleepTimerBtn = document.getElementById('cancel-sleep-timer');
const sleepTimerInput = document.getElementById('sleep-timer');

setSleepTimerBtn.onclick = () => {
    const minutes = parseInt(sleepTimerInput.value);
    if (isNaN(minutes) || minutes <= 0) {
        showToast('Tempo inválido.');
        return;
    }

    if (sleepTimer) clearTimeout(sleepTimer);

    const timeInMs = minutes * 60 * 1000;
    sleepTimer = setTimeout(() => {
        if (isPlaying) togglePlay(); // Pausar se estiver tocando
        showToast(`Timer de sono ativado. Parando em ${minutes} minutos.`);
        sleepTimer = null; // Limpar referência
    }, timeInMs);

    showToast(`Timer de sono definido para ${minutes} minutos.`);
};

cancelSleepTimerBtn.onclick = () => {
    if (sleepTimer) {
        clearTimeout(sleepTimer);
        sleepTimer = null;
        showToast('Timer de sono cancelado.');
    } else {
        showToast('Nenhum timer ativo.');
    }
};

        // === BUSCA LOCAL (SEM YOUTUBE) ===
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
                playlistList.innerHTML = '<p style="text-align:center;color:#aaa;padding:20px;">Nenhuma música encontrada</p>';
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
                        playlistModal.style.display = 'none';
                        searchInput.value = '';
                    }
                });
                playlistList.appendChild(item);
            });
        }

        // === BUSCA NO SPOTIFY ===
        async function searchSpotify() {
            const query = searchInput.value.trim();
            if (!query) return;

            try {
                const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`, {
                    headers: { 'Authorization': `Bearer ${SPOTIFY_ACCESS_TOKEN}` }
                });
                if (!response.ok) {
                    if (response.status === 401) {
                        showToast('Token do Spotify expirado ou inválido.');
                        isTokenValid = false;
                    } else {
                        showToast('Erro ao buscar no Spotify.');
                    }
                    return;
                }
                const data = await response.json();
                const tracks = data.tracks.items;

                playlistModal.style.display = 'flex';
                playlistList.innerHTML = '';

                tracks.forEach(track => {
                    const item = document.createElement('div');
                    item.className = 'music-item';
                    item.innerHTML = `
                        <img src="${track.album.images[0]?.url || 'https://via.placeholder.com/50?text=Capa'}">
                        <div class="music-info">
                            <h4>${track.name}</h4>
                            <p>${track.artists[0].name}</p>
                        </div>
                    `;
                    item.onclick = () => {
                        const song = {
                            path: track.uri,
                            displayName: track.name,
                            artist: track.artists[0].name,
                            cover: track.album.images[0]?.url || 'https://via.placeholder.com/300?text=Capa',
                            favorite: false
                        };
                        playlist.push(song);
                        musicIndex = playlist.length - 1;
                        loadMusic(playlist[musicIndex]);
                        togglePlay();
                        playlistModal.style.display = 'none';
                        searchInput.value = '';
                    };
                    playlistList.appendChild(item);
                });
            } catch (e) {
                showToast('Erro ao buscar no Spotify.');
                console.error(e);
            }
        }

        function updateProfileDisplay() {
            if (loggedUser) {
                usernameDisplay.textContent = loggedUser;
                const stats = getPlaybackStats(loggedUser);
                const totalPlays = Object.values(stats).reduce((a, b) => a + b, 0);
                playCountEl.textContent = `${totalPlays} música${totalPlays !== 1 ? 's' : ''}`;
            } else {
                usernameDisplay.textContent = 'Convidado';
                playCountEl.textContent = '0 músicas';
            }
        }

        // Equalizer
        const colors = ['#ff0000','#ff4000','#ff8000','#ffbf00','#ffff00','#bfff00','#80ff00','#40ff00','#00ff00','#00ff40','#00ff80','#00ffbf','#00ffff','#00bfff','#0080ff','#0040ff','#0000ff','#4000ff','#8000ff','#bf00ff','#ff00ff','#ff00bf','#ff0080','#ff0040'];
        for (let i = 0; i < 32; i++) {
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.backgroundColor = colors[i % colors.length];
            equalizerEl.appendChild(bar);
        }
        const bars = equalizerEl.querySelectorAll('.bar');

        let audioCtx, analyser, dataArray;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
            const source = audioCtx.createMediaElementSource(music);
            analyser = audioCtx.createAnalyser();
            source.connect(analyser);
            analyser.connect(audioCtx.destination);
            analyser.fftSize = 64;
            const bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);
        } catch (e) { console.error(e); }

        function loadMusic(song) {
            // Remover iframe do YouTube, se existir
            if (window.currentYoutube) {
                window.currentYoutube.remove();
                window.currentYoutube = null;
            }

            // Se for uma música do Spotify
            if (song.path.startsWith('spotify:')) {
                if (spotifyPlayer) {
                    spotifyPlayer.activateElement().then(() => {
                        spotifyPlayer.play({ uris: [song.path] }).then(() => {
                            isSpotifyPlaying = true;
                            isPlaying = true;
                            title.textContent = song.displayName;
                            artist.textContent = song.artist;
                            cover.src = song.cover || 'https://via.placeholder.com/300?text=Capa';
                            bgImg.src = song.cover || 'https://via.placeholder.com/1920?text=Fundo';
                            updateMiniPlayer();
                        });
                    }).catch(e => {
                        showToast('Erro ao tocar no Spotify. Verifique se você está logado.');
                        console.error(e);
                    });
                } else {
                    showToast('Player do Spotify não está conectado. Verifique se o token é válido.');
                }
            } else {
                // Música local
                music.src = song.path;
                title.textContent = song.displayName;
                artist.textContent = song.artist;
                cover.src = song.cover || 'https://via.placeholder.com/300?text=Capa';
                bgImg.src = song.cover || 'https://via.placeholder.com/1920?text=Fundo';
                favoriteToggle.innerHTML = song.favorite ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
                lyricsTitle.textContent = `Letra: ${song.displayName}`;
                updateMiniPlayer();
            }
        }

        function updateMiniPlayer() {
            const song = playlist[musicIndex];
            if (!song) return;
            document.getElementById('mini-cover').src = song.cover || 'https://via.placeholder.com/50';
            document.getElementById('mini-title').textContent = song.displayName;
            document.getElementById('mini-artist').textContent = song.artist;
            miniPlay.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
        }

        function togglePlay() {
            userInteracted = true;
            if (isPlaying) {
                if (isSpotifyPlaying && spotifyPlayer) {
                    spotifyPlayer.pause();
                    isSpotifyPlaying = false;
                } else {
                    music.pause();
                }
            } else {
                if (isSpotifyPlaying && spotifyPlayer) {
                    spotifyPlayer.resume();
                    isSpotifyPlaying = true;
                } else {
                    music.play().catch(() => {
                        showToast('Clique em Play novamente para ativar o som!');
                    });
                    if (audioCtx) audioCtx.resume();
                }
            }
            isPlaying = !isPlaying;
            playBtn.className = isPlaying ? 'fas fa-pause play-button' : 'fas fa-play play-button';
            miniPlay.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
        }

        function nextSong() {
            let newIndex = musicIndex;
            if (isShuffle && playlist.length > 1) {
                do { newIndex = Math.floor(Math.random() * playlist.length); }
                while (newIndex === musicIndex);
            } else {
                newIndex = (musicIndex + 1) % playlist.length;
            }
            musicIndex = newIndex;
            loadMusic(playlist[musicIndex]);
            if (isPlaying) togglePlay();
        }

        function prevSong() {
            let newIndex = musicIndex;
            if (isShuffle && playlist.length > 1) {
                do { newIndex = Math.floor(Math.random() * playlist.length); }
                while (newIndex === musicIndex);
            } else {
                newIndex = (musicIndex - 1 + playlist.length) % playlist.length;
            }
            musicIndex = newIndex;
            loadMusic(playlist[musicIndex]);
            if (isPlaying) togglePlay();
        }

        function updateProgress() {
            if (isNaN(music.duration)) return;
            const pct = (music.currentTime / music.duration) * 100;
            progress.style.width = `${pct}%`;
            const fmt = t => `${Math.floor(t/60)}:${(Math.floor(t%60)).toString().padStart(2,'0')}`;
            currentTimeEl.textContent = fmt(music.currentTime);
            durationEl.textContent = fmt(music.duration);
        }

        function setProgress(e) {
            const rect = playerProgress.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            music.currentTime = (clickX / rect.width) * music.duration;
        }

        function renderPlaylist() {
            playlistList.innerHTML = '';
            if (playlist.length === 0) {
                playlistList.innerHTML = '<p style="text-align:center;color:#aaa;padding:20px;">Nenhuma música na playlist.</p>';
                return;
            }
            playlist.forEach((song, i) => {
                const item = document.createElement('div');
                item.className = `music-item ${i === musicIndex ? 'active' : ''}`;
                item.innerHTML = `
                    <img src="${song.cover || 'https://via.placeholder.com/50?text=Capa'}">
                    <div class="music-info">
                        <h4>${song.displayName}</h4>
                        <p>${song.artist}</p>
                    </div>
                `;
                item.onclick = () => {
                    musicIndex = i;
                    loadMusic(song);
                    togglePlay();
                    playlistModal.style.display = 'none';
                };
                playlistList.appendChild(item);
            });
        }

        // === CONTROLES ===
        playBtn.onclick = togglePlay;
        prevBtn.onclick = prevSong;
        nextBtn.onclick = nextSong;
        miniPlay.onclick = togglePlay;
        miniPrev.onclick = prevSong;
        miniNext.onclick = nextSong;
        playerProgress.onclick = setProgress;
        music.ontimeupdate = updateProgress;
        music.onended = () => isRepeat ? music.play() : nextSong();

        favoriteToggle.onclick = () => {
            playlist[musicIndex].favorite = !playlist[musicIndex].favorite;
            favoriteToggle.innerHTML = playlist[musicIndex].favorite ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
            showToast(playlist[musicIndex].favorite ? 'Adicionado aos favoritos!' : 'Removido dos favoritos');
        };

        favoritesBtn.onclick = () => {
            favoritesModal.style.display = 'flex';
            const favs = playlist.filter(s => s.favorite);
            favoritesList.innerHTML = favs.length ? favs.map(s => {
                const idx = playlist.indexOf(s);
                return `
                    <div class="music-item">
                        <img src="${s.cover || 'https://via.placeholder.com/50'}">
                        <div class="music-info"><h4>${s.displayName}</h4><p>${s.artist}</p></div>
                    </div>
                `;
            }).join('') : '<p style="text-align:center;color:#aaa;padding:20px;">Nenhum favorito</p>';

            favoritesList.querySelectorAll('.music-item').forEach((item, i) => {
                item.onclick = () => {
                    musicIndex = playlist.indexOf(favs[i]);
                    loadMusic(playlist[musicIndex]);
                    togglePlay();
                    favoritesModal.style.display = 'none';
                };
            });
        };

        lyricsBtn.onclick = async () => {
            lyricsModal.style.display = 'flex';
            const s = playlist[musicIndex];
            try {
                const res = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(s.artist)}/${encodeURIComponent(s.displayName)}`);
                const d = await res.json();
                lyricsContent.textContent = d.lyrics || 'Letra não encontrada.';
            } catch {
                lyricsContent.textContent = 'Erro ao carregar letra.';
            }
        };

        playlistBtn.onclick = () => { playlistModal.style.display = 'flex'; renderPlaylist(); };
        uploadBtn.onclick = () => fileUpload.click();
        fileUpload.onchange = e => {
            let addedCount = 0;
            [...e.target.files].forEach(file => {
                if (file.type.startsWith('audio/')) {
                    const displayName = file.name.replace(/\.([^.]*)$/, "");
                    playlist.push({
                        path: URL.createObjectURL(file),
                        displayName: displayName,
                        cover: 'https://via.placeholder.com/300?text=Upload',
                        artist: 'Você',
                        favorite: false
                    });
                    addedCount++;
                }
            });
            renderPlaylist();
            showToast(`${addedCount} música(s) adicionada(s)!`);
            e.target.value = '';
        };

        // === BUSCA LOCAL / SPOTIFY ===
        searchInput.addEventListener('input', () => {
            if (searchInput.value.trim().length > 0) {
                filterSongs();
            } else {
                renderPlaylist();
            }
        });

        [closeFavorites, closeLyrics, closePlaylist, closeProfile].forEach(btn => {
            btn.onclick = () => btn.closest('.modal').style.display = 'none';
        });

        shuffleBtn.onclick = () => { isShuffle = !isShuffle; shuffleBtn.classList.toggle('active-control', isShuffle); };
        repeatBtn.onclick = () => { isRepeat = !isRepeat; repeatBtn.classList.toggle('active-control', isRepeat); };

        volumeSlider.oninput = () => {
            const v = volumeSlider.value / 100;
            music.volume = v;
            volumeIcon.className = v === 0 ? 'fas fa-volume-mute' : v < 0.5 ? 'fas fa-volume-down' : 'fas fa-volume-up';
        };

        // === TEMA NEON (ALTERADO) ===
        function setTheme(theme) {
            document.body.className = ''; // Limpa todos os temas
            if (theme === 'light') {
                document.body.classList.add('light-theme');
                themeToggle.className = 'fas fa-sun';
                themeNeon.classList.remove('active');
            } else if (theme === 'neon') {
                document.body.classList.add('neon-theme');
                themeNeon.className = 'fas fa-lightbulb active';
                themeToggle.className = 'fas fa-moon';
            } else {
                document.body.classList.remove('light-theme');
                themeToggle.className = 'fas fa-moon';
                themeNeon.classList.remove('active');
            }
        }

        themeToggle.onclick = () => {
            if (document.body.classList.contains('neon-theme')) {
                setTheme('dark'); // volta ao escuro
            } else if (document.body.classList.contains('light-theme')) {
                setTheme('neon');
            } else {
                setTheme('light');
            }
        };

        themeNeon.onclick = () => {
            if (document.body.classList.contains('neon-theme')) {
                setTheme('dark');
            } else {
                setTheme('neon');
            }
        };

        document.onkeydown = e => {
            if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
            else if (e.code === 'ArrowRight') nextSong();
            else if (e.code === 'ArrowLeft') prevSong();
        };

        music.onplay = () => {
            if (loggedUser && playlist[musicIndex].path !== lastPlayedSongPath) {
                savePlaybackStats(loggedUser, playlist[musicIndex].path);
                lastPlayedSongPath = playlist[musicIndex].path;
                updateProfileDisplay();
                renderTopSongs();
            }
            updateMiniPlayer();
            setTimeout(() => { miniPlayer.style.display = 'flex'; miniPlayer.classList.add('show'); }, 500);
            animateEqualizer();
        };

        document.getElementById('user-profile').onclick = () => {
            if (!loggedUser) return;
            const stats = getPlaybackStats(loggedUser);
            const total = Object.values(stats).reduce((a,b) => a+b, 0);
            profileContent.innerHTML = `<p>Olá, <strong>${loggedUser}</strong>!</p><p>Você ouviu <strong>${total}</strong> música${total !== 1 ? 's' : ''}!</p>`;
            profileModal.style.display = 'flex';
        };

        function renderTopSongs() {
            const section = document.getElementById('top-songs-section');
            const list = document.getElementById('top-songs-list');
            if (!loggedUser || !section) return;

            const stats = getPlaybackStats(loggedUser);
            const sorted = Object.entries(stats).sort((a,b) => b[1] - a[1]).slice(0, 5);
            if (sorted.length === 0) { section.style.display = 'none'; return; }

            section.style.display = 'block';
            list.innerHTML = sorted.map(([path, count]) => {
                const song = playlist.find(s => s.path === path) || { displayName: 'Desconhecida', artist: 'Você', cover: 'https://via.placeholder.com/300?text=?' };
                return `
                    <div class="top-song-item">
                        <img src="${song.cover}" alt="">
                        <div class="top-song-info">
                            <h4 title="${song.displayName}">${song.displayName}</h4>
                            <p>${song.artist}</p>
                        </div>
                        <div class="play-count-badge">${count}×</div>
                    </div>
                `;
            }).join('');
            list.querySelectorAll('.top-song-item').forEach((item, i) => {
                item.onclick = () => {
                    const path = sorted[i][0];
                    const idx = playlist.findIndex(s => s.path === path);
                    if (idx !== -1) {
                        musicIndex = idx;
                        loadMusic(playlist[idx]);
                        togglePlay();
                    }
                };
            });
        }

        function animateEqualizer() {
            if (!isPlaying) { 
                bars.forEach(b => b.style.height = '2px'); 
                requestAnimationFrame(animateEqualizer); 
                return; 
            }
            if (analyser) {
                analyser.getByteFrequencyData(dataArray);
                bars.forEach((b, i) => b.style.height = `${Math.max(2, dataArray[i] / 4)}px`);
            }
            requestAnimationFrame(animateEqualizer);
        }

        // === SPOTIFY WEB PLAYBACK SDK ===
        window.onSpotifyWebPlaybackSDKReady = () => {
            if (!isTokenValid) {
                showToast('Token do Spotify expirado ou inválido.');
                return;
            }

            spotifyPlayer = new Spotify.Player({
                name: 'NyxWave Player',
                getOAuthToken: cb => { cb(SPOTIFY_ACCESS_TOKEN); }
            });

            spotifyPlayer.on('ready', ({ device_id }) => {
                console.log('Spotify Player conectado!');
                showToast('Spotify Player conectado!');
            });

            spotifyPlayer.on('player_state_changed', state => {
                if (state && state.paused) {
                    isPlaying = false;
                    playBtn.className = 'fas fa-play play-button';
                    miniPlay.className = 'fas fa-play';
                } else if (state && !state.paused) {
                    isPlaying = true;
                    playBtn.className = 'fas fa-pause play-button';
                    miniPlay.className = 'fas fa-pause';
                }
            });

            spotifyPlayer.on('initialization_error', ({ message }) => {
                console.error('Erro de inicialização:', message);
                showToast('Erro ao inicializar Spotify Player: ' + message);
            });

            spotifyPlayer.on('authentication_error', ({ message }) => {
                console.error('Erro de autenticação:', message);
                showToast('Erro de autenticação com Spotify: ' + message);
                isTokenValid = false;
            });

            spotifyPlayer.on('account_error', ({ message }) => {
                console.error('Erro de conta:', message);
                showToast('Erro de conta do Spotify: ' + message);
            });

            spotifyPlayer.on('playback_error', ({ message }) => {
                console.error('Erro de reprodução:', message);
                showToast('Erro de reprodução: ' + message);
            });

            spotifyPlayer.connect();
        };

        // Carregar SDK do Spotify
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        document.head.appendChild(script);

        // Iniciar
        updateProfileDisplay();
        loadMusic(playlist[0]);
        renderPlaylist();
        renderTopSongs();
        animateEqualizer();
    }
});

// Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then((registration) => {
                console.log('SW registrado com sucesso:', registration.scope);
            })
            .catch((error) => {
                console.log('Erro ao registrar SW:', error);
            });
    });
}