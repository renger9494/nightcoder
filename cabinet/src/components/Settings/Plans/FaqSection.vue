<template>
  <div class="faq-section">
    <h2 class="faq-section__title">FAQ</h2>
    <div class="faq-section__list">
      <div class="faq-section__list-column">
        <div class="faq-section__list-item">
          <h3 class="faq-section__subtitle">What’s a base?</h3>
          <p class="faq-section__text">
            A base is a collection of related tables, often reflecting a single
            project, process, or workflow that you collaborate on with your
            team. For example, you could make a base to organize your sales
            process, with tables for sales leads, companies, and deal
            opportunities.
          </p>
        </div>
        <div class="faq-section__list-item">
          <h3 class="faq-section__subtitle">What counts as a user?</h3>
          <p class="faq-section__text">
            Upgrades apply per-workspace. You will be charged for all
            collaborators who have edit or comment permissions to at least one
            base in the workspace. You will not be charged for read-only
            collaborators or people submitting forms. Charges are prorated,
            meaning collaborators with edit permissions added partway through
            the month will only be charged for the days they were collaborators.
          </p>
        </div>
        <div class="faq-section__list-item">
          <h3 class="faq-section__subtitle">
            What happens when I hit my usage limits?
          </h3>
          <p class="faq-section__text">
            If you reach our record or attachment limits, you’ll still be able
            to use your bases. We’ll let you know about the overage, and give
            you a grace period to find a plan that fits your needs!
          </p>
        </div>
        <div class="faq-section__list-item">
          <h3 class="faq-section__subtitle">
            How is the payment being processed?
          </h3>
          <p class="faq-section__text">
            We use Stripe to process your payment. It's the same payment
            provider used in products such as Twitter, Pinterest, and Lyft. We
            do not handle your credit card information directly.
          </p>
        </div>
        <div class="faq-section__list-item">
          <h3 class="faq-section__subtitle">What are my payment options?</h3>
          <p class="faq-section__text">
            The Generator App is an online tool that helps you to export
            ready-made templates ready to work as your future website. It helps
            you to combine slides, panels, and other components and export it as
            a set of static files: HTML/CSS/JS.
          </p>
        </div>
      </div>
      <div class="faq-section__list-column">
        <div class="faq-section__list-item">
          <h3 class="faq-section__subtitle">
            What payment types do you accept?
          </h3>
          <p class="faq-section__text">
            We currently accept PayPal, Visa, MasterCard and other major credit
            cards.
          </p>
        </div>
        <div class="faq-section__list-item">
          <h3 class="faq-section__subtitle">What are blocks?</h3>
          <p class="faq-section__text">
            Blocks are a premium feature that provide a creative palette of
            app-like functionality. Mix and match different blocks to create the
            perfect workflow for your team. Add charts, custom layouts,
            time-saving integrations, and more to your base.
          </p>
        </div>
        <div class="faq-section__list-item">
          <h3 class="faq-section__subtitle">What are my payment options?</h3>
          <p class="faq-section__text">
            All payments are made via credit card for Plus and Pro workspaces.
            For Enterprise accounts, we can issue an annual invoice with payment
            via PO and/or ACH, wire, or check. Please contact us for more
            information.
          </p>
        </div>
        <div class="faq-section__list-item">
          <h3 class="faq-section__subtitle">
            Do you have a Service-Level Agreements (SLA)?
          </h3>
          <p class="faq-section__text">
            We do not offer a standard SLA. For teams with greater than 100
            members, we can offer a custom SLA. Please contact us for details.
          </p>
        </div>
        <div class="faq-section__list-item">
          <h3 class="faq-section__subtitle">Can I change my payment method?</h3>
          <p class="faq-section__text">
            You can change your payment method at any time in your billing
            settings.
          </p>
        </div>
        <div class="faq-section__list-item">
          <h3 class="faq-section__subtitle">
            What happens if my payment fails? E.g. an expired credit card.
          </h3>
          <p class="faq-section__text">
            Your account email will be notified after each failed payment.
            Payments may be retried up to 4 times within the next month. After
            this, if the payment did not succeed, you will be downgraded to the
            free plan.
          </p>
        </div>
      </div>
    </div>
    <p class="faq-section__footer-text">
      If you cannot find the answer to your question,&nbsp;<a href="#"
        >message us.</a
      >
    </p>
  </div>
</template>

<style lang="scss" scoped>
.faq-section {
  max-width: 986px;

  @include xl-down {
    max-width: 706px;
  }

  @include lg-down {
    max-width: 100%;
  }

  &__title {
    font-size: 16px;
    font-weight: 500;
    line-height: normal;
    margin-top: 0;
    margin-bottom: 20px;
  }

  &__list {
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;

    @include lg-down {
      display: block;
    }

    @include xs-down {
      margin-bottom: 20px;
    }
  }

  &__list-column {
    flex: 0 1 420px;

    @include xl-down {
      flex-grow: 1;
      margin-right: 75px;
    }

    @include lg-down {
      margin-right: auto;
      margin-bottom: 40px;
      margin-left: auto;
    }

    &:last-child {
      @include xl-down {
        margin-right: 0;
      }

      @include lg-down {
        margin-bottom: 0;
      }
    }
  }

  &__list-item {
    margin-bottom: 40px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__subtitle {
    font-size: 18px;
    font-weight: 500;
    line-height: normal;
    margin-top: 0;
    margin-bottom: 10px;

    @include xs-down {
      font-size: 16px;
    }
  }

  &__text {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #555555;
    margin-top: 0;
    margin-bottom: 0;
  }

  &__footer-text {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #000000;
    margin-top: 0;
    margin-bottom: 0;

    @include xs-down {
      max-width: 250px;
      text-align: center;
      margin-right: auto;
      margin-left: auto;
    }

    a {
      font-weight: 400;
      text-decoration: none;
      color: #2f80ed;
    }
  }
}
</style>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  
})
</script>
