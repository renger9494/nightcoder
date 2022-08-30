<template>
  <label class="feedback-form-upload" :class="{ error: isError }">
    <span class="feedback-form-upload__label">Attachments</span>
    <span class="feedback-form-upload__error" v-if="isError">The file is too large to be upload.</span>
    <span class="feedback-form-upload__title">
      <template v-if="!fileName">
        <span>Upload a file</span>
        <svg-icon name="upload-cloud-icon" width="15" height="14" color="#949CAD" />
      </template>
      <span v-else>{{ fileName }}</span>
    </span>
    <span v-if="!fileName" class="feedback-form-upload__text">Maximum upload file size: 10MB</span>
    <input @change="onFileChange" class="feedback-form-upload__input" type="file" hidden accept="image/*" />
  </label>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'FeedbackFormFile',
  data() {
    return {
      fileName: '',
      isError: false
    };
  },
  methods: {
    onFileChange(e) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        this.fileName = '';
        this.isError = false;
        this.$emit('fileChange', null);
        return;
      }
      const fileSize = files[0].size / 1024 / 1024;
      if (fileSize > 10) {
        this.isError = true;
        return;
      }
      this.isError = false;
      this.fileName = files[0].name;
      this.$emit('fileChange', files[0]);
    }
  }
});
</script>

<style lang="scss" scoped>
.feedback-form-upload {
  display: block;
  border: 1px solid $gray300;
  padding: 6px 8px;
  border-radius: $shape_border_radius;
  transition: 0.3s;
  cursor: pointer;
  position: relative;
  text-align: center;

  &.error {
    border-color: $danger;
  }

  &:hover {
    border-color: $gray600;
  }

  &__title {
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: $black;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  svg {
    margin: 0 0 0 4px;
  }

  &__input {
    display: none;
  }

  &__label {
    position: absolute;
    left: 0;
    top: 0;
    transform: translateY(-100%);
    font-weight: 400;
    font-size: 13px;
    line-height: 20px;
    color: $black;
  }

  &__error {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 10px;
    line-height: 20px;
    color: $danger;
    transform: translateY(-100%);
  }

  &__text {
    font-size: 10px;
    line-height: 15px;
    color: $gray700;
  }
}
</style>
