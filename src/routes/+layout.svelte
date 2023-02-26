<script lang="ts">
    import "../global.css";

    let isHovering: boolean = false;
</script>

<div class="Wrapper">
    <nav
            class="SideBar {isHovering ? 'SideBarBig' : 'SideBarSmall'}"
            on:mouseenter={() => {isHovering = true;}}
            on:mouseleave={() => {isHovering = false;}}
    >
        Nav
        Bar
    </nav>
    <div class="ContentHolder">
        <slot></slot>
    </div>
</div>

<style>
    .SideBar {
        height: 100%;
        z-index: 1;
        background-color: #594faf;

        position: absolute;
        top: 0;
        bottom: 100%;
        left: 0;

        transition: 500ms width;
    }

    .SideBarBig {
        width: 150px;
        right: 150px;
    }

    .SideBarSmall {
        width: 40px;
        right: 40px;
    }

    .ContentHolder {
        height: 100%;
        z-index: 0;
        overflow: hidden;

        position: absolute;
        top: 0;
        right: 100%;
        bottom: 100%;
        left: 40px;

        width: calc(100% - 40px);
    }
</style>