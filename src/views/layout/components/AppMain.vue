<template>
  <section class="app-main">
    <transition>
      <keep-alive :include="keepAlive">
        <router-view></router-view>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
  export default {
    name: 'AppMain',
    computed: {
      keepAlive() {
        return this.$route.path.replace(/^\//, '').split('/')
      }
    }
  }
</script>
