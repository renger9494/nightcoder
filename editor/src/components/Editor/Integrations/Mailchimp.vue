<template>
  <div class="integration_mailchimp"></div>
</template>

<script>
//TODO: remove it
export default {
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    projectId: {
      type: String
    }
  },
  computed: {
    scriptsToHead() {
      return `
        document.addEventListener("DOMContentLoaded", function() {
          const forms = document.querySelectorAll(".form-element-wrapper");

          var projectId = ${this.projectId || null};
          var listId = '${this.value.integrations.mailchimp.list.id}';

          forms.forEach( (form, index) => {
            var subscribe = form.querySelector("button");
            subscribe.addEventListener("click", function() {
              var email = form.querySelector("input").getAttribute("value");

              var json = JSON.stringify({
                listId: listId,
                email: email
              });
              var request = new XMLHttpRequest();
              var url =
                "https://apidev.airtap.io/api/integration/mailchimp/" +
                projectId +
                "/createMember";
              request.open("POST", url);
              request.send(json);
            });
          });
        });

      `;
    }
  }
};
</script>
