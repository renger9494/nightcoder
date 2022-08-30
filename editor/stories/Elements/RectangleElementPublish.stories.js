import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
import RectangleElementPublish from '../../components/Publish/RectangleElementPublish';

Vue.use(VueCompositionApi);

export default {
  title: 'Elements/RectanglePublish',
  component: RectangleElementPublish,
  argTypes: {
    value: { id: 'fsa' }
  }
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { RectangleElementPublish },
  template: `<div style="width:100px;height: 100px;"><RectangleElementPublish v-bind="$props" /></div>`
});

export const Border = Template.bind({});
Border.args = {
  value: {
    id: 'rect-border',
    styles: {
      lg: {
        borderType: 'dashed',
        borderColor: '#dddddd',
        borderWidth: 3,
        borderRadius: 0,
        borderOpacity: 1
      }
    }
  }
};

export const BackgroundColor = Template.bind({});
BackgroundColor.args = {
  value: {
    id: 'rect-bg',
    styles: {
      lg: {
        borderType: 'dashed',
        borderColor: '#dddddd',
        borderWidth: 0,
        borderRadius: 0,
        borderOpacity: 1,
        fillColor: '#ff0000',
        fillOpacity: 0.1
      }
    }
  }
};

export const BoxShadow = Template.bind({});
BoxShadow.args = {
  value: {
    id: 'rect-shadow',
    styles: {
      lg: {
        borderType: 'dashed',
        borderColor: '#dddddd',
        borderWidth: 0,
        borderRadius: 0,
        borderOpacity: 1,
        fillColor: '#2d5456',
        fillOpacity: 0.5,
        shadowColor: '#333333',
        shadowOpacity: 0.3,
        shadowX: 12,
        shadowY: 32,
        shadowBlur: 12,
        shadowSpread: 2
      }
    }
  }
};

export const BorderRadius = Template.bind({});
BorderRadius.args = {
  value: {
    id: 'rect-border-radius',
    styles: {
      lg: {
        borderType: 'solid',
        borderColor: '#dddddd',
        borderWidth: 3,
        borderRadius: 12,
        borderOpacity: 1
      },
      sm: {
        borderType: 'solid',
        borderColor: '#dddddd',
        borderWidth: 12,
        borderRadius: 12,
        borderOpacity: 1
      }
    }
  }
};
