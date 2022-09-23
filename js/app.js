const wrapper = document.querySelector('.wrapper')
musicImg = wrapper.querySelector('.img-area img')
musicName = wrapper.querySelector('.song-details .name')
musicArtist = wrapper.querySelector('.song-details .artist')
mainAudio = wrapper.querySelector('#main-audio')
playPauseBtn = wrapper.querySelector('.play-pause')
prevBtn = wrapper.querySelector('#prev')
nextBtn = wrapper.querySelector('#next')
progressBar = wrapper.querySelector('.progress-bar')
progressArea = wrapper.querySelector('.progress-area')
musicList = wrapper.querySelector('.music-list')
showMoreBtn = wrapper.querySelector('#more-music')
hideMusicBtn = musicList.querySelector('#close')
                


let musicIndex = Math.floor((Math.random() * allMusic.length) + 1)

window.addEventListener('load', () => {
    loadMusic(musicIndex) //calling loas music function once window loaded
    playingNow()
})

//load music function
function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb - 1].name
    musicArtist.innerText = allMusic[indexNumb - 1].artist
    musicImg.src = `images/${allMusic[indexNumb -1].img}.jpeg`
    mainAudio.src = `songs/${allMusic[indexNumb -1].src}.mp3`
}


//play music function
function playMusic() {
    wrapper.classList.add('paused')
    playPauseBtn.querySelector('i').innerText = 'pause'
    mainAudio.play()
}
//pause music function
function pauseMusic() {
    wrapper.classList.remove('paused')
    playPauseBtn.querySelector('i').innerText = 'play_arrow'
    mainAudio.pause()
}
//next music function
function nextMusic() {
    musicIndex++
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex
    loadMusic(musicIndex)
    playMusic()
    playingNow()
}
//previous music function
function previousMusic() {
    musicIndex--
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex
    loadMusic(musicIndex)
    playMusic()
    playingNow()
}
//play or pause music button
playPauseBtn.addEventListener('click', () => {
    const isMusicPaused = wrapper.classList.contains('paused')
    //if ismusicpaused is true then call pausemusic else call play music
    isMusicPaused ? pauseMusic() : playMusic()
    playingNow()
})


nextBtn.addEventListener('click', () => {
    nextMusic() //calling next music function
})
prevBtn.addEventListener('click', () => {
    previousMusic() //calling next music function
})

//update progress bar width according to current time
mainAudio.addEventListener('timeupdate', (e) => {
    console.log(e)
    const currentTime = e.target.currentTime
    const duration = e.target.duration
    let progressWidth = (currentTime / duration) * 100
    progressBar.style.width = `${progressWidth}%`

    let musicCurrentTime = wrapper.querySelector('.current-time')
    musicDuration = wrapper.querySelector('.max-duration')
    mainAudio.addEventListener('loadeddata', () => {
        //update total song duration
        let audioDuration = mainAudio.duration
        let totalMin = Math.floor(audioDuration / 60)
        let totalSec = Math.floor(audioDuration % 60)
        if (totalSec < 10) {
            totalSec = `0${totalSec}`
        } 
        musicDuration.innerText = `${totalMin}:${totalSec}`
    })
    //update total song duration
    let currentMin = Math.floor(currentTime / 60)
    let currentSec = Math.floor(currentTime % 60)
    if (currentSec < 10) {
        currentSec = `0${currentSec}`
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`
})


//update playing song current time according to the progress bar



progressArea.addEventListener('click', (e) => {
    console.log(e.offsetX)
    console.log(mainAudio.currentTime)
    console.log(progressArea.clientWidth)
    console.log(mainAudio.duration)
    console.log('done')

    mainAudio.currentTime = (e.offsetX / progressArea.clientWidth) * mainAudio.duration
    playMusic()
})

// working on repeat, shuffle song according to the icon

const repeatBtn = wrapper.querySelector('#repeat-plist')

repeatBtn.addEventListener('click', () => {
    let getText = repeatBtn.innerText
    // changing the icons 
    switch (getText) {
        case 'repeat':
            repeatBtn.innerText = 'repeat_one'
            repeatBtn.setAttribute('title', 'song looped')
            break;

        case 'repeat_one':
            repeatBtn.innerText = 'shuffle'
            repeatBtn.setAttribute('title', 'playback shuffle')
            break;

        case 'shuffle':
            repeatBtn.innerText = 'repeat'
            repeatBtn.setAttribute('title', 'playlist looped')
            break;

        default:
            break;
    }
})

// worked on changing icon Above, now to work on what happens after song end

mainAudio.addEventListener('ended', () => {
    let getText = repeatBtn.innerText
    switch (getText) {
        case 'repeat':
            nextMusic()
            break;

        case 'repeat_one':
            mainAudio.currentTime = 0
            loadMusic(musicIndex)
            playMusic()
            break;

        case 'shuffle':
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1)
            do {
                randIndex = Math.floor((Math.random() * allMusic.length) + 1)
            } while (musicIndex == randIndex);
            musicIndex = randIndex
            loadMusic(musicIndex)
            playMusic()
            playingNow()
            break;
        default:
            break;
    }
})

showMoreBtn.addEventListener('click', () => {
    musicList.classList.toggle('show')
})
hideMusicBtn.addEventListener('click', () => {
    showMoreBtn.click()
})

const ulTag = wrapper.querySelector('ul')

//lets create li according to the array length

for (let i = 0; i < allMusic.length; i++) {
    let liTag = `<li li-index = ${i + 1}>
    <div class="row">
        <span>${allMusic[i].name}</span>
        <p>${allMusic[i].artist}</p>
    </div>
    <audio class = '${allMusic[i].src}' src = "songs/${allMusic[i].src}.mp3"></audio>
    <span id = '${allMusic[i].src}' class = "audio-duration"></span>
</li>`
    ulTag.insertAdjacentHTML('beforeend', liTag)
    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`)
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`)

    liAudioTag.addEventListener('loadeddata', () => {
        //update total song duration
        let audioDuration = liAudioTag.duration
        let totalMin = Math.floor(audioDuration / 60)
        let totalSec = Math.floor(audioDuration % 60) 
        if (totalSec < 10) {
            totalSec = `0${totalSec}`
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`
        liAudioDuration.setAttribute('t-duration', `${totalMin}:${totalSec}`)
    })
}
//playing particular song on click from the list

const allLiTags = ulTag.querySelectorAll('li') 

function playingNow() {
    for (let j = 0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector('.audio-duration')
        if (allLiTags[j].classList.contains('playing')) {
            allLiTags[j].classList.remove('playing')
            let adDuration = audioTag.getAttribute('t-duration')
            audioTag.innerText = adDuration
        }
        // if there is an li tag where li-index = musicindex then the music is currently playing and well style it
        if (allLiTags[j].getAttribute('li-index') == musicIndex) {
            allLiTags[j].classList.add('playing')
            audioTag.innerText = 'playing'
        }


        // adding onclick attribute in all li tags
        allLiTags[j].setAttribute('onclick', 'clicked(this)')
    }
}

// lets play song on li click
function clicked(element) {
    // getting li index of particular clicked li tag
    let getLiIndex = element.getAttribute('li-index')
    musicIndex = getLiIndex
    loadMusic(musicIndex)
    playMusic()
    playingNow()
}