<template>
  <main class="showcase">
    <div class="showcase__wrap container container--main">
      <h1 class="showcase__title">Showcase</h1>
      <h2 class="showcase__title-big">Inspiration <span>design</span> is here</h2>
      <div class="showcase__cases">
        <case-item
          v-for="(item, index) in cases"
          :key="index"
          :data="item"
          :class="{'showcase__cases-item--long': index === 2 && !!item.descr }"
          class="showcase__cases-item"
        />
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'showcase',
  data() {
    return {
      cases: [
        {
          name: 'Maria Orlova',
          title: 'NOMAD COMPANY',
          tags: ['Newsletter','Software','Portfolio']
        },
        {
          name: 'Mikhail Venerenco',
          title: 'TESLA CO.',
          tags: ['Newsletter','Software','Company','Portfolio']
        },
        {
          name: 'Mikhail Venerenko',
          title: 'TESLA CO.',
          descr: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sit scelerisque porttitor sed rhoncus. Quam eu fermentum justo, etiam aliquam nunc eu. Orci cursus sapien a ac id ipsum montes. Hac id nunc ut eget. Proin ac neque purus sit. Vulputate tincidunt nisl ut volutpat. Ut tortor, arcu scelerisque at lobortis nunc.',
          tags: ['Newsletter','Software','Portfolio']
        },
        {
          name: 'Maria Orlova',
          title: 'NOMAD COMPANY',
          tags: ['Newsletter','Software','Portfolio']
        },
        {
          name: 'Mikhail Venerenco',
          title: 'TESLA CO.',
          tags: ['Newsletter','Software','Portfolio']
        },
        {
          name: 'Maria Orlova',
          title: 'NOMAD COMPANY',
          tags: ['Newsletter','Software','Portfolio']
        },
        {
          name: 'Mikhail Venerenco',
          title: 'TESLA CO.',
          tags: ['Newsletter','Software','Portfolio']
        },
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.showcase {
  min-height: 100vh;
  background: #0E0E11;
  color: #FFFFFF;

  &__wrap {
    padding-top: 140px;
    padding-bottom: 80px;
  }

  &__title {
    font-weight: 500;
    font-size: 24px;
    line-height: 36px;
    text-align: center;

    &-big {
      text-align: center;
      font-weight: 600;
      font-size: 48px;
      line-height: 72px;
      margin: 0 auto 70px;
      span {
        font-weight: inherit;
        background: rgb(134,66,255);
        background: linear-gradient(90deg, rgba(134,66,255,1) 0%, rgba(98,110,255,1) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }

  &__cases {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    &-item {
      flex: 0 0 calc(50% - 10px);
      margin: 0 0 60px;

      &--long {
        flex: 0 0 100%;
      }
    }
  }

  @include bp($md) {
    &__wrap {
      padding-top: 90px;
    }
    &__title {
      font-weight: 500;
      font-size: 18px;
      line-height: 27px;
      &-big {
        font-weight: 600;
        font-size: 32px;
        line-height: 48px;
        margin: 0 auto 40px;
      }
    }
    &__cases-item {
      margin: 0 0 40px;
    }
  }

  @include bp($sm) {
    &__cases-item {
      flex: 0 0 100%;
      margin: 0 0 30px;
    }
  }
}
</style>
