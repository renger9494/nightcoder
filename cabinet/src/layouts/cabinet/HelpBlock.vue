<template>
  <section class="help-block-sections">
    <div class="cabinet__container">
      <div class="help-block-row">
        <router-link to="#" class="help-block">
          <img
            src="@/assets/img/projects/Rectangle522.png"
            srcset="@/assets/img/projects/Rectangle522@2x.png"
            alt=""
            class="help-block__img"
          />
          <div class="help-block__title">How to create your own project?</div>
          <div class="help-block__desc">
            A quick guide to working with projects or how to create an exciting page.
          </div>
        </router-link>
        <router-link to="#" class="help-block">
          <img
            src="@/assets/img/projects/Rectangle523.png"
            srcset="@/assets/img/projects/Rectangle523@2x.png"
            alt=""
            class="help-block__img"
          />
          <div class="help-block__title">
            What is interesting in subscribers?
          </div>
          <div class="help-block__desc">
            Subscribers are an integral part of the life of any website. Find out how to interact with them using our
            service.
          </div>
        </router-link>
        <router-link to="#" class="help-block">
          <img
            src="@/assets/img/projects/Rectangle524.png"
            srcset="@/assets/img/projects/Rectangle524@2x.png"
            alt=""
            class="help-block__img"
          />
          <div class="help-block__title">What does the analytics show?</div>
          <div class="help-block__desc">
            How to become a king guided by simple analytics and capture the maximum from your audience.
          </div>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  
})
</script>

<style lang="scss">
.help-block-sections {
  background: #f2f2f2;
  padding: 100px 0;
  .cabinet__container {
    background: inherit;
  }
}
.help-block-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.help-block {
  width: 360px;
  text-decoration: none;
  &__img {
    border-radius: 6px;
    height: 120px;
    width: 100%;
    object-fit: cover;
    margin-bottom: 16px;
  }
  &__title {
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    letter-spacing: -0.03em;
    color: #000000;
    margin-bottom: 10px;
  }
  &__desc {
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
    color: #555555;
    max-width: 320px;
  }
}
</style>
