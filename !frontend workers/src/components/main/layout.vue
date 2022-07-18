<template>
  <section id="vd-main-layout">
    <header>
      <slot name="header"></slot>
    </header>
    <nav :style="{background:checkColor,overflow:'hidden'}">
      <slot name="toolbar"></slot>
    </nav>
    <div :style="{background:checkColor}">
      <slot name="asidetoolbar"></slot>
    </div>    
    <aside :style="overflow">
      <slot name="aside"></slot>
    </aside>
    <main>
      <slot name="main"></slot>
    </main>
    <footer :style="{background:checkColor}">
      <slot name="footer"></slot>
    </footer>
  </section>
</template>

<script>
export default {
  name: 'vd-layout',
  computed: {
    checkColor() {
      return this.$store.getters.getColor;
    },
    overflow() {
      return [
        this.$store.getters.sideIsCollapsed ? { 'overflow-y': 'visible' } : { 'overflow-y': 'auto' }
      ]
    }
  }
}
</script>

<style scoped>
section#vd-main-layout {
  height: 100%;
  max-width: 100%;
  display: grid;
  grid-template-columns: min-content 1fr;
  grid-template-rows: min-content min-content auto min-content;
  grid-template-areas: "header header" "asidetoolbar toolbar" "aside main" "footer footer";
}

section#vd-main-layout>header {
  grid-area: header;
}

section#vd-main-layout>nav {
  grid-area: toolbar;
}
section#vd-main-layout>div {
  grid-area: asidetoolbar;
}
section#vd-main-layout>div .v-toolbar__content {
  padding:0px;
}

section#vd-main-layout>aside {
  grid-area: aside;
  overflow: hidden;
}

section#vd-main-layout>main {
  grid-area: main;
  max-height: 100%;
  max-width: 100%;
  overflow: hidden;
}

section#vd-main-layout>footer {
  grid-area: footer;
}
</style>
