<template>
  <div class="notifications">
    <title-component>Notifications</title-component>
    <div class="notifications__items-wrapper">
      <div
        class="notifications__item"
        @click="toggleSwitchValue('airtapProductUpdates')"
      >
        <span class="notifications__item-text">Airtap Product Updates</span>
        <switch-component
          :id="'airtap-product-updates'"
          :isActive="switchValues.airtapProductUpdates"
          :name="'airtapProductUpdates'"
          :onClick="toggleSwitchValue"
        />
      </div>
      <div
        class="notifications__item"
        @click="toggleSwitchValue('specialOffers')"
      >
        <span class="notifications__item-text">Special Offers</span>
        <switch-component
          :id="'special-offers'"
          :isActive="switchValues.specialOffers"
          :name="'specialOffers'"
          :onClick="toggleSwitchValue"
        />
      </div>
      <div
        class="notifications__item"
        @click="toggleSwitchValue('itmeoCompanyNews')"
      >
        <span class="notifications__item-text">Itmeo Company News</span>
        <switch-component
          :id="'itmeo-company-news'"
          :isActive="switchValues.itmeoCompanyNews"
          :name="'itmeoCompanyNews'"
          :onClick="toggleSwitchValue"
        />
      </div>
    </div>
    <!-- <a class="notifications__unsubscribe-all" href="#" @click="unsubscribeAll"
      >Unsubscribe All</a
    > -->
    <div class="notifications__actions">
      <button-component
        :tag="'button'"
        :isActive="true"
        :onClick="saveChanges"
        disabled
      >
        Save
      </button-component>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TitleComponent from '@/components/Settings/Title.vue'
import SwitchComponent from '@/components/Settings/Switch.vue'
import ButtonComponent from '@/components/Settings/Button.vue'
import ObjectKeys from '@/utils/types/ObjectKeys'
import { VisibleMessageNameType } from '@/store/ui'

export default Vue.extend({
  components: {
    TitleComponent,
    SwitchComponent,
    ButtonComponent,
  },
  data() {
    return {
      switchValues: {
        airtapProductUpdates: false,
        specialOffers: false,
        itmeoCompanyNews: false,
      } as ObjectKeys<boolean>,
    }
  },
  methods: {
    toggleSwitchValue(name: any) {
      this.switchValues[name] = !this.switchValues[name]
    },
    unsubscribeAll(event: any) {
      if (event) event.preventDefault()

      Object.keys(this.switchValues).forEach((switchName) => {
        this.switchValues[switchName] = false
      })
    },
    saveChanges() {
      this.$store.commit(
        'ui/changeVisibleMessageName',
        VisibleMessageNameType.Success
      )
    },
  },
})
</script>

<style lang="scss" scoped>
.notifications {
  &__items-wrapper {
    margin-bottom: 40px;
  }

  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 250px;
    margin-bottom: 20px;
    cursor: pointer;

    @include sm-down {
      width: 100%;
      min-width: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__item-text {
    font-size: 13px;
    font-weight: 400;
    color: #000000;
  }

  &__unsubscribe-all {
    display: inline-block;
    vertical-align: top;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    color: #173bef;
    margin-bottom: 40px;
    transition: 0.3s;
    border-bottom: 1px solid transparent;
    &:hover {
      border-bottom: 1px solid #173bef;
    }
  }
}
</style>
