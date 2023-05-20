<link rel="shortcut icon" type="image/png" href="/favicon.png"/>
<link rel="stylesheet" href="style.css"/>
<template>
    <EmbedSong></EmbedSong>
    <footer>
        <span id="author">COPYRIGHT © 2023 Adam Jakubiak. ALL RIGHTS RESERVED</span>
    </footer>
</template>

<script lang="ts">
import EmbedSong from './components/embedSong.vue';
import { defineComponent } from 'vue';

export default defineComponent({
    name: "HomePage",
    components: {
        EmbedSong
    }
})

</script>