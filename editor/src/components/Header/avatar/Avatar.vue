<template>
  <div class="avatar">
    <svg
      :viewBox="`0 0 ${DEF_SIZE} ${DEF_SIZE}`"
      fill="none"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      :width="size"
      :height="size"
    >
      <title>{{ name }}</title>
      <mask
        id="mask__beam"
        maskUnits="userSpaceOnUse"
        :x="0"
        :y="0"
        :width="DEF_SIZE"
        :height="DEF_SIZE"
      >
        <rect
          :width="DEF_SIZE"
          :height="DEF_SIZE"
          :rx="isSquare ? undefined : DEF_SIZE * 2"
          fill="#FFFFFF"
        />
      </mask>
      <g mask="url(#mask__beam)">
        <rect
          :width="DEF_SIZE"
          :height="DEF_SIZE"
          :fill="data.backgroundColor"
        />
        <rect
          x="0"
          y="0"
          :width="DEF_SIZE"
          :height="DEF_SIZE"
          :transform="`translate(${data.wrapperTranslateX} ${
            data.wrapperTranslateY
          }) rotate(${data.wrapperRotate} ${DEF_SIZE / 2} ${
            DEF_SIZE / 2
          }) scale(${data.wrapperScale})`"
          :fill="data.wrapperColor"
          :rx="data.isCircle ? DEF_SIZE : DEF_SIZE / 6"
        />
        <g
          :transform="`translate(${data.faceTranslateX} ${
            data.faceTranslateY
          }) rotate(${data.faceRotate}  ${DEF_SIZE / 2} ${DEF_SIZE / 2})`"
        >
          <path
            v-if="data.isMouthOpen"
            :d="`M15 ${19 + data.mouthSpread} c2 1 4 1 6 0`"
            :stroke="data.faceColor"
            fill="none"
            stroke-linecap="round"
          />
          <path
            v-else
            :d="`M13, ${19 + data.mouthSpread} a1,0.75 0 0,0 10,0`"
            :fill="data.faceColor"
          />
          <rect
            :x="14 - data.eyeSpread"
            :y="14"
            :width="1.5"
            :height="2"
            :rx="1"
            stroke="none"
            :fill="data.faceColor"
          />
          <rect
            :x="20 + data.eyeSpread"
            :y="14"
            :width="1.5"
            :height="2"
            :rx="1"
            stroke="none"
            :fill="data.faceColor"
          />
        </g>
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  hashCode,
  getUnit,
  getBoolean,
  getRandomColor,
  getContrast,
} from './utilities'

const DEF_SIZE = 36
const COLORS = [
  ['#ADBBFF', '#318BF5', '#173BEF', '#FFC557', '#000000'],
  ['#EC6961', '#D8D8D8', '#FFFFEC', '#5DCBCA', '#FCEE7B'],
  ['#EFF68D', '#EA9BD5', '#BF80F2', '#6C4EF0', '#53468D'],
  ['#FBE769', '#EC6569', '#FFFFFF', '#426088', '#58A5F8'],
  ['#ED706B', '#D6FE7D', '#573087', '#61C1B6', '#EFE8BD'],
]

export default Vue.extend({
  name: 'avatar',
  props: {
    name: {
      type: String,
      required: true,
    },
    size: {
      type: [String, Number],
      default: () => 40,
    },
    isSquare: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      DEF_SIZE,
    }
  },
  computed: {
    data(): any {
      return this.generateData(this.name)
    },
  },
  methods: {
    generateData(name: string) {
      const numFromName = hashCode(name)
      const range = 5
      const textLength = name.length
      const colors = getRandomColor(textLength, COLORS, range)
      const wrapperColor = getRandomColor(numFromName, colors, range)
      const preTranslateX = getUnit(numFromName, 10, 1)
      const wrapperTranslateX =
        preTranslateX < 5 ? preTranslateX + this.DEF_SIZE / 9 : preTranslateX
      const preTranslateY = getUnit(numFromName, 10, 2)
      const wrapperTranslateY =
        preTranslateY < 5 ? preTranslateY + this.DEF_SIZE / 9 : preTranslateY

      return {
        wrapperColor: wrapperColor,
        faceColor: getContrast(wrapperColor),
        backgroundColor: getRandomColor(textLength, colors, range),
        wrapperTranslateX: wrapperTranslateX,
        wrapperTranslateY: wrapperTranslateY,
        wrapperRotate: getUnit(numFromName, 360),
        wrapperScale: 1 + getUnit(numFromName, this.DEF_SIZE / 12) / 10,
        isMouthOpen: getBoolean(numFromName, 2),
        isCircle: getBoolean(numFromName, 1),
        eyeSpread: getUnit(numFromName, 5),
        mouthSpread: getUnit(numFromName, 3),
        faceRotate: getUnit(numFromName, 10, 3),
        faceTranslateX:
          wrapperTranslateX > this.DEF_SIZE / 6
            ? wrapperTranslateX / 2
            : getUnit(numFromName, 8, 1),
        faceTranslateY:
          wrapperTranslateY > this.DEF_SIZE / 6
            ? wrapperTranslateY / 2
            : getUnit(numFromName, 7, 2),
      }
    },
    randomNumbers(min: number, max: number) {
      return Math.round(Math.random() * (max - min)) + min
    },
  },
})
</script>

<style lang="scss">
.avatar {
  display: inline-flex;
}
</style>
