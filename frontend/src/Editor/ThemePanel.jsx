//Editor/ThemePanel.jsx


import { BRAND_OPTIONS, FONT_OPTIONS, PAGE_BG_OPTIONS, THEME_DEFAULTS, useGoogleFont } from "../utils/theme";
import { CustomizeCard, ResetButton, SchemaForm } from "./panelControls";

const FIELDS = [
    { key: "brand", label: "Brand color", type: "swatches", options: BRAND_OPTIONS, group: "Colors", hint: "Buttons, badges and highlights across the whole site follow this color." },
    { key: "pageBackground", label: "Page background", type: "swatches", options: PAGE_BG_OPTIONS, group: "Colors" },
    { key: "font", label: "Font", type: "select", options: FONT_OPTIONS, group: "Typography" },
];

function ThemePanel({ theme, setTheme }) {
    useGoogleFont(theme.font);
    const font = FONT_OPTIONS.find((f) => f.value === theme.font) || FONT_OPTIONS[0];

    return (
        <div className="animate-fadeIn">
            <CustomizeCard step={1} label="Theme">
                <SchemaForm fields={FIELDS} values={theme} onChange={(k, v) => setTheme((prev) => ({ ...prev, [k]: v }))} />
                <div className="rounded-lg border border-gray-200 bg-white p-3" style={{ fontFamily: font.family }}>
                    <p className="text-sm font-bold text-gray-900">The quick brown fox</p>
                    <p className="text-xs text-gray-500">jumps over the lazy dog. 0123456789</p>
                </div>
                <ResetButton onClick={() => setTheme({ ...THEME_DEFAULTS })}>Reset theme to defaults</ResetButton>
            </CustomizeCard>
        </div>
    );
}

export default ThemePanel;
