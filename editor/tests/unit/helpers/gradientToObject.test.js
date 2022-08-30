import convertGradientToObject from '@/helpers/convertGradientToObject';

describe('gradientToObjectTest', () => {
  test('gradientToObjectLinearTypeTest', () => {
    const expectedLinearGradientObject = {
      type: 'linear',
      degree: 217,
      points: [
        {
          left: 0,
          red: 255,
          green: 0,
          blue: 0,
          alpha: 0.8
        },
        {
          left: 70,
          red: 255,
          green: 0,
          blue: 0,
          alpha: 0
        }
      ]
    };
    const linearGradient = 'linear-gradient(217deg, rgba(255,0,0,0.8) 0%, rgba(255,0,0,0) 70%)';

    const gradientObjectOutput = convertGradientToObject(linearGradient);

    expect(gradientObjectOutput).toStrictEqual(expectedLinearGradientObject);
  });

  test('gradientToObjectRadialTypeTest', () => {
    const expectedLinearGradientObject = {
      type: 'radial',
      degree: 0,
      points: [
        {
          left: 0,
          red: 255,
          green: 0,
          blue: 0,
          alpha: 0.8
        },
        {
          left: 70,
          red: 255,
          green: 0,
          blue: 0,
          alpha: 0
        }
      ]
    };
    const radialGradient = 'radial-gradient( rgba(255,0,0,0.8) 0%, rgba(255,0,0,0) 70%)';

    const gradientObjectOutput = convertGradientToObject(radialGradient);

    expect(gradientObjectOutput).toStrictEqual(expectedLinearGradientObject);
  });
});
