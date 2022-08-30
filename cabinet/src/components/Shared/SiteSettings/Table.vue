<template>
  <div class="table" :class="{ publishPopup: isPublishPopup }">
    <div class="table__head">
      <div class="table__head-item" v-for="(header, index) in tableHeaders" :key="index">
        {{ header }}
      </div>
    </div>
    <div
      class="table__row"
      v-for="(row, index) in data"
      :key="'Row' + index"
      :class="{ 'table__row_is-last': index === data.length - 1 }"
    >
      <div
        class="table__row-item"
        v-for="(itemKey, index) in Object.keys(row)"
        :key="'RowItem' + index"
        :class="{
          'table__row-item_with-background': rowItemsWithBackgroundByKey.indexOf(itemKey) !== -1,
          'table__row-item_clickable': index !== 0,
          'table__row-item_clicked': isClicked === row[itemKey]
        }"
        @click="clickOnClipBoard($event, itemKey, row[itemKey], index)"
      >
        <span>{{ row[itemKey] }}</span>
        <svg-icon v-if="index !== 0" name="copy-icon" width="12" height="12" color="#828282" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
  data() {
    return {
      isClicked: null as string | null
    };
  },
  props: {
    isPublishPopup: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array as PropType<any[]>,
      required: true
    },
    rowItemsWithBackgroundByKey: Array as PropType<string[]>,
    onClickByKey: Object
  },

  computed: {
    colsCount(): number {
      return this.tableHeaders.length;
    },
    tableHeaders(): string[] {
      const tableHeaders: string[] = [];

      this.data.forEach(row => {
        const rowHeaders = Object.keys(row);

        rowHeaders.forEach(header => (tableHeaders.indexOf(header) === -1 ? tableHeaders.push(header) : false));
      });

      return tableHeaders;
    }
  },
  methods: {
    clickOnClipBoard($event: Event, itemKey: string, copyValue: string, index: number) {
      if (index === 0) return;
      this.isClicked = copyValue;
      this.onClickByKey[itemKey](copyValue, $event);

      setTimeout(() => {
        this.isClicked = null;
      }, 1000);
    }
  }
});
</script>

<style lang="scss" scoped>
.publishPopup {
  .table__head,
  .table__row {
    padding: 10px 15px;
  }
}
.table {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  background: #ffffff;
  border: 1px solid #bdc2c7;
  box-sizing: border-box;
  border-radius: $shape_border_radius;
  overflow: hidden;

  * {
    box-sizing: border-box;
  }

  &__head {
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    background: #f2f2f2;
    border-bottom: 1px solid #bdc2c7;
    padding: 12px 21px;

    &-item {
      font-size: 12px;
      font-weight: bold;
      color: #555;
      text-transform: capitalize;
      &:first-child {
        width: 20%;
      }
      width: 40%;
    }
  }

  &__row {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    width: 100%;
    padding: 12px 21px;
    border-bottom: 1px solid #bdc2c7;

    &_is-last {
      border-bottom: 0;
    }

    &-item {
      display: flex;
      align-items: center;
      cursor: pointer;
      &:first-child {
        width: 20%;
      }
      width: 40%;
      span {
        font-size: 12px;
        color: #828282;
      }
      svg {
        margin: 0 0 0 6px;
        transition: 0.3s;
      }

      &_clicked {
        svg {
          opacity: 0;
        }
      }
    }

    &-item_with-background span {
      padding: 2px 8px;
      line-height: 18px;
      background: $black;
      border-radius: $shape_border_radius;
      min-width: 18px;
      box-sizing: border-box;
      text-align: center;
      color: $white;
      transition: 0.5s;
    }

    .table__row-item_clickable span {
      position: relative;
      cursor: pointer;

      &::after {
        content: '🖖copied!';
        white-space: nowrap;
        display: flex;
        align-items: center;
        position: absolute;
        left: 100%;
        top: 0;
        bottom: 0;
        overflow: hidden;
        margin-left: 9px;
        font-size: 12px;
        color: #000;
        opacity: 0;
        width: 0;
        transition: all 0.2s ease-in-out;
      }
    }

    &-item_with-background.table__row-item {
      &:hover,
      &:active {
        span {
          background: $color_input_overlay_border_focus;
        }
      }
    }

    .table__row-item_clickable.table__row-item_clicked span {
      &::after {
        opacity: 1;
        width: 60px;
        transition: all 0.2s ease-in-out;
      }
    }
  }
}
</style>
