//Editor/FooterPanel.jsx


import { FOOTER_DEFAULTS, FOOTER_FIELDS } from "./sectionsConfig";
import { CustomizeCard, OptionCard, ResetButton, SchemaForm, StepHeader } from "./panelControls";

// the wireframe draws a real footer strip in the preset's color
const PRESETS = [
    { id: "light", label: "Light", desc: "Soft gray", backgroundColor: "gray", strip: "bg-gray-200", dark: false, tone: "from-gray-300 to-gray-100" },
    { id: "dark", label: "Dark", desc: "Black", backgroundColor: "black", strip: "bg-neutral-900", dark: true, tone: "from-neutral-500 to-neutral-300" },
    { id: "brand", label: "Brand", desc: "Your theme color", backgroundColor: "orange", strip: "bg-orange-600", dark: true, tone: "from-orange-300 to-amber-100" },
    { id: "indigo", label: "Indigo", desc: "Deep blue", backgroundColor: "indigo", strip: "bg-indigo-700", dark: true, tone: "from-indigo-300 to-sky-100" },
];

function Sketch({ strip, dark }) {
    const line = dark ? "bg-white/70" : "bg-gray-600/50";
    const faint = dark ? "bg-white/40" : "bg-gray-600/30";
    return (
        <div className={`absolute inset-x-3 bottom-8 top-3 rounded-md ${strip} shadow-sm`}>
            <div className="flex gap-3 p-2">
                <div className="flex flex-[1.4] flex-col gap-1">
                    <span className={`block h-1.5 w-8 rounded-full ${line}`} />
                    <span className={`block h-1 w-12 rounded-full ${faint}`} />
                </div>
                {[0, 1].map((i) => (
                    <div key={i} className="flex flex-1 flex-col gap-1">
                        <span className={`block h-1 w-6 rounded-full ${line}`} />
                        <span className={`block h-1 w-5 rounded-full ${faint}`} />
                        <span className={`block h-1 w-6 rounded-full ${faint}`} />
                    </div>
                ))}
            </div>
        </div>
    );
}

function FooterPanel({ cfg, setCfg }) {
    const set = (patch) => setCfg((prev) => ({ ...prev, ...patch }));
    const activePreset = PRESETS.find((p) => p.backgroundColor === cfg.backgroundColor);

    return (
        <div className="space-y-5 animate-fadeIn">
            <section>
                <StepHeader n={1} title="Choose a style" />
                <div className="grid grid-cols-2 gap-2.5">
                    {PRESETS.map((p) => (
                        <OptionCard key={p.id} selected={activePreset?.id === p.id} onSelect={() => set({ backgroundColor: p.backgroundColor })} tone={p.tone} label={p.label} desc={p.desc}>
                            <Sketch strip={p.strip} dark={p.dark} />
                        </OptionCard>
                    ))}
                </div>
            </section>

            <CustomizeCard label="Footer" visible={cfg.visible !== false} onVisibleChange={(v) => set({ visible: v })}>
                <SchemaForm fields={FOOTER_FIELDS} values={cfg} onChange={(k, v) => set({ [k]: v })} />
                <ResetButton onClick={() => setCfg({ ...FOOTER_DEFAULTS })}>Reset footer to defaults</ResetButton>
            </CustomizeCard>
        </div>
    );
}

export default FooterPanel;
