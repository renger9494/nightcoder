import AnchorPoints from '../../../src/helpers/AnchorPoints';

describe('addAP', () => {
  test(`Добавление новой AP {x:100, y:200}
        xMap должна иметь ключ 100 со значением Map 200=>{apCount:1},
        yMap ключ 200 со значением Map 100=>{apCount:1}`, () => {
    const aps = new AnchorPoints();
    aps.addAP(100, 200);
    expect(aps.xAP).toEqual(new Map().set(100, new Map().set(200, { apCount: 1 })));
    expect(aps.yAP).toEqual(new Map().set(200, new Map().set(100, { apCount: 1 })));
  });
  test(`Добавление двух одинаковых AP {x:100, y:200}
        xMap должна иметь ключ 100 со значением Map 200=>{apCount:2},
        yMap ключ 200 со значением Map 100=>{apCount:2}`, () => {
    const aps = new AnchorPoints();
    aps.addAP(100, 200);
    aps.addAP(100, 200);
    expect(aps.xAP).toEqual(new Map().set(100, new Map().set(200, { apCount: 2 })));
    expect(aps.yAP).toEqual(new Map().set(200, new Map().set(100, { apCount: 2 })));
  });
  test(`Добавление новой AP {x:105, y:300}, AP {x:100,y:200} уже существует
        xMap должна иметь ключ 100 со значением Map 200=>{apCount:1},и ключ 105 со значением Map 300=>{apCount:1},
        yMap ключ 300 со значением Map 105=>{apCount:1} и ключ 200 со значением Map 100=>{apCount:1}`, () => {
    const aps = new AnchorPoints();
    aps.addAP(100, 200);
    aps.addAP(105, 300);
    const expectedXMap = new Map();
    const expectedOrtCoordinates = new Map();
    expectedOrtCoordinates.set(200, { apCount: 1 });
    expectedXMap.set(100, expectedOrtCoordinates);
    const expectedOrtCoordinates2 = new Map();
    expectedOrtCoordinates2.set(300, { apCount: 1 });
    expectedXMap.set(105, expectedOrtCoordinates2);
    expect(aps.xAP).toEqual(expectedXMap);
    const expectedYMap = new Map();
    expectedYMap.set(300, new Map().set(105, { apCount: 1 }));
    expectedYMap.set(200, new Map().set(100, { apCount: 1 }));
    expect(aps.yAP).toEqual(expectedYMap);
  });
});

describe('deleteAP', () => {
  test(`Удaление AP {x:100, y:200},
        AP {x:100,y:300},AP {x:100,y:200} существуют
        xMap должна иметь ключ 100 со значением Map 300=>{apCount:1},
        yMap ключ 300 со значением Map 100=>{apCount:1}`, () => {
    const aps = new AnchorPoints();
    aps.addAP(100, 200);
    aps.addAP(100, 300);
    aps.deleteAP(100, 200);
    const expectedXMap = new Map();
    const expectedXOrtCoordinates = new Map();
    expectedXOrtCoordinates.set(300, { apCount: 1 });
    expectedXMap.set(100, expectedXOrtCoordinates);
    const expectedYMap = new Map();
    const expectedYOrtCoordinates = new Map();
    expectedYOrtCoordinates.set(100, { apCount: 1 });
    expectedYMap.set(300, expectedYOrtCoordinates);
    expect(aps.xAP).toEqual(expectedXMap);
    expect(aps.yAP).toEqual(expectedYMap);
  });
});

describe('findAPs', () => {
  test(`Поиск xAP {x:100, y:150} с дельта 5,
        При условии что есть AP {x:100,y:300},AP {x:100,y:200}
        должен быть возвращен объект вида {"coordinate": 100, "coordinates": [200, 300]}`, () => {
    const aps = new AnchorPoints();
    aps.addAP(100, 200);
    aps.addAP(100, 300);
    const expectedObject = { coordinate: 100, ortCoordinates: [200, 300] };
    const coordinates = aps.findYCoordinates(100, 5);
    expect(coordinates).toEqual(expectedObject);
  });
});
