const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'F8_player'

const player = $('.player')
const playlist = $('.playlist')
const playBtn = $('.btn.btn-toggle-play')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('audio')
const progress = $('#progress')
const nextBtn = $('.btn.btn-next')
const prevBtn = $('.btn.btn-prev')
const randomBtn = $('.btn.btn-random')
const repeatBtn = $('.btn.btn-repeat')

app = {
    currentIndex: 0,
    lastIndexes: [],
    randomSongPlayedIndexes: [],
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songsApi: "http://localhost:3000/songs",
    setConfig(key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    songs: [
        {
            name: 'Stressed out',
            singer: 'Twenty one pilots',
            path: './assets/music/stressed_out.mp3',
            image: './assets/image/stressed_out.jpg'
        },
        {
            name: 'Nevada',
            singer: 'Vicetone',
            path: './assets/music/nevada.mp3',
            image: './assets/image/nevada.jpg'
        },
        {
            name: 'Thức giấc',
            singer: 'Dalab',
            path: './assets/music/thuc_giac.mp3',
            image: './assets/image/thuc_giac.jpg'
        },
        {
            name: 'Đổi thay',
            singer: 'Hồ Quang Hiếu',
            path: './assets/music/doi_thay.mp3',
            image: './assets/image/doi_thay.jpg'
        },
        {
            name: 'Thanh xuân',
            singer: 'Dalab',
            path: './assets/music/thanh_xuan.mp3',
            image: './assets/image/thanh_xuan.jpg'
        },
        {   
            name: 'Hey Jude',
            singer: 'The Beatles',
            path: 'https://x2convert.com/vi/Thankyou?token=U2FsdGVkX1%2f5mN3wkcd3DWpvMWWtoIRywzkmaJ1M4Ve4Vl2anjr1jwQesPKdCLiZnrYOHg0Q5Ubjypieh8dyvkyRCli2TxYzOJtXm1WfYQUYYhDvxhYmtqzW9SdBhg1f1KShM%2f9fyprzNYpeg4RWmw%3d%3d&s=youtube&id=&h=1773805896511784670',
            image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw8PDw0ODw8NDQ8NDQ0NDQ8NDQ8NDxAQFhEWFxUVFRUYHSggGBomGxUVITEhJTUrLi4uFx8zODMtNygtLisBCgoKDQwNDg8PGisdExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAKgBLAMBIgACEQEDEQH/xAAcAAEBAAIDAQEAAAAAAAAAAAAAAQIGAwUHBAj/xABMEAACAQMBAgcJCgwFBQAAAAAAAQIDBBESBSEGBxMxQVGRIlJhcXSBkqGxFCQyNDVCcnOywRYXIzNVgpOiwtHT8BUlU7PSVGKUo8P/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABURAQEAAAAAAAAAAAAAAAAAAAAB/9oADAMBAAIRAxEAPwDzLW++fay6n3z7WYrzdpX5t4CVSXNqfP1sa2ul9rMYrnMZPIF1vrl2sa31y9JmIAy1vrl6TJrfXL0mQAXXLrl6TKpPrl2siKBdb632snKPrl2sEwBlrl30u1k1vrfaxgjAqm+uXpMut9cu1mKKBlql30vSY1S76XpMxAGWqXfS9JjU++l6TMQBlrffS7WRzl1y9JkDAa5dcu1mSm++l2swKBkpvrl2sa31v0mYgDLU+uXaya31y7WQAZan30vSZNb65drIAMtUu+l6TJrffS7WQAZapd9L0mNT76XazEAZa31y7WXXLvpdrMCgZOcu+l6TGuXfS7WQgFSDWWUseZsDGfUcZWyAAAAAKARQAAAAAAAAAAKQACkAAAAAF/eQK0QYAAFIAKQqAEKyAAAAKQAZR5195lKO/czCL/vmGPP58AZMtbckkWnDO/oW84pvLAxAAAAAVFCAAAAAAAANs4DcD6e1VXXut29Sg4PR7nVXVTl85PWulYx4usDUwerfibX6Rf8A4S/qnl97CnGrVhRqOtSjUlGnVcFT5SKeNWnLwnva382H4EHCAdjLYdwrP/EHGPuVTVPXrjnXqUcaefnaA64HfPgdf67SnycNd9GpK1XLQ7tQp65dO7ud5lfcDL6ho5aFGGurTox980n3c3iKeHuywNfB3NTgvdxr3NtOFOFWzt3dXGqrCMIUUoty1cz3SR0yAAAAWPYQZAAFQEMiFAhCgCABgATIyBTlUsdXXzHEF5wPrUmqTe7MpYxu5j45HNWTUYrqOFgQAAAABkAAAAAAFAhv/EtNraFddErSSa68TizQDe+Jn5Sn5LV9qA9sqvEZvqjN9kWflS2+BD6EfYfqi6f5Or9VU+yz8r2/wIfQj7AOQ9K2TC0lwZkr2pXpW/u96pW0YzqJ8pDRhS3Yzg81Nqqbct3sCWzVObundK4UXSmoaeUi/h4xnEQPQrpQ/wAS4Jqm5OnyO0eTc0lJx9xPDaXTg0DjJtLSF7dVaFzUndzuk69J0XCNFqmnFqeO6w1HtO9lwzsPdWwK2uro2ZSu4XPvernM7Z046Vjuu6fQa3wruNm3FS8u6FxcVbi5rQnClO1nQpwj3Kk3Nre8LmA2nhteU5bNjtGDxW23bbOspR3ZjCk6lWtnxpRg/EeYGxbZ2xQq7M2TaU5TdazlcOunTlGK5R5WJPdLzGupAAAAKQACohUBQQoEBAAIykAgAAyQIhkDlrPm8SOE5q639nsOEAQpAKAAM0QAAAAAAAG9cTXylPyWr7UaKb1xN/KUvJav3Ae03PwKn1dRfus8A4HcB7naVsq1CtaQUGqU4VpVlNPSmn3MGsNP1Hv9f4E/oT9jPM+IiXvW7X/fbP8A9bA1DhRwGudm0YV69a0nGdVUoxoutKbk4t57qCWFp9aPg4L8HKu0qs6NGrQpThDlPy7qJSWcPGmLyei8d0ve1iuu5rPspr+Zq/FA/wDNF4bW4/hA+bbPAG4s52cbi6s4K9uVawlT5apobXwpJxj3OdKe/wCd4Dt3xQXmfjlm/wBSsmdpx2zajs3HRVuJdipnp0d+PDgDx98UF3/1tp4uRq+3JrPCLgbf7PWuvThOi3jl7ebq0k+hSylKPnWPCdjDhtfW20J1HcVatGF1UjUoVJaqcqWvDik+Z45muk9vnGnXpNNRqUq9PenzThJdPmYH554LcG6206lWjQqW9OpSpqq1cSqR1Q1YenRGXM3HOcfCRsf4pdpf62zv21x/RPu4B7Ldjwhu7XnjTtbqMH105ToTh+7g9J4TXE6VleVacnCpSt6k4SSTcZJbnv3AeUfil2l/rbO/bXH9I1LbuyKllcVLWrKlOpT06pUXKUN6ylmST9R21Lh/tZYfuycvBOlQa9UUdPtnaM7u4q3NRRU6zjKajnTlRUd3Z6wPhBQABSARgpABCkYEAAAFAHJX5/McRyVnvONgQpABQABkAgAAAAAAU3nic+UpeS1fuNFN54nPlKXktX7gPbKi7mX0Zew8v4h/i159K2/22eoz5n4n7Dy7iH+LXn07b/bkBzceH5nZ/wBdcfYgazxQ/KsfJbj+E2Xjw/M7P+uuPsQNb4oPlWPktx/CB3/Hiu52d9K69lM9RpfN8UTy7jy+Ds76V17KZ6jS+b4ogfmPa3xi58orfbZ77wCuXV2XYTe9+51B/qtxXqSPAtq/GLn6+t9tnuPFW87JtfBKqv3gPkq0dPCejLorbFnJ+GUasov1KBsvCS1nWs7yjTjrqVaE4QjlLMmtyy9yOivZL8I7KPTHY1y34nXwvYzYdtXrt7a4uFFTlRozqKMm0pNLmeAPEqXFztZvDtoQWMuU7ijpWOl4k32GqtYbXU2uxno9LjervdOyoaGmpaK89W9dGVg84k8uT65N9ryAIAAAAAMBgQjKRgQAAACgctfoOFvzH0TWUsdSb7DgwBCFYAAADJAIAAAAAAA3nic+U5eS1fuNGN64m/lKXktb7gPbGufxM8u4hn73vfpWr/ckeo/yPE+JXbMKFy7apJRjeUoRpttJcrHmWX1ptAbBx4fmdn/XXH2IGt8UC/zWPktx/Cek8YfBee0raFOlOFOtQq8rT5VPRLKxKMmt6zu34fMdJxccBbmwuKlzcyoOTpulSp0JTqc73ttxXVzAfBx4b1s1dLldf/I9Sp/N/VPG+M/aUbzadnaUWpq3qU7dtPKdarVipJPwdyvHk9lfP59wH5h2r8YufKK322e7cWlBw2TZZTTnGdR/rTZqt3xTzqXdSpK7hG2qVpVHFUZctpcs6c6sef1G6bf21bbJtIuWmOinydrQz3VRxWIpLqXSwNbtrtVeFVVLerfZkrfPhWmb7JVWvMbTww+Tr/yWr7Dy7inrTr7ZrV5tynO0u6tSXhlVo/zPV+EVnOvZ3dCnh1K1CcIJvCcmtyb6APzUujxFN5sOKnaU2uVnaW8d2Xyk68kvBFRSfadbxg7HoWFxb2dDLdK2U605b5VJzk2m+x4XQBrJAP5gAABckYZGAIymIAAqAiMsERkgOebxDG7O7sOCfQjknHPWcLAmRkMgFAAGSAQAAAAAAO32VwavLujUr21J1406vIzjBrlFLSpZw+dYZ6TxV8Ebi0nWu7qHIynTVGlSk054bzKUsc3Mlg1PgDw3p7LpVqVS3q1lWrcrqpVIxa7hRxpkt/Nz5Rs9xxwUMfkrG4lLmXLVqdNLx6dQG8cJtpxs7K6uZNLk6NTQspaqjWKcV4XJo/NMKa0qL3pRSed+cGxcKeF11tKUeWcYUoPVToUsqmn1vO+T8LOgwB3uz+GO1LeKp0r6voisRhV0V0l4HUTfmyXaHDPaleLhUva+iSxKNLk6Ca6s04qXrOiIBy2lxOjOnVoydKpSkp05xUW4SXM0mmjuvw32v+kLj0KH/A6AoHez4a7Waw9oXOH1KjF9qgmdLcV51ZupVqVK1SWFKpVnOrNrozKTbMEAPu2Tti6s5VJ2tedvKrGMKjhGnJyjFtpd1F453zHZfhztf9IV/wBnbf0zXwBsH4c7X/SFf9nb/wDA6faF/WuajrXFSVerJRi6k1FSaXMu5SWN7PnIBQAAAABkAAGJkQABgAEVY68EwXAH3zhmEZd73Pm517WfDM+tVFhLOOZPPT/fUcFxTw3uCR87BWiBQpCgZAiKAAAAAAAAAAAFIUARlM4U887UcpuOp4TwYxWfDub3ARPqIZrOM43ZxnwmIAAAACAUZIAKQpAAAAEZSZApCZLkDKG9iTEHhp9RPUByxOWT1Red7XM/uODJnGf3AfO2Q5KseldJxsAAAMkUwMkwKAAAAAAAAAAAAAyjLGd2crdnoICAUiAApAAAAAoIAAAAAACMhkAJgYKABCmIHIyAAZ8685xNEAEAAApABmgAAAAAAAAAAAAAAAAABSAAUgAAAAAAAAAAAAMBrHm6mmUAYsoAH//Z'
        },
        {
            name: 'Cancer (My Chemical Romance Cover)',
            singer: 'twenty one pilots',
            path: 'https://x2convert.com/vi/Thankyou?token=U2FsdGVkX19WScABRaXzZKcKunXE1MErhH%2bR8%2bZ4S9ieO9rovcsx1usiUInsYU8SlGBFzRae2Bkw7MS7xHbr5NLDCjqPZsyZqNNBK7s1suc8SGh1q%2bNY9a4xfgzxX8d3i7nZuXbALnmi2LroBso18%2bRBVjgO0jZIBN1%2fVf%2bkvZvVag4iOsaHB%2f2sR4VRJWWOttOxuipVWLsM%2fFT%2ft6VS%2bQ%3d%3d&s=youtube&id=&h=1773805896511784670',
            image: 'data:image/jpeg;base64,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'
        },
        {
            name: 'If',
            singer: 'Từ Vi',
            path: 'https://x2convert.com/vi/Thankyou?token=U2FsdGVkX1%2f82wewnigbGNTxlHftS82CgqCpZubDkmZ75S%2f8fIXkmTDLQytw8wWgACqX1eeC44NjDPKTfiUHEywToCMsW6LzgEtbdBrQLZM6cASkZ6XKg%2fFMRzLEQ93v2iBWAqC1pMWvXjfzig1new%3d%3d&s=youtube&id=&h=1773805896511784670',
            image: 'https://i.ytimg.com/vi/xIxmP8Rqk1E/hq720.jpg?sqp=-oaymwEcCOgCEMoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLApyfrSNr2djS5g_vugMvOmOUZ3Pw'
        },
        {
            name: 'Quẻ bói',
            singer: 'Thôi Tử Cách',
            path: 'https://x2convert.com/vi/Thankyou?token=U2FsdGVkX18wVkPSx9pxZG9DvCXumeZ4HgeVQyoSJdPqANu34sgVp%2b6D9Qk2YbHFLVf32kFrEYA2QSims0NmDOz%2btEGYqeQxZG2G5HcQhBpuSvl76qbLohdO7EpkUni3ExDhqYCFr91QEA7Oxii%2b8XyjTlHv%2bolzjbkXmAEqo4E%3d&s=youtube&id=&h=1773805896511784670',
            image: 'data:image/jpeg;base64,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'
        }
    ],
    defineProperties() {
        Object.defineProperty(this, 'currentSong', {
            get() {
                return this.songs[this.currentIndex]
            }
        })
        
        Object.defineProperty(this, 'listLength', {
            get() {
                return this.songs.length
            }
        })
    },
    handleEvents() {
        const _this = this
        const cdWidth= cd.offsetWidth
        const cdAnimation = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 12000,
            iterations: Infinity
        })

        cdAnimation.pause()

        // Xử lý phóng to / thu nhỏ CD
        document.onscroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newWidth = cdWidth - scrollTop > 0 ? cdWidth - scrollTop : 0
            cd.style.width = newWidth + 'px'
            cd.style.opacity = newWidth / cdWidth
        }

        // Xử lý khi click play
        playBtn.onclick = () => {
            if (!_this.isPlaying) {
                audio.play()
                cdAnimation.play()
            } else {
                audio.pause()
                cdAnimation.pause()
            }
        }

        audio.onplay = () => {
            _this.isPlaying = true
            player.classList.add('playing')
            cdAnimation.play()
            _this.setConfig('currentIndex', _this.currentIndex)
        }
        audio.onpause = () => {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdAnimation.pause()
        }

        // Xử lý thanh tiến trình
        audio.ontimeupdate = () => {
            progressPercentage = !audio.duration ? 0 : Math.floor(audio.currentTime/ audio.duration * 200) / 2
            progress.value = progressPercentage
        }

        // Xử lý tua 
        progress.oninput = (e) => {
            seekTime = e.target.value / 100 * audio.duration
            audio.currentTime = seekTime
        }

        // Xử lý next, prev song
        nextBtn.onclick = () => {
            this.lastIndexes = this.lastIndexes.concat(this.currentIndex)
            if (_this.isRandom) {
                _this.nextRandomSong()
            } else {
                _this.nextSong()
            }
            cdAnimation.cancel()
            audio.play()
        }
        prevBtn.onclick = () => {
            _this.prevSong()
            audio.play()
        }

        // Xử lý phát random
        randomBtn.onclick = () => {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
            if (_this.isRandom) {
                if (_this.isRepeat) {
                    repeatBtn.click()
                }
                _this.randomSongPlayedIndexes = []
            }
        }

        // Xử lý repeat song
        repeatBtn.onclick = () => {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
            if (_this.isRepeat && _this.isRandom) {
                randomBtn.click()
            }
        }

        // Xử lý khi audio end
        audio.onended = () => {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }


        
        // Xử lý khi click vào bài hát 
        playlist.onclick = (e) => {
            if (e.target.closest('.option')) {
                // Xử lý click vào option
            } else if (e.target.closest('.song.active')) {
                // Xử lý click vào active song
            } else {
                // Xử lý click vào song
                _this.currentIndex = Number(e.target.closest('.song').getAttribute('data-id'))
                _this.loadCurrentSong()
                audio.play()
            }
        }
    },
    loadCurrentSong() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
        this.activeCurrentSong()
    },
    nextSong() {
        if (this.currentIndex < this.listLength - 1) {
            this.currentIndex ++
        } else {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong() {
        if (this.lastIndexes.length !== 0) {
            this.currentIndex = this.lastIndexes.pop()
        } else if (this.currentIndex !== 0) {
            this.currentIndex--
        } else {
            this.currentIndex = this.listLength - 1
        }
        this.loadCurrentSong()
    },
    nextRandomSong() {
        if (this.randomSongPlayedIndexes.length == this.listLength - 1) {
            this.randomSongPlayedIndexes = [this.currentIndex]
        } else {
            this.randomSongPlayedIndexes = this.randomSongPlayedIndexes.concat(this.currentIndex)
        }
        console.log(this.randomSongPlayedIndexes)
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.listLength)
        } while (this.randomSongPlayedIndexes.includes(newIndex)) 
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    activeCurrentSong () {
        let currentSong = $(`[data-id="${this.currentIndex}"]`)
        if ($('.song.active')) {
            $('.song.active').classList.remove('active')
        }
        currentSong.classList.add('active')
        currentSong.scrollIntoView({behavior: "smooth", block: "nearest"})
    },
    loadConfig() {
        this.isRandom = typeof this.config.isRandom == 'undefined' ? false : this.config.isRandom
        randomBtn.classList.toggle('active', this.isRandom)
        this.isRepeat = typeof this.config.isRepeat == 'undefined' ? false : this.config.isRepeat
        repeatBtn.classList.toggle('active', this.isRepeat)
        this.currentIndex = this.config.currentIndex ? this.config.currentIndex : 0
    },
    render() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song" data-id="${index}">
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
        }).join('')
        playlist.innerHTML = htmls
        this.activeCurrentSong()
    },
    start() {
        this.loadConfig()
        
        this.defineProperties()
        
        this.handleEvents()
        
        this.render()
        
        this.loadCurrentSong()
    }
}

app.start()
console.log()
