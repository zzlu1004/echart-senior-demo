<template>
	<span :class="className">
    <span :class="(data > 0 ? 'color-success':'color-danger')">{{data}}%</span>
	</span>
</template>

<script>
export default {
  name: 'FdRiseDown2',
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

</style>
