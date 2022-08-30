<template>
  <div class="help" :class="{ 'help--center' : isTitleCenter }">
    <div class="help__title">{{ title }}</div>
    <div class="help__content">
      <div class="help__colum">
        <div class="help__header">What’s a base?</div>
        <div class="help__p">
          A base is a collection of related tables, often reflecting a single
          project, process, or workflow that you collaborate on with your team.
          For example, you could make a base to organize your sales process,
          with tables for sales leads, companies, and deal opportunities.
        </div>

        <div class="help__header">What counts as a user?</div>
        <div class="help__p">
          Upgrades apply per-workspace. You will be charged for all
          collaborators who have edit or comment permissions to at least one
          base in the workspace. You will not be charged for read-only
          collaborators or people submitting forms. Charges are prorated,
          meaning collaborators with edit permissions added partway through the
          month will only be charged for the days they were collaborators.
        </div>

        <div class="help__header">What happens when I hit my usage limits?</div>
        <div class="help__p">
          If you reach our record or attachment limits, you’ll still be able to
          use your bases. We’ll let you know about the overage, and give you a
          grace period to find a plan that fits your needs!
        </div>

        <div class="help__header">How is the payment being processed?</div>
        <div class="help__p">
          We use Stripe to process your payment. It's the same payment provider
          used in products such as Twitter, Pinterest, and Lyft. We do not
          handle your credit card information directly.
        </div>

        <div class="help__header">What are my payment options?</div>
        <div class="help__p">
          The Generator App is an online tool that helps you to export
          ready-made templates ready to work as your future website. It helps
          you to combine slides, panels, and other components and export it as a
          set of static files: HTML/CSS/JS.
        </div>
      </div>
      <div class="help__colum">
        <div class="help__header">What payment types do you accept?</div>
        <div class="help__p">
          We currently accept PayPal, Visa, MasterCard and other major credit
          cards.
        </div>

        <div class="help__header">What are blocks?</div>
        <div class="help__p">
          Blocks are a premium feature that provide a creative palette of
          app-like functionality. Mix and match different blocks to create the
          perfect workflow for your team. Add charts, custom layouts,
          time-saving integrations, and more to your base.
        </div>

        <div class="help__header">What are my payment options?</div>
        <div class="help__p">
          All payments are made via credit card for Plus and Pro workspaces. For
          Enterprise accounts, we can issue an annual invoice with payment via
          PO and/or ACH, wire, or check. Please contact us for more information.
        </div>

        <div class="help__header">
          Do you have a Service-Level Agreements (SLA)?
        </div>
        <div class="help__p">
          We do not offer a standard SLA. For teams with greater than 100
          members, we can offer a custom SLA. Please contact us for details.
        </div>

        <div class="help__header">Can I change my payment method?</div>
        <div class="help__p">
          You can change your payment method at any time in your billing
          settings.
        </div>

        <div class="help__header">
          What happens if my payment fails? E.g. an expired credit card.
        </div>
        <div class="help__p">
          Your account email will be notified after each failed payment.
          Payments may be retried up to 4 times within the next month. After
          this, if the payment did not succeed, you will be downgraded to the
          free plan.
        </div>
      </div>
    </div>
    <transition name="popup-fade">
      <feedback-form v-if="isPopupOpen" class="feedback-form-popup" @closePopup="closePopup" />
    </transition>
    <air-button
      @click="isPopupOpen = true"
      class="help__btn"
      text="Submit feedback"
      image="submit-feedback"
    />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import AirButton from '@/components/Dashboard/Button.vue'
import FeedbackForm from "@/components/Shared/FeedbackForm/FeedbackForm.vue";

export default Vue.extend({
  components: { FeedbackForm, AirButton },
  props: {
    isTitleCenter: {
      type: Boolean,
      default: () => false
    },
    title: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isPopupOpen: false
    }
  },
  methods: {
    closePopup() {
      this.isPopupOpen = false;
    }
  }
})
</script>
<style lang="scss" scoped>
.help {
  font-family: 'Poppins', sans-serif;
  margin: 30px $margin_page_desktop 20px 0;
  &__title {
    font-weight: 500;
    font-size: 32px;
    line-height: 48px;
    margin-bottom: 20px;
  }
  &__content {
    display: grid;
    grid-template-columns: auto 45%;
    grid-gap: 80px;

    @include bp($sm) {
      grid-template-columns: auto;
      grid-gap: 0;
    }
  }
  &__header {
    font-weight: 500;
    font-size: 13px;
    line-height: 20px;
    margin-bottom: 8px;
  }
  &__p {
    font-weight: 400;
    font-size: 13px;
    line-height: 20px;
    margin-bottom: 30px;
  }
  &__btn {
    //position: absolute;
    //right: $margin_page_desktop;
    position: relative;
    right: 20px;
    margin-left: auto;
  }
}
.popup-fade-enter-active,
.popup-fade-leave-active {
  transition: all 0.5s ease;
}
.popup-fade-enter,
.popup-fade-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}
.feedback-form-popup {
  position: fixed;
  right: 60px;
  bottom: 67px;
  z-index: 1000000;

  @include bp($sm) {
    display: table;
    right: 0;
    bottom: 0;
    top: 0;
    left: 0;
    margin: auto;
  }

  @include bp(480px) {
    max-width: 90vw;
  }
}
</style>

