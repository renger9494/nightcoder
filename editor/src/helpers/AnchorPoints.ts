type AnchorPointsMap = Map<number, Map<number, { apCount: number }>>;
type Coordinate = { coordinate: number; ortCoordinates: number[] };
export type Point = { x: number; y: number };
export type XAps = { x: number; coordinates: Coordinate };
export type YAps = { y: number; coordinates: Coordinate };
/**
 * Реестр якорных точек элементов
 */
export default class AnchorPoints {
  /**
   * Погрешность с которой вычисляются aps
   */
  static DELTA = 5;
  private delta: number;
  /**
   * Координаты x якорных точек элементов. В качестве ключа используется координата x, значением является массив
   * координат y якорных точек имеющий координату x равную ключу
   * @example Map(100=>Map(200=>{apCount:1}))
   */
  xAP: AnchorPointsMap;
  /**
   * Координаты "y" якорных точек элементов. В качестве ключа используется координата y, значением является map
   * координат x якорных точек имеющий координату y равную ключу
   * @example Map(100=>Map(200=>{apCount:1}))
   */
  yAP: AnchorPointsMap;

  constructor(props: { delta?: null | undefined | number } = {}) {
    this.delta = props.delta !== undefined && props.delta !== null ? props.delta : AnchorPoints.DELTA;

    this.xAP = new Map();
    this.yAP = new Map();
  }

  /**
   * Добавление ortogonaleCoordinate в соответствующий map с ключом coordinate.
   * Например для якорной точки {x,y} для координаты x добавляется y координата в xAP
   * в map ортогональных координат(y) полученных по ключу coordinate.
   */
  private addOrtogonaleCoordinate(map: AnchorPointsMap, coordinate: number, ortogonaleCoordinate: number) {
    const ortogonaleCoordinatesMap = map.get(coordinate);
    if (!ortogonaleCoordinatesMap) return;
    const ortogonaleCoordinateDescription = ortogonaleCoordinatesMap.get(ortogonaleCoordinate);
    if (ortogonaleCoordinateDescription) {
      ortogonaleCoordinateDescription.apCount += 1;
    } else {
      ortogonaleCoordinatesMap.set(ortogonaleCoordinate, { apCount: 1 });
    }
  }

  /**
   * Удаление ortogonaleCoordinate из соответствующeй map с ключом coordinate.
   * Например для якорной точки {x,y} для координаты x удаляется y координата в xAP
   * в map ортогональных координат(y) полученных по ключу coordinate.
   */
  private deleteCoordinateFromAP(map: AnchorPointsMap, coordinate: number, ortogonaleCoordinate: number) {
    const ortogonaleCoordinatesMap = map.get(coordinate);
    if (!ortogonaleCoordinatesMap) return undefined;
    const ortogonaleCoordinateDescription = ortogonaleCoordinatesMap.get(ortogonaleCoordinate);
    if (ortogonaleCoordinateDescription) {
      ortogonaleCoordinateDescription.apCount -= 1;
    } else {
      return undefined;
    }
    if (ortogonaleCoordinateDescription.apCount === 0) {
      ortogonaleCoordinatesMap.delete(ortogonaleCoordinate);
    }
    return ortogonaleCoordinatesMap.size;
  }

  /**
   * Поиск ближайшей координаты с допустимой дельта
   */
  private findClosestCoordinate(coordinate: number, apMap: AnchorPointsMap, delta: number) {
    for (let i = coordinate - delta; i <= coordinate + delta; i++) {
      if (apMap.has(i)) {
        return i;
      }
    }
    return null;
  }

  /**
   * Поиск координат по map с допустимой дельта
   */
  private findCoordinates(coordinate: number, apMap: AnchorPointsMap, delta = this.delta) {
    const closestCoordinate = this.findClosestCoordinate(coordinate, apMap, delta);
    if (closestCoordinate == null) return undefined;

    const ap = apMap.get(closestCoordinate);
    if (!ap) return undefined;
    return { coordinate: closestCoordinate, ortCoordinates: [...ap.keys()] };
  }

  /**
   * Поиск координат по x с допустимой дельта
   */
  findYCoordinates(coordinate: number, delta = this.delta) {
    return this.findCoordinates(coordinate, this.xAP, delta);
  }

  /**
   * Поиск координат по y с допустимой дельта
   */
  findXCoordinates(coordinate: number, delta = this.delta) {
    return this.findCoordinates(coordinate, this.yAP, delta);
  }

  /**
   * Возвращает объект {xApsArray, yApsArray} содержащий координаты якорных точек, подходящих
   * под якорные точки переданные в параметрах aps
   */
  getSimilar(aps: Point[]) {
    const xApsArray: XAps[] = [];
    const yApsArray: YAps[] = [];
    const checkedX: Set<number> = new Set();
    const checkedY: Set<number> = new Set();
    for (const ap of aps) {
      if (!checkedX.has(ap.x)) {
        const yCoords = this.findYCoordinates(ap.x);
        if (yCoords) xApsArray.push({ x: ap.x, coordinates: yCoords });
        checkedX.add(ap.x);
      }
      if (!checkedY.has(ap.y)) {
        const xCoords = this.findXCoordinates(ap.y);
        if (xCoords) yApsArray.push({ y: ap.y, coordinates: xCoords });
        checkedY.add(ap.y);
      }
    }

    return { xApsArray, yApsArray };
  }

  /**
   * Добавление якорной точки в реестр
   */
  addAP(x: number, y: number) {
    if (isNaN(x) || isNaN(y)) return;
    if (!this.xAP.get(x)) {
      this.xAP.set(x, new Map().set(y, { apCount: 1 }));
    } else {
      this.addOrtogonaleCoordinate(this.xAP, x, y);
    }
    if (!this.yAP.get(y)) {
      this.yAP.set(y, new Map().set(x, { apCount: 1 }));
    } else {
      this.addOrtogonaleCoordinate(this.yAP, y, x);
    }
  }

  /**
   * Удаление якорной точки
   */
  deleteAP(x: number, y: number) {
    if (this.deleteCoordinateFromAP(this.xAP, x, y) === 0) {
      this.xAP.delete(x);
    }
    if (this.deleteCoordinateFromAP(this.yAP, y, x) === 0) {
      this.yAP.delete(y);
    }
  }
}
