const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playBtn = $(".btn-toggle-play");
const player = $(".player");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const btnRandom = $(".btn-random");
const btnRepeat = $(".btn-repeat");
const playList = $(".playlist");



const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "Damn",
            singer: "Raftaar x kr$na",
            path:
              "./assets/music/music1.mp3",
            image:
              "./assets/img/img1.jpg"
        },
        {
            name: "Damn",
            singer: "Raftaar x kr$na",
            path:
              "./assets/music/music2.mp3",
            image:
              "./assets/img/img2.jpg"
        },
        {
            name: "Damn",
            singer: "Raftaar x kr$na",
            path:
              "./assets/music/music3.mp3",
            image:
              "./assets/img/img3.jpg"
        },
        {
            name: "Damn",
            singer: "Raftaar x kr$na",
            path:
              "./assets/music/music4.mp3",
            image:
              "./assets/img/img4.jpg"
        },
        {
            name: "Damn",
            singer: "Raftaar x kr$na",
            path:
              "./assets/music/music4.mp3",
            image:
              "./assets/img/img4.jpg"
        },
        {
            name: "Damn",
            singer: "Raftaar x kr$na",
            path:
              "./assets/music/music4.mp3",
            image:
              "./assets/img/img4.jpg"
        },
        {
          name: "Damn",
          singer: "Raftaar x kr$na",
          path:
            "./assets/music/music4.mp3",
          image:
            "./assets/img/img4.jpg"
      },
      {
          name: "Damn",
          singer: "Raftaar x kr$na",
          path:
            "./assets/music/music4.mp3",
          image:
            "./assets/img/img4.jpg"
      },

    ],

    defineProperties: function() {
        Object.defineProperty(this, "currentSong", {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },

    render: function() {
        const html = this.songs.map((song, index) => {
            return`
            <div class="song ${index === this.currentIndex ? "active" : ""}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
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

        playList.innerHTML = html.join(" ")
    },
    
    handleEvent: function() {
        
        const cdWidth = cd.offsetWidth;
        const _this = this;

        // Xu ly cd quay 
        const cdThumbAnimate = cdThumb.animate([{ transform: 'rotate(360deg)' }], {
          duration: 10000,
          iterations: Infinity
        })

        cdThumbAnimate.pause()

        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ?  newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };
        
        playBtn.onclick = function() { 
            if(_this.isPlaying) {
                audio.pause()
            } else {
                audio.play();
            }

            audio.onplay = function() {
                _this.isPlaying = true;
                player.classList.add("playing");
                cdThumbAnimate.play();
            }
            audio.onpause = function() {
                _this.isPlaying = false;
                player.classList.remove("playing");
                cdThumbAnimate.pause();
            }
        }

        // khi tien do bai hat thay doi
        audio.ontimeupdate = function() {
        if(audio.duration) {
          const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
          progress.value = progressPercent;
        }
        
        }
          progress.onchange = function(e) {
          const seekTime = (audio.duration / 100) * e.target.value;
          audio.currentTime = seekTime
        }

        //  Next song
        nextBtn.onclick = function() {
          if(_this.isRandom) {
            _this.playRandomSong();
          } else {
             _this.nextSongs();
          }
            audio.play()
            _this.render();
            _this.scrollToActiveSong();
            player.classList.add("playing");
        }
        //  Prev song
        prevBtn.onclick = function() {
          if(_this.isRandom) {
            _this.playRandomSong();
          } else {
             _this.prevSongs();
          }
          audio.play();
          _this.render();
          _this.scrollToActiveSong();
          player.classList.add("playing");

        }

        // Random bai hat
        btnRandom.onclick = function() {
          _this.isRandom = !_this.isRandom;
          btnRandom.classList.toggle("active", _this.isRandom);
        }

        // Xu ly load lai bai hat khi bai hat ket thuc
        btnRepeat.onclick = function(e) {
          _this.isRepeat = !_this.isRepeat;
          btnRepeat.classList.toggle("active", _this.isRepeat);
        }

        // Xu ly next bai hat moi khi ket thuc
        audio.onended = function() {
          if (_this.isRepeat) {
            audio.play()
          } else {
            nextBtn.click();
          }
          
        }
        // click vào playlist 
        playList.onclick = function(e) {
          const songNode = e.target.closest(".song:not(.active)")
          if(songNode || e.target.closest(".option")) {
            if(songNode) {
              _this.currentIndex = Number(songNode.dataset.index);
              _this.loadCurrentSong();
              _this.render();
              audio.play();
            }
            if(e.target.closest(".option")) {
              
            }
          }
        }

  
    },

    scrollToActiveSong: function() {
      setTimeout(() => {
        $(".song.active").scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        })
      }, 300);
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url("${this.currentSong.image}")`;
        audio.src = this.currentSong.path;
    },

    nextSongs: function() {
      this.currentIndex++
      if(this.currentIndex >= this.songs.length) {
        this.currentIndex = 0
      }
      this.loadCurrentSong();

    },
    prevSongs: function() {
      this.currentIndex--
      if(this.currentIndex < 0) {
        this.currentIndex = this.songs.length - 1
      }
      this.loadCurrentSong();
    },

    playRandomSong: function() {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * this.songs.length );
        console.log(this.currentIndex);
      } while (newIndex === this.currentIndex);
      this.currentIndex = newIndex;
      this.loadCurrentSong();
    },

    start: function() {
        // Dinh nghia cac thuoc tinh cho object
        this.defineProperties();

        this.handleEvent();

        this.loadCurrentSong();

        this.render();
        
    },
} 

app.start();