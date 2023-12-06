<template>
    <div id="content">
        <img src="src/assets/images/misa-sme-2023.jpg" alt="misa-image" class="misa-image" />
    </div>
</template>

<style lang="scss" scoped>
#content {
    max-height: var(--main-content-height);
    height: 100%;
    padding: var(--main-content-padding-top) var(--main-content-padding-x)
        var(--main-content-padding-bottom);
    background-color: rgb(var(--c-gray-100));

    display: grid;
    place-items: center;
}

.misa-image {
    max-width: 1000px;
    width: 100%;
}
</style>
