var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);

const heading = $('#header h2')
const imgMS = $('.bgr__music') 
const audio = $('#audio')
const playBtn = $('.btn__play')
const player = $('.player')
const progress = $('#progress')
const timeEnd = $('.timeEnd')
const timeStart = $('.timeStart')
const volumn = $('.sound')
const btnNext = $('.btn_next')
const btnPrev = $('.btn_prev')
const btnRandom = $('.btn_random')
const btnRepeat = $('.btn_repeat')
const playList = $('.play__List')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Bông Hoa Đẹp Nhất',
            singer: 'Quân AP',
            path: './music/Bonghoadepnhat.mp3',
            image: './img/quanAP.jpg'
        },
        {
            name: 'Chạy Ngay Đi',
            singer: 'Sơn Tùng MTP',
            path: './music/ChayNgayDi.mp3',
            image: './img/st1.jpg'
        },
        {
            name: 'Bình Yên Nơi Đâu',
            singer: 'Sơn Tùng MTP',
            path: './music/BinhYenNoiDau.mp3',
            image: './img/st2.jpg'
        },
        {
            name: 'Phía Sau Một Cô Gái',
            singer: 'SooBin Hoàng Sơn',
            path: './music/PhiaSau1cogai.mp3',
            image: './img/Soobin.jpg'
        },
        {
            name: 'Đi để trở về',
            singer: 'SooBin Hoàng Sơn',
            path: './music/Didetrove.mp3',
            image: './img/sb2.jpg'
        },
        {
            name: 'Tại Vì Sao',
            singer: 'MCK',
            path: './music/TaiViSao-MCK-7963973.mp3',
            image: './img/MCK.jpg'
        }
    ],
    render: function(){
        const htmls = this.songs.map((song, index) =>{
            return `
             <div class="list__music ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
                 <div class="img__playList" style = "background-image: url('${song.image}') ">
                 </div>
                 <div class="list__name">
                     <div class="name name__song">${song.name}</div>
                     <div class="name name__singer">${song.singer}</div>
                 </div>
                 <div class="btn__list"><i class="ti-more-alt"></i></div>
             </div>
            `
        })
        playList.innerHTML = htmls.join('')
    },
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function(){
        const _this = this
        const cd = $('.img__music');
        const cdWidth = cd.offsetWidth;   
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newWidth = cdWidth - scrollTop;
            cd.style.width = newWidth > 0 ? newWidth + 'px': 0;
        },

        playList.onclick = function(e){
            const playNode = e.target.closest('.list__music:not(.active)')
            if(playNode|| e.target.closest('.btn__list')){
                if(playNode){
                    _this.currentIndex = parseInt((playNode.dataset.index))
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

                if(e.target.closest('.btn__list')){

                }
            }
        }

        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause();
            } else{
                audio.play();
            }
        }
        // biến dừng or quay ảnh khi bài hát chạy or dừng
        const imgMSamimate = imgMS.animate({
            transform: 'rotate(360deg)'
        },
        {
            duration: 10000,
            iterations: Infinity
        })

        // cố định ảnh khi reset sẽ k xoay
        imgMSamimate.pause();

        audio.onplay = function(){
            _this.isPlaying = true
            player.classList.add('playing')
            imgMSamimate.play()
        }
        
        audio.onpause = function(){
            _this.isPlaying = false
            player.classList.remove('playing')
            imgMSamimate.pause()
        }

        // khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                const crTime = audio.currentTime
                const udTime = formatTime(crTime)
                progress.value = progressPercent
                timeStart.innerHTML = udTime
            }
        }
        
        function formatTime(seconds){
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.floor(seconds % 60);
            return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        }

        // thời lượng bài hát
        audio.onloadedmetadata = function() {
            const duration = audio.duration;
            const formattedDuration = formatTime(duration);
            timeEnd.innerHTML = formattedDuration;
        }

        // xử lí khi tua xong(onchange: trỏ đến vị trí chuột kick)
        let isChange = false
        progress.onchange = function(e){
            if(!isChange){
                isChange = true
                const seekTime = audio.duration / 100 * e.target.value
                audio.currentTime = seekTime
                const thePresentTime = formatTime(seekTime)
                timeStart.innerHTML = thePresentTime
                setTimeout(()=>{
                    isChange = false
                },0)
            }
        }

        // xử lí loa
        volumn.onchange = function(e){
            const sound = e.target.value / 100
            audio.volume = sound
        }

        // next
        btnNext.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            } else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
        }

        // comeback
        btnPrev.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            } else{
                _this.prevSong()
            }
            audio.play()
            _this.render()
        }

        // xử lí khi click vào btn random
        btnRandom.onclick = function(){
            if(!_this.isRandom){
                _this.isRandom = true
                this.classList.add('random')
            } else{
                _this.isRandom = false
                this.classList.remove('random')
            }
            // nếu lỗi thì thay this bằng btnRandom
        }

        // xử lí khi click btn lặp lại bài hát
        btnRepeat.onclick = function(){
            if(_this.isRepeat){
                _this.isRepeat = false
                this.classList.remove('repeat')
            } else{
                _this.isRepeat = true
                this.classList.add('repeat')
            }
        }

        // tự chuyển bài sau khi kết thúc bài hát or hát lại bài hát
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            } else{
                btnNext.click()
            }
        }

        
    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        imgMS.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
          this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong();
    },
    playRandomSong: function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function(){
        // Lắng nghe, xử lí sự kiện (DOM Events)
        this.handleEvents();

        // Định nghĩa các thuộc tính cho Object
        this.defineProperties();

        // Tải thông tin bài hát đầu tiên cào UI khi chạy ứng dụng
        this.loadCurrentSong();

        // Render playList
        this.render();
    }
}

app.start()