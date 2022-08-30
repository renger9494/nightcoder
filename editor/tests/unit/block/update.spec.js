import { breakpointsWidths, breakpoints } from '@/constants/breakpoints';
import axios from 'axios';
import fontImporter from '@/helpers/font/fontImporter';

const blockUpdateStatus = {
  canBeUpdated: 1,
  updated: 2,
  notUpdated: 3
};

const textBoxStyle = {
  autowidth: 0,
  autoheight: 1,
  fixed: 2
};

class Api {
  static async client(baseUrl, credentials) {
    axios.defaults.adapter = require('axios/lib/adapters/http');
    const api = axios.create({
      baseURL: baseUrl,
      timeout: 3000,
      withCredentials: true,
      headers: {
        'access-control-allow-origin': '*',
        'access-control-allow-credentials': 'true',
        'Content-Type': 'application/json'
      }
    });

    const res = await api.post('/api/auth/login', credentials);
    console.log(res.headers['set-cookie'][0]);
    api.defaults.headers.Cookie = res.headers['set-cookie'][0];
    return api;
  }
}

async function getInterfaceBlockById(api, id) {
  try {
    const { data } = await api.get(`/api/interface/Block/${id}`);
    return data;
  } catch (e) {
    console.error('getInterfaceBlockById ERROR', e);
  }
}

async function getInterfaceBlocks(api) {
  try {
    const { data } = await api.get(`/api/interface/blocks/byCategories`);
    const blocks = [];
    data
      .filter(x => x.items)
      .forEach(category => {
        blocks.push(...category.items);
      });
    return blocks;
  } catch (e) {
    console.error('getInterfaceBlocks ERROR', e);
  }
}

async function getTemplates(api) {
  const templatesToUpdate = ['Portfolio Alien', 'Arthouse Landing Page', 'Digital agency', 'Serene', 'EveryMeet'];
  try {
    const { data } = await api.get('/api/templates');
    return data.items.map(template => template.id);
  } catch (e) {
    console.log(e);
  }
}

async function getTemplateConfigById(api, id) {
  try {
    const { data } = await api.get(`/api/templates/${id}/config`);
    return data;
  } catch (e) {
    console.log(e);
  }
}

async function updateTemplateConfigById(api, id, config) {
  try {
    const { data } = await api.post(`/api/templates/${id}/config`, config);
    return data;
  } catch (e) {
    console.log(e);
  }
}

function updateElement(element) {
  breakpoints.forEach(({ name }) => {
    const elLocation = element.location[name];
    const bpWidth = breakpointsWidths[name];
    if (elLocation) {
      if (elLocation.x) {
        elLocation.xInPercent = ((elLocation.x / bpWidth) * 100).toFixed(4);
      }
      if (elLocation.w) {
        elLocation.wInPercent = ((elLocation.w / bpWidth) * 100).toFixed(4);
      }
      if (typeof elLocation.textBoxStyle === 'string') {
        elLocation.textBoxStyle = textBoxStyle[elLocation.textBoxStyle];
      }
    }

    if (element.type === 'icon') {
      const elStyles = element.styles[name];
      elStyles.objectFit = 'contain';
    }

    if (element.type === 'text') {
      const elStyles = element.styles[name];
      if (elStyles?.font) {
        const fontSize = elStyles.font
          .split(' ')[2]
          .split('/')[0]
          .slice(0, -2);

        elStyles.fontSize = `${(parseFloat(fontSize) / bpWidth) * 100}vw`;
      }
    }
  });

  return element;
}

function updateBlockConfig(elements) {
  for (let element of elements) {
    element = updateElement(element);
  }
  return elements;
}

const getAllElementsByType = (type, allComponents) => {
  const allComponentsArr = Object.values(allComponents);
  return allComponentsArr.filter(element => element.type === type);
};

const actualiseFontList = allComponents => {
  const allTextElements = getAllElementsByType('text', allComponents);
  const allFonts = [];
  for (const text of allTextElements) {
    if (text.payload.font) {
      const fontFamilies = Object.values(text.payload.font);
      allFonts.push(...fontFamilies);
    }
  }
  return [...new Set(allFonts)];
};

const createFontFamily = fontFamily => {
  let fontToString = `${fontFamily}:`;
  const googleFont = fontImporter.find(font => font.family === fontFamily);
  const filteredVariants = googleFont.variants.filter(el => el.style === 'normal' && el.name !== 'italic');

  filteredVariants.forEach((variant, index) => {
    fontToString += filteredVariants.length - 1 === index ? `${variant.name}` : `${variant.name},`;
  });
  return fontToString;
};

