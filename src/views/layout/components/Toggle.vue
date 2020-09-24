<template>
  <div class="toggle">
    <div class="toggle-btn" @click="toggleSideBar">
      <i v-if="sidebar.opened" class="at icon-left"></i>
      <i class="at icon-right" v-else></i>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'Toggle',
    mixins: [],
    components: {},
    data() {
      return {}
    },
    props: {},
    watch: {},
    hooks() {},
    computed: {
      ...mapGetters([
        'sidebar'
      ])
    },
    mounted() {},
    methods: {
      toggleSideBar() {
        this.$store.dispatch('ToggleSideBar')
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import 'src/styles/variables.scss';
  .toggle{
    position: absolute;
    top: 0;
    width: 30px;
    height: 100%;
    display: flex;
    font-size: 24px;
    cursor: pointer;
    align-items: center;
    .toggle-btn{
      background-color:$menu-sidebar-item;
      width: 24px;
      font-size: 14px;
      height: 64px;
      padding: 23px 3px;
      filter: opacity(50);
      opacity: 0.5;
      border-bottom-right-radius: $border-radius;
      border-top-right-radius: $border-radius;
      color: #fff;
    }
  }
  .toggle:hover{
    .toggle-btn{
      filter: opacity(100);
      opacity: 1;
    }
  }
</style>
