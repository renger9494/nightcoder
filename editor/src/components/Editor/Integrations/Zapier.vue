<template>
  <div class="integration_zapier"></div>
</template>

<script>
//TODO: change it because we change a way to publish projects
export default {
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    projectId: {
      type: Number
    }
  },
  mounted() {
    var projectId = this.projectId;

    const forms = document.querySelectorAll('.form-element-wrapper');

    forms.forEach((form, index) => {
      var subscribe = form.querySelector('button');
      subscribe.addEventListener('click', function() {
        var email = form.querySelector('input').getAttribute('value');
        var json = JSON.stringify({
          email: email
        });
        var request = new XMLHttpRequest();
        var url = 'https://apidev.airtap.io/api/integration/zapier/' + projectId + '/createMember';
        request.open('POST', url);
        request.send(json);
      });
    });
  }
};
</script>
