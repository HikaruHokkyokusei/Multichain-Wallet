<script lang="ts">
    export let barColor: string = "#FF3D00";
    export let trackColor: string = "#FFF";

    export let side: number = 48;
</script>

<div class="CenterRowFlex Wrapper">
    <span class="Loader"
          style="width: {side}px; height: {side}px; border: {Math.ceil(side / 9)}px solid {trackColor}; border-bottom-color: {barColor};"
    ></span>
</div>

<style>
    .Loader {
        border-radius: 50%;
        display: inline-block;
        box-sizing: border-box;
        animation: LoaderRotation 1s linear infinite;
    }

    @keyframes LoaderRotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>