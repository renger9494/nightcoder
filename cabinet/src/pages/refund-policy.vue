<template>
  <div class="container container--text">
    <main>
      <h1 class="letter-spacing">Refund Policy</h1>
      <p>
        Since we provide non-tangible, irrevocable goods, we do not issue refunds for digital products once the order is
        confirmed and product is sent. Please note that we offer digital products, not services, so there is no way to
        close access to the files that you’ve already received.
      </p>
      <p>
        The Consumer Rights Act gives you rights to claim against the seller if your digital download is faulty. As a
        seller, we can issue a refund if there is a technical problem and we can't help you to resolve the matter or if
        there was a misrepresentation in the product description. In those cases the refund period is 60 days from the
        moment of the purchase.
      </p>
      <p>We consider a technical problem to be one of the following:</p>
      <ul>
        <li>
          Major defects: although all the products are thoroughly tested before release, unexpected errors may occur.
          Such issues must be reported directly to our technical support.
        </li>
        <li>
          Product not-as-described: such issues must be reported to our technical support within 14 days from the date
          of the purchase. Clear evidence must be provided proving that the purchased product is not as it is described
          on the product description page. Complaints which are based merely on the customer's false expectations or
          wishes are not honored.
        </li>
      </ul>
      <br />
      <br />
      <p>
        In a description available on the preview page of each product we specify the third-party software that is
        compatible with our products. Please kindly note that we do not bear any responsibility and therefore we do not
        satisfy any refund/return/exchange requests based on the incompatibility of our products with some third-party
        software that is not specified in our products' descriptions.
      </p>
      <p>
        However, as a customer, you are responsible for understanding this upon purchasing any item at our site. There
        is no obligation to provide a refund or credit in the following situations:
      </p>
      <ul>
        <li>You change your mind about an item;</li>
        <li>You bought an item by mistake;</li>
        <li>You do not have sufficient expertise to use an item;</li>
      </ul>
      <br />
      <br />
      <p>
        Said Refund Policy is provided through our website in open access. Please note that when purchasing a product
        through our website you are, as a customer, considered to be aware of our Refund Policy statements.
      </p>
      <div class="callback-block">
        <h3 class="callback-block__title">Still have questions?</h3>
        <p class="callback-block__desc">Email us if you have a problem or just want to chat.</p>
        <a href="mailto:hello@airtap.io" class="callback-block__link">
          <span>hello@airtap.io</span>
        </a>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ArrowIcon from '@/assets/icons/arrow-icon.svg?inline'
export default Vue.extend({
  components: {
    ArrowIcon,
  },
  head() {
    return {
      title: 'Refund Policy'
    }
  },
  layout: 'profile',
})
</script>

<style lang="scss">
@import '@/assets/scss/main/sections/legal';
</style>
