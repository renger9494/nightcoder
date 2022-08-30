/*
 It's used in airtap=publish-ruler 
*/
import { startCase as _startCase } from 'lodash';
import ObjectKeys from '../utils/types/ObjectKeys';

const horizontalItems: ObjectKeys<number> = {
    LEFT: 0,
    CENTER: 1,
    RIGHT: 2
}

const verticalItems: ObjectKeys<number> = {
    TOP: 0,
    CENTER: 1,
    BOTTOM: 2
}

const positionTypes = {
    WINDOW: 0,
    CONTAINER: 1
}

let positionItems = [];
let horizontalPositionItems = [];
let verticalPositionItems = [];

for (const verticalItemKey in verticalItems) {
    const verticalItem = verticalItems[verticalItemKey];
    verticalPositionItems.push({ id: verticalItem, name: _startCase(verticalItemKey.toLowerCase()), value: verticalItem });
    for (const horizontalItemKey in horizontalItems) {
        const horizontalItem = horizontalItems[horizontalItemKey];
        if (horizontalPositionItems.findIndex(x => x.id == horizontalItem) == -1)
            horizontalPositionItems.push({
                id: horizontalItem, name: _startCase(horizontalItemKey.toLowerCase()), value: horizontalItem
            });
        positionItems.push({
            id: `${horizontalItem}-${verticalItem}`,
            vertical: verticalItem,
            horizontal: horizontalItem,
            isActive: false
        });
    }
}

horizontalPositionItems.push({ id: `${horizontalItems.LEFT}-${horizontalItems.RIGHT}`, name: "Left and Right", value: horizontalItems.LEFT, additionalValue: horizontalItems.RIGHT });
verticalPositionItems.push({ id: `${verticalItems.TOP}-${verticalItems.BOTTOM}`, name: "Top and Bottom", value: verticalItems.TOP, additionalValue: verticalItems.BOTTOM });

export default {
    horizontalItems,
    verticalItems,
    horizontalPositionItems,
    verticalPositionItems,
    items: positionItems,
    types: positionTypes
}