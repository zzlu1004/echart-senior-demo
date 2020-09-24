<template>
  <draggable :options="options" @choose="choose"  @clone="clone" @end="end"  @start="start" :move="move">
    <div class="px2 py1 item" v-for="element in list" :key="element.id">
      {{element[label]}}
    </div>
  </draggable>
</template>

<script>
  import draggable from 'vuedraggable'
  export default {
    name: 'FdDraggable',
    components: { draggable },
    props: {
      list: {
        type: Array,
        default: []
      },
      group: {
        type: String
      },
      label: {
        type: String,
        default: 'label'
      },
      options: {
        type: Object,
        default: () => {
          return {
            ghostClass: 'bg-yellow',
            chosenClass: 'fd-drag-chosen',
            forceFallback: true,
            fallbackClass: 'fd-drag-dragging',
            delay: 0,
            onClone: function(evt) {
            }
          }
        }
      }
    },
    data() {
      return {
        defaultOpt: {
          group: 'name', // or { name: "...", pull: [true, false, clone], put: [true, false, array] }
          sort: true, // sorting inside list
          delay: 0, // time in milliseconds to define when the sorting should start
          touchStartThreshold: 0, // px, how many pixels the point should move before cancelling a delayed drag event
          disabled: false, // Disables the sortable if set to true.
          store: null, // @see Store
          animation: 150, // ms, animation speed moving items when sorting, `0` — without animation
          handle: '.my-handle', // Drag handle selector within list items
          filter: '.ignore-elements', // Selectors that do not lead to dragging (String or Function)
          preventOnFilter: true, // Call `event.preventDefault()` when triggered `filter`
          draggable: '.item', // Specifies which items inside the element should be draggable
          ghostClass: 'sortable-ghost', // Class name for the drop placeholder
          chosenClass: 'sortable-chosen', // Class name for the chosen item
          dragClass: 'sortable-drag', // Class name for the dragging item
          dataIdAttr: 'data-id',
  
          forceFallback: false, // ignore the HTML5 DnD behaviour and force the fallback to kick in
  
          fallbackClass: 'sortable-fallback', // Class name for the cloned DOM Element when using forceFallback
          fallbackOnBody: false, // Appends the cloned DOM Element into the Document's Body
          fallbackTolerance: 0, // Specify in pixels how far the mouse should move before it's considered as a drag.
  
          scroll: true, // or HTMLElement
          scrollFn: function(offsetX, offsetY, originalEvent, touchEvt, hoverTargetEl) {}, // if you have custom scrollbar scrollFn may be used for autoscrolling
          scrollSensitivity: 30, // px, how near the mouse must be to an edge to start scrolling.
          scrollSpeed: 10, // px
  
          setData: function(/** DataTransfer */dataTransfer, /** HTMLElement*/dragEl) {
            dataTransfer.setData('Text', dragEl.textContent) // `dataTransfer` object of HTML5 DragEvent
          },
  
          // Element is chosen
          onChoose: function(evt) {
            evt.oldIndex // element index within parent
          },
  
          // Element dragging started
          onStart: function(/** Event*/evt) {
            evt.oldIndex // element index within parent
          },
  
          // Element dragging ended
          onEnd: function(/** Event*/evt) {
            evt.item // dragged HTMLElement
            evt.to // target list
            evt.from // previous list
            evt.oldIndex // element's old index within old parent
            evt.newIndex // element's new index within new parent
          },
  
          // Element is dropped into the list from another list
          onAdd: function(/** Event*/evt) {
            // same properties as onEnd
          },
  
          // Changed sorting within list
          onUpdate: function(/** Event*/evt) {
            // same properties as onEnd
          },
  
          // Called by any change to the list (add / update / remove)
          onSort: function(/** Event*/evt) {
            // same properties as onEnd
          },
  
          // Element is removed from the list into another list
          onRemove: function(/** Event*/evt) {
            // same properties as onEnd
          },
  
          // Attempt to drag a filtered element
          onFilter: function(/** Event*/evt) {
            evt.item // HTMLElement receiving the `mousedown|tapstart` event.
          },
  
          // Event when you move an item in the list or between lists
          onMove: function(/** Event*/evt, /** Event*/originalEvent) {
            // Example: http://jsbin.com/tuyafe/1/edit?js,output
            evt.dragged // dragged HTMLElement
            evt.draggedRect // TextRectangle {left, top, right и bottom}
            evt.related // HTMLElement on which have guided
            evt.relatedRect // TextRectangle
            originalEvent.clientY // mouse position
            // return false; — for cancel
          },
  
          // Called when creating a clone of element
          onClone: function(/** Event*/evt) {
          }
        }
      }
    },
    computed: {
    },
    mounted() {
    },
    methods: {
      end(evt) {
        const item = this.list.splice(evt.oldIndex, 1)[0]
        this.list.splice(evt.newIndex, 0, item)
        this.$emit('dragend', this.list)
      },
      clone(original) {
        return original
      },
      start(evt) {
      },
      move(evt) {
      },
      choose(evt) {
        const ITEM_HEIGHT = evt.item.offsetHeight
        const container = evt.path ? evt.path[1] : {}
        const index = evt.oldIndex
        if (index * ITEM_HEIGHT < container.scrollTop) {
          container.scrollTo({
            top: index * ITEM_HEIGHT
          })
        } else if ((index + 1) * ITEM_HEIGHT > container.scrollTop + container.offsetHeight) {
          container.scrollTo({
            top: (index + 1) * ITEM_HEIGHT - container.offsetHeight
          })
        }
      }
    },
    watch: {
    }
  }
</script>

<style>
  .fd-drag-chosen{
    color: #fcfcfc;
    background-color: rgba(112,198,242,1);
    cursor: pointer;
  }
  .bg-yellow{
    height: 0px;
    padding: 1px;
    overflow: hidden;
    background-color: rgba(112,198,242,1);
    cursor: pointer;
  }
  .fd-drag-dragging{
    color: #fcfcfc;
    clear: both;
    height: 40px !important;
    line-height: 25px;
    background-color: rgba(112,198,242,1);
    border-radius: 2px;
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  .item{
    cursor: move;
  }
</style>
