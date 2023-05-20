

<template>
<EmbedSong></EmbedSong>
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