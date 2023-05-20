<template>
    <div id="toHide">
        <div id="embed-iframe">

        </div>

    </div>
    <div class="container">
        <div class="playlist">
            <div v-for="(element, i) in songs" :key="i" class="song">
                <div>{{ i + 1 }}</div>
                <div class="name" v-on:click="trySong($event)"
                    style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ element.track }}</div>
                <div>{{ element.duration }}</div>

            </div>
        </div>
        <div class="main">
            <div v-for="i in 6" :key="i" v-bind:class="'guess' + i">
            </div>
            <button class="togglePlay">
                <svg id="togglePlay" xmlns="http://www.w3.org/2000/svg" fill="none" width="80" height="80"
                    viewBox="0 0 24 24" stroke-width="1.5" stroke="#2aadc4" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M21 7.5V18M15 7.5V18M3 16.811V8.69c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 010 1.954l-7.108 4.061A1.125 1.125 0 013 16.811z" />
                </svg>
            </button>
            <div class="try">
                <input @keyup="propose" v-model="guess" type="text" id="try" />
            </div>
            <div class="sip">
                <div @click="skipGuess" class="skip">Skip +{{ timeToPlay[numberOfGuesses] }}s</div>
                <button class="submit" @click="submitSong()">Submit</button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import songs from '../assets/songs';

interface Song {
    artist: string
    uri: string;
    track: string;
    duration: number;
}

export default defineComponent({
    name: "EmbedSong",
    data() {
        return {
            song: {
                uri: "",
                duration: 0,
                track: ""
            },
            seek: 0,
            songs: songs,
            timeToPlay: [1, 2, 4, 8, 10, 16] as number[],
            numberOfGuesses: 0 as number,
            guess: "" as string,
            guessed: [] as string[],
        }
    },
    methods: {
        randomSong() {
            this.song = songs[Math.floor(Math.random() * songs.length)]
        },
        generateIFrame(element: HTMLDivElement | null) {
            window.onSpotifyIframeApiReady = (IFrameAPI) => {
                let options = { uri: this.song.uri }
                let callback = (EmbedController: any) => {
                    EmbedController.addListener("ready", () => {
                        document.querySelector(".togglePlay")?.addEventListener("click", () => {
                            EmbedController.togglePlay()
                            EmbedController.seek(this.seek)
                            setTimeout(() => {
                                EmbedController.pause()
                            }, this.timeToPlay[this.numberOfGuesses] * 1000)
                        })
                    })
                }
                IFrameAPI.createController(element, options, callback)
            }
        },
        propose() {
            const cos: Song[] = songs.filter((song: Song) => song.track.toLowerCase().startsWith(this.guess.toLowerCase()))
            this.songs = cos
        },
        trySong(event: any) {
            this.guess = event.target.outerText
        },
        displayIframe() {
            const iframe = document.getElementById("toHide") as HTMLIFrameElement;
            iframe.style.display = 'inline'
            iframe.style.opacity = '100'
            iframe.style.userSelect = 'all'
            iframe.style.pointerEvents = 'all'
            document.querySelector('.container')?.remove()
        },
        submitSong() {
            if (this.guess == this.song.track) {
                this.displayIframe()
            }
            if (this.guess != "" && !this.guessed.includes(this.guess)) {
                this.numberOfGuesses++;
                this.timeToPlay[this.numberOfGuesses];
                if (this.numberOfGuesses == 6) {
                    this.displayIframe()

                } else {
                    if (this.guess == this.song.track) {
                    } else {
                        (document.querySelector(`.guess${this.numberOfGuesses}`) as HTMLDivElement).innerHTML = this.guess
                        this.guessed.push(this.guess);
                        this.songs.splice(this.songs.findIndex(({ track }) => track == this.guess), 1)

                    }
                    this.guess = "";
                }

            }
        },
        changeTime() {
            songs.map((element: any) => {
                if (Math.floor(element.duration % 60) < 10) {
                    element.duration = `${Math.floor(element.duration / 60)}:0${Math.floor(element.duration % 60)}`
                } else {
                    element.duration = `${Math.floor(element.duration / 60)}:${Math.floor(element.duration % 60)}`
                }
            })

        },
        skipGuess() {
            this.numberOfGuesses++;
            if (this.numberOfGuesses == 6) {
                this.displayIframe()
            } else {

                this.guessed.push("Skipped");
                (document.querySelector(`.guess${this.numberOfGuesses}`) as HTMLDivElement).innerHTML = "Skipped";
            }
        }
    },
    created() {
        this.randomSong()
        this.seek = Math.floor(Math.random() * (this.song.duration - 32))
        this.changeTime()
    },
    mounted() {
        let element = document.getElementById("embed-iframe") as HTMLDivElement
        this.generateIFrame(element)
        const recaptchaScript = document.createElement("script");
        recaptchaScript.setAttribute(
            "src",
            "https://open.spotify.com/embed-podcast/iframe-api/v1"
        );
        document.head.appendChild(recaptchaScript);
        setTimeout(() => {
            (document.querySelector(".togglePlay") as HTMLButtonElement).click()
        }, 1000);
        setTimeout(() => {
            (document.querySelector(".togglePlay") as HTMLButtonElement).click()
        }, 400);
        

    },
})
</script>