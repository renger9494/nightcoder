import PrefixInput from '@/components/Editor/Sidebar/Global/PrefixInput/PrefixInput.vue';
import { mount } from '@vue/test-utils';

describe('FontLineHeightPrefixInputTests', () => {
  test('TestFontLineHeightPrefixInputToNumber_WhenUserSetNumber', async () => {
    const wrapper = mount(PrefixInput, {
      propsData: {
        type: 'fontLineHeight',
        unit: 'px',
        value: 'normal',
        placeholder: '33'
      }
    });

    const prefixInput = wrapper.findComponent({ ref: 'prefixInput' });
    await prefixInput.setValue('123');

    expect(prefixInput.element.value).toBe('123');
    expect(wrapper.emitted().inputHandler).toBe(undefined);
    await prefixInput.trigger('blur');

    expect(wrapper.emitted().inputHandler.length).toBe(1);
    const data = wrapper.emitted().inputHandler[0][0].data;
    expect(data).toBe(123);
  });

  test('TestFontLineHeightPrefixInputToAuto_WhenUserFocusUnFocusInput', async () => {
    const wrapper = mount(PrefixInput, {
      propsData: {
        type: 'fontLineHeight',
        unit: 'px',
        value: 'normal',
        placeholder: '33'
      }
    });

    const prefixInput = wrapper.findComponent({ ref: 'prefixInput' });
    await prefixInput.trigger('focus');

    expect(wrapper.vm.inputValue).toBe('');

    await prefixInput.trigger('blur');

    const data = wrapper.emitted().inputHandler[0][0].data;
    expect(data).toBe('normal');
    expect(wrapper.vm.inputValue).toBe('Auto');
  });

  test('TestFontLineHeightPrefixInputToAuto_WhenUserResetValue', async () => {
    const wrapper = mount(PrefixInput, {
      propsData: {
        type: 'fontLineHeight',
        unit: 'px',
        value: '123',
        placeholder: '33'
      }
    });

    const prefixInput = wrapper.findComponent({ ref: 'prefixInput' });
    await prefixInput.setValue('');

    expect(wrapper.vm.inputValue).toBe('');
    expect(wrapper.emitted().inputHandler).toBe(undefined);

    //it's here because I don't know how to attach to inputHandler and to change an value
    const normalValue = 'normal';
    wrapper.setProps({ value: normalValue });
    await prefixInput.trigger('blur');

    expect(wrapper.emitted().inputHandler.length).toBe(1);
    const data = wrapper.emitted().inputHandler[0][0].data;
    expect(data).toBe(normalValue);

    expect(wrapper.vm.inputValue).toBe('Auto');
  });

  test('TestFontLineHeightPrefixInputEmitInputHandlerImmediate_WhenUserKeydownArrowUp', async () => {
    const wrapper = mount(PrefixInput, {
      propsData: {
        type: 'fontLineHeight',
        unit: 'px',
        value: 123,
        placeholder: '33'
      }
    });

    const prefixInput = wrapper.findComponent({ ref: 'prefixInput' });
    await prefixInput.trigger('focus');

    await prefixInput.trigger('keydown', { key: 'ArrowUp', keyCode: 38 });
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted().inputHandler.length).toBe(1);
    const upValue = wrapper.emitted().inputHandler[0][0].data;
    wrapper.setProps({ value: upValue });
  });

  test('TestFontLineHeightPrefixInputEmitInputHandlerImmediate_WhenUserKeydownArrowDown', async () => {
    const wrapper = mount(PrefixInput, {
      propsData: {
        type: 'fontLineHeight',
        unit: 'px',
        value: 123,
        placeholder: '33'
      }
    });

    const prefixInput = wrapper.findComponent({ ref: 'prefixInput' });
    await prefixInput.trigger('focus');

    await prefixInput.trigger('keydown', { key: 'ArrowDown', keyCode: 40 });
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted().inputHandler.length).toBe(1);
    const downValue = wrapper.emitted().inputHandler[0][0].data;
    expect(downValue).toBe(wrapper.props().value - 1);
  });

  test('TestFontLineHeightPrefixInputSetDefaultValue_WhenUserFocusAndKeydownArrowUpAndLineHeightIsAuto', async () => {
    const wrapper = mount(PrefixInput, {
      propsData: {
        type: 'fontLineHeight',
        unit: 'px',
        value: 'normal',
        placeholder: '33'
      }
    });

    const prefixInput = wrapper.findComponent({ ref: 'prefixInput' });
    await prefixInput.trigger('focus');

    await prefixInput.trigger('keydown', { key: 'ArrowUp', keyCode: 38 });
    expect(wrapper.emitted().inputHandler.length).toBe(1);
    expect(prefixInput.element.value).toBe(`${+wrapper.vm.placeholder + 1}`);
  });

  test('TestPrefixInputSetAnotherValue_WhenUserResizeElementOrChangePosition', async () => {
    const wrapper = mount(PrefixInput, {
      propsData: {
        type: 'fontLineHeight',
        unit: 'px',
        value: '33',
        placeholder: '33'
      }
    });

    expect(wrapper.vm.inputValue).toBe('33');

    wrapper.setProps({ value: '35' });
    await wrapper.vm.$nextTick(); // <== because watcher fire in next tick

    expect(wrapper.vm.inputValue).toBe('35');
  });
});
