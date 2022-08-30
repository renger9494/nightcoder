import { getRgba } from "@/helpers/hexToRgb";

describe("HexToRgbTests", () => {

    test("TestGetRgba_WhenUserTypeValidValue", () => {
        const color = "#fefefe";
        const opacity = 1;

        const result = getRgba(color, opacity);

        expect(result).toBe(`rgba(254,254,254,${opacity})`);
    });

    test("TestGetRgba_WhenUserTypeValidValueWithoutSharp", () => {
        const color = "fefefe";
        const opacity = 1;

        const result = getRgba(color, opacity);

        expect(result).toBe(`rgba(254,254,254,${opacity})`);
    });

    test("TestGetRgba_WhenUserTypeNotValidValue", () => {
        const color = "fe";
        const opacity = 1;

        const result = getRgba(color, opacity);

        expect(result).toBe(`rgba(0,0,0,${opacity})`);
    });
}) 