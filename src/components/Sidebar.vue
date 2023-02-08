<script lang="ts">
export default {
  props: {
    isClosed: {
      type: Boolean,
      required: true,
    },
    attributes: { type: Object, required: true },
    onCloseCb: { type: Function },
  },

  methods: {
    handleClose() {
      if (this.onCloseCb) {
        this.onCloseCb();
      }
    },
  },
};
</script>

<template>
  <div class="sidebar" :class="{ closed: isClosed }">
    <div class="header">
      <h2>Objekt Attribute</h2>
      <button @click="handleClose">x</button>
    </div>

    <div class="attributes" v-if="!isClosed">
      <!-- TODO: refactor important attributes display to generate child compenents by type and chosen attribute list -->
      <div
        v-if="
          attributes?.['externalReference externalObjectName'] !== undefined
        "
        class="refId mb-4"
      >
        <h3>ExternalReference ExternalObjectName:</h3>
        <span>{{ attributes["externalReference externalObjectName"] }}</span>
      </div>

      <div
        v-if="attributes?.['measuredHeight'] !== undefined"
        class="measured-height mb-4"
      >
        <h3>Gemessene Höhe:</h3>
        <span>{{ attributes["measuredHeight"] }}</span>
      </div>

      <div v-if="attributes?.Address" class="address mb-4">
        <h3>Adresse:</h3>
        <div class="data">
          <span
            >{{ attributes?.Address.Street }}
            {{ attributes?.Address.HouseNumber }}</span
          >
          <span>{{ attributes?.Address.City }}</span>
        </div>
      </div>

      <hr />
      <h3>Zusätzliche Attribute:</h3>
      <div class="misc-data">
        <ul>
          <li v-for="(value, key) in attributes">
            <b>{{ key }}</b
            >: {{ value }}
          </li>
        </ul>
      </div>
    </div>

    <div v-else>Klicke ein Gebäude</div>
  </div>
</template>

<style scoped lang="sass">
hr
  opacity: 0.3
  color: #e1e6e9
.sidebar
  position: absolute
  display: flex
  flex-direction: column
  top: 30px
  left: 30px
  width: 500px
  background-color: #fff
  border-radius: 8px
  color: black
  height: auto
  box-shadow: 2.4px 2.4px 3.7px rgba(0, 0, 0, 0.087), 6.5px 6.5px 10.1px rgba(0, 0, 0, 0.125), 15.7px 15.7px 24.4px rgba(0, 0, 0, 0.163), 52px 52px 81px rgba(0, 0, 0, 0.25)
  transition: transform 0.3s ease-in-out
  transform: translateX(0)
  &.closed
    transform: translateX(-660px)
  pre
    word-break: break-word
    white-space: normal
  .header
    display: flex
    justify-content: space-between
    background-color: var(--color-green-yellow)
    padding: 12px 10px 13px 15px
    border-radius: 5px 5px 0 0
    align-items: center
    h2
      margin: 0
      line-height: 1
      color: white
      font-weight: 300
    button
      background-color: var(--color-green)
      border-radius: 50%
      display: flex
      line-height: 100%
      justify-content: center
      align-items: center
      height: 40px
      width: 40px
      border: 0
      &:hover
        background-color: var(--color-green-hover)
  .attributes
    padding: 15px 10px
    h1, h2, h3, h4
      font-size: 1rem
      margin-bottom: 5px
      margin-top: 0
      // text-transform: uppercase
  .address
    .data
      display: flex
      flex-direction: column
  ul
    margin: 0
    list-style: none
    padding: 0
    li
      &:hover
        background-color: #c6d0d6
  .misc-data
    font-family: "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", monospace
    background-color: #e1e6e9
    border-radius: 3px
    padding: 10px
    max-height: 300px
    overflow-y: scroll
</style>
