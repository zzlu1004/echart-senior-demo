<template>
	<span :class="className">
    <span v-if="data!=' '" :class="(data > 0 ? 'color-success':'color-danger')">{{Math.abs(data).toFixed(2)}}%</span>
    <i v-if="data > 0" class="at color-success icon-arrowup"/>
    <i v-else-if="data < 0" class="at color-danger icon-arrowdown"/>
    <span v-else >--</span>
	</span>
</template>

<script>
export default {
  name: 'FdRiseDown',
  mixins: [],
  components: {},
  data() {
    return {}
  },
  props: {
    className: {
      type: String,
      default: ''
    },
    data: [String, Number]
  },
  watch: {},
  hooks() {
  },
  computed: {},
  mounted() {
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
  .color-success{
    color: green;
  }
  .color-danger{
    color: red;
  }
  .color-primary{
    color: blue;
  }
</style>
