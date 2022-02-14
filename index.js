const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play')
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const PLAYER_STORAGE_KEY = 'LAYER';

const app = {
    currentIndex: 0,
    isPlay: false,
    isRandom: false,
    isRepeat: false,
    isTimeupdate: true,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY) || '{}'),
    songs: [
        {
            name: "Nevada",
            singer: "Vicetone",
            path: "/music/Nevada.mp3",
            image: "/img/song/Nevada.jpg"
        },
        {
            name: "Summertime ",
            singer: "K-391",
            path: "/music/Summertime.mp3",
            image: "/img/song/Summertime.jpg"
        },
        {
            name: "Reality",
            singer: "Lost Frequencies",
            path: "/music/Reality.mp3",
            image: "/img/song/Reality.jpg"
        },
        {
            name: "Đưa Nhau Đi Trốn",
            singer: "Đen ft Linh Cáo",
            path: "/music/Duanhauditron.mp3",
            image: "/img/song/Duanhauditron.jpg"
        },
        {
            name: "Lối Nhỏ",
            singer: "Đen ft Phương Anh Đào",
            path: "/music/Loinho.mp3",
            image: "/img/song/Loinho.jpg"
        },
        {
            name: "Đi Về Nhà",
            singer: "Đen Vâu, JustaTee",
            path: "/music/Divenha.mp3",
            image: "/img/song/Divenha.jpg"
        },
        {
            name: "Quên ",
            singer: "Khắc Việt",
            path: "/music/Quen.mp3",
            image: "/img/song/Quen.jpg"
        },
        {
            name: "Thì Thôi",
            singer: "Reddy",
            path: "/music/Thithoi.mp3",
            image: "/img/song/Thithoi.jpg"
        },
        {
            name: "Suýt Nữa Thì",
            singer: "Andiez",
            path: "/music/Suytnuathi.mp3",
            image: "/img/song/Suytnuathi.jpeg"
        },
        {
            name: "1 Phút",
            singer: "Andiez",
            path: "/music/1phut.mp3",
            image: "/img/song/1phut.jpg"
        },
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        });
    },
    handleEvent: function () {
        const cdWidth = cd.offsetWidth;
        const _this = this;

        // Xử lý CD xoay / dừng
        const cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ], {
            duration: 10000,
            iterations: Infinity,
        })
        cdThumbAnimate.pause();

        // Xử lý phóng to thu nhỏ
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // Xử lý khi click play pause
        playBtn.onclick = function () {
            if (_this.isPlay) {
                audio.pause();
            }
            else {
                audio.play();
            }
        }

        // Khi song được play
        audio.onplay = function () {
            cdThumbAnimate.play();
            _this.isPlay = true;
            player.classList.add('playing');
        }

        // Khi song được pause
        audio.onpause = function () {
            cdThumbAnimate.pause();
            _this.isPlay = false;
            player.classList.remove('playing');
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration && _this.isTimeupdate) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        // Xử lý khi tua
        progress.onchange = function () {
            const seekTime = progress.value * audio.duration / 100;
            audio.currentTime = seekTime;
            _this.isTimeupdate = true;
        }

        // Xử lý khi tawsts ontimeupdate khi tua
        progress.onmousedown = function () {
            _this.isTimeupdate = false;
        }

        // Xử lý next song 
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            }
            else {
                _this.nextSong();
            }
            audio.play();
        }

        // Xử lý prev song 
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            }
            else {
                _this.prevSong();
            }
            audio.play();
        }

        // Xử lý random
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);

        }

        // Xử lý next song khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            }
            else {
                nextBtn.onclick();
            }
        }

        // Xử lý repeat 
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        // Lắng nghe click vào playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode || e.target.closest('.option ')) {

                // Xử lý khi click vào song
                if (songNode) {
                    // songNode.dataset.index => chuỗi
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                    // _this.scrollToActiveSong();
                }

                // Xử lý khi click vào option
                if (e.target.closest('.option ')) {

                }
            }
        }
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
        if (this.isRandom) {
            randomBtn.classList.add('active', this.isRandom);
        }
        if (this.isRepeat) {
            repeatBtn.classList.add('active', this.isRandom);
        }
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
        this.render();
        this.scrollToActiveSong();
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
        this.render();
        this.scrollToActiveSong();
    },
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        }
        while (newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            });
        }, 300)
    },
    start: function () {

        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig();

        // Định nghĩa các thuộc tính cho object
        this.defineProperties();
        this.handleEvent();

        // Tải thông tin bài hát đầu tiên
        this.loadCurrentSong();
        this.render();
    }
};
app.start();