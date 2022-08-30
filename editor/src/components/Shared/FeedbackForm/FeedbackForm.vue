<template>
  <div class="feedback-form" v-click-outside="closePopup" @keydown.esc="closePopup" ref="modal" tabindex="0">
    <div class="feedback-form__head">
      <h2 class="feedback-form__title">{{ !isSubmited ? 'Submit a request' : '' }}</h2>
      <div class="feedback-form__btn" @click="closePopup">
        <svg-icon name="close" width="8" height="8" color="#BDBDBD" />
      </div>
    </div>
    <div class="feedback-form__body">
      <template v-if="!isSubmited">
        <feedback-form-field
          label="Your Email address *"
          v-model="form.Email"
          type="input"
          class="feedback-form__input"
          :error-text="isEmailEmpty ? 'The field cannot be empty' : 'Please enter a valid email'"
          :is-valid="isEmailValid"
        />
        <feedback-form-field
          label="Subject *"
          v-model="form.Subject"
          type="input"
          class="feedback-form__input"
          error-text="The field cannot be empty"
          :is-valid="isSubjectValid"
        />
        <feedback-form-field
          label="Description *"
          v-model="form.Description"
          type="textarea"
          class="feedback-form__input"
          error-text="The field cannot be empty"
          :is-valid="isDescriptionValid"
        />
        <feedback-form-file
          class="feedback-form__file"
          @fileChange="fileChange"
          error-text="The file is too large to be upload."
        />
        <button @click="submit" class="feedback-form__button" :class="{ loading: isLoading }">
          <svg-icon v-if="isLoading" name="loader-icon" width="16" height="16" color="#fff" />
          <span v-else>Submit</span>
        </button>
      </template>
      <template v-else>
        <img
          class="feedback-form__image"
          src="@/assets/img/editor/published-success.png"
          srcset="@/assets/img/editor/published-success@2x.png 2x"
          alt="new"
        />
        <p class="feedback-form__text">Thank you! You’ll get the answer from us soon.</p>
        <button @click="isSubmited = false" class="feedback-form__button">Submit again</button>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import http from '@/utils/http';
import FeedbackFormField from '@/components/Shared/FeedbackForm/FeedbackFormField.vue';
import FeedbackFormFile from '@/components/Shared/FeedbackForm/FeedbackFormFile.vue';
import { FeedbackDto } from '@/utils/apiClient';
import { Converter } from '@/utils/converter';

export default Vue.extend({
  name: 'FeedbackForm',
  components: { FeedbackFormFile, FeedbackFormField },
  data() {
    return {
      form: {
        Email: '',
        Description: '',
        Subject: '',
        Attachment: null
      } as FeedbackDto,
      isSubmitting: false,
      isSubmited: false,
      isLoading: false
    };
  },
  computed: {
    isFormValid(): boolean {
      return this.isEmailValid || this.isSubjectValid || this.isDescriptionValid;
    },
    isEmailValid(): boolean {
      return this.isSubmitting && !this.validateEmail(this.form.Email ?? '');
    },
    isEmailEmpty(): boolean {
      return !this.form.Email?.length;
    },
    isSubjectValid(): boolean {
      return this.isSubmitting && !this.form.Subject?.length;
    },
    isDescriptionValid(): boolean {
      return this.isSubmitting && !this.form.Description?.length;
    }
  },
  methods: {
    fileChange(file: File) {
      this.form.Attachment = file;
    },
    closePopup() {
      this.$store.commit('ui/changeFeedbackOpenType', false);
    },
    submit() {
      this.isSubmitting = true;
      if (this.isFormValid) return;
      this.isLoading = true;
      const formData = Converter.jsonToFormData(this.form);

      http
        .post('/api/feedback', formData)
        .then(() => {
          this.isSubmited = true;
          this.isSubmitting = false;
          this.resetForm();
        })
        .catch(() => {
          this.resetForm();
        });
    },
    validateEmail(email: string): boolean {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },
    resetForm() {
      this.isLoading = false;
      this.form = {
        Email: '',
        Description: '',
        Subject: '',
        Attachment: null
      };
    }
  },
  mounted() {
    (this.$refs?.modal as HTMLDivElement).focus();
  }
});
</script>

<style lang="scss" scoped>
.feedback-form {
  padding: $padding_l;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  background: $white;
  max-width: 432px;
  width: 100%;
  outline: none;

  &__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0 $padding_l;
    cursor: pointer;
  }

  &__title {
    font-weight: 400;
    font-size: 25px;
    line-height: 38px;
    color: $black;
  }

  &__btn {
    width: 20px;
    height: 20px;
    background: $gray100;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      transition: 0.3s;
    }

    &:hover {
      svg {
        color: $black !important;
      }
    }
  }

  &__input {
    margin: 0 0 $margin_l;
  }

  &__button {
    padding: 7px 8px;
    background: $black;
    font-weight: 500;
    font-size: 13px;
    line-height: 20px;
    color: $white;
    width: 100%;
    border: 1px solid $black;
    border-radius: $shape_border_radius;
    cursor: pointer;
    transition: 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      animation: spin 1s linear infinite;
    }

    &:hover {
      background: $white;
      color: $black;
    }

    &.loading {
      pointer-events: none;
    }
  }

  &__file {
    margin: 36px 0 30px;
  }

  &__image {
    max-width: 112px;
    width: 100%;
    margin: 0 auto;
    display: block;
  }

  &__text {
    margin: 20px auto 30px;
    font-size: 25px;
    line-height: 38px;
    text-align: center;
    max-width: 328px;
  }
}

@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