const setFontFamilyToPayload = textArr => {
  for (const textEl of textArr) {
    const breakpoints = Object.entries(textEl.styles);
    textEl.payload.font = {};
    for (const [key, breakpoint] of breakpoints) {
      if (breakpoint.font.match(/"(.*)"/)) {
        const fontFamily = breakpoint.font.match(/"(.*)"/)[1];
        if (fontFamily) {
          textEl.payload.font[key] = createFontFamily(fontFamily);
        }
      }
    }
  }
};

async function updateInterfaceBlock(api, block, id) {
  try {
    await api.put(`/api/interface/Block/${id}`, block);
    return blockUpdateStatus.updated;
  } catch (e) {
    console.log(e);
    return blockUpdateStatus.notUpdated;
  }
}

describe('update', () => {
  test('block', async () => {
    const api = await Api.client('https://apibeta.airtap.io', {
      userName: 'shushanyandaniel@gmail.com',
      password: '$5GoUtyi-9'
    });
    const blocks = await getInterfaceBlocks(api);
    const failedData = [];
    const updateData = [];

    for (const item of blocks) {
      const block = await getInterfaceBlockById(api, item.id);
      const config = JSON.parse(block.config);
      if (
        !config.blockConfig ||
        Object.keys(config.blockConfig).length === 0 ||
        typeof config.blockConfig === 'string'
      ) {
        failedData.push(`Failed to update Block ${item.id}`);
      } else {
        config.blockConfig.elements = updateBlockConfig(config.blockConfig.elements);
        block.config = JSON.stringify(config);

        const status = await updateInterfaceBlock(api, block, item.id);
        if (status === blockUpdateStatus.notUpdated) {
          failedData.push(`Failed to update Block ${item.id}`);
        } else {
          updateData.push(`Updated Block ${item.id}`);
        }
      }
    }

    console.table(failedData);
    console.table(updateData);

    expect(true).toBe(true);
  }, 120000);
  test('templates', async () => {
    const api = await Api.client('https://apiadminbeta.airtap.io', {
      userName: 'shushanyandaniel@gmail.com',
      password: '$5GoUtyi-9'
    });

    const templates = await getTemplates(api);

    for (const item of templates) {
      let { config } = await getTemplateConfigById(api, item);
      config = JSON.parse(config);

      for (const block of config.config.components) {
        block.elements = updateBlockConfig(block.elements);
      }

      if (config.config.allComponents) {
        for (let element of Object.values(config.config.allComponents)) {
          if (element.type !== 'block') {
            element = updateElement(element);
          }
        }
      }
      config = JSON.stringify(config);

      const data = await updateTemplateConfigById(api, item, {
        templateId: item,
        config
      });

      console.log(data);
    }
  }, 150000);
  test('templatesFont', async () => {
    const api = await Api.client('https://apiadminbeta.airtap.io', {
      userName: 'shushanyandaniel@gmail.com',
      password: '$5GoUtyi-9'
    });

    const templates = await getTemplates(api);

    for (const item of templates) {
      let { config } = await getTemplateConfigById(api, item);
      config = JSON.parse(config);
      if (config.config.allComponents) {
        const textArr = getAllElementsByType('text', config.config.allComponents);
        setFontFamilyToPayload(textArr);
      }
      if (config.config.components.length) {
        const blocks = config.config.components;
        for (const block of blocks) {
          const textArr = block.elements.filter(elem => elem.type === 'text');
          setFontFamilyToPayload(textArr);
        }
      }
      if (config.config.allComponents) {
        config.config.googleFonts.fonts = actualiseFontList(config.config.allComponents);
      }
      config = JSON.stringify(config);
      const data = await updateTemplateConfigById(api, item, {
        templateId: item,
        config
      });
      console.log(data);
      expect(true).toBe(true);
    }
  }, 150000);
  test('blockFont', async () => {
    const api = await Api.client('https://apibeta.airtap.io', {
      userName: 'shushanyandaniel@gmail.com',
      password: '$5GoUtyi-9'
    });
    const blocks = await getInterfaceBlocks(api);

    for (const item of blocks) {
      const block = await getInterfaceBlockById(api, item.id);
      const config = JSON.parse(block.config);
      const blockConfig = config.blockConfig;
      if (blockConfig) {
        if (blockConfig.elements && blockConfig.elements.length) {
          const textArr = blockConfig.elements.filter(elem => elem.type === 'text');
          setFontFamilyToPayload(textArr);
        }
      }

      block.config = JSON.stringify(config);
      const status = await updateInterfaceBlock(api, block, item.id);
      console.log(status === 2 ? 'Updated' : 'Not :(');
    }
  }, 150000);
});
