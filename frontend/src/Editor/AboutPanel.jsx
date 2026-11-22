//Editor/AboutPanel.jsx


import { ABOUT_DEFAULTS, ABOUT_FIELDS } from "./sectionsConfig";
import { CustomizeCard, OptionCard, ResetButton, SchemaForm, StepHeader } from "./panelControls";

const LAYOUTS = [
    { value: "image-left", label: "Image left", desc: "Text on the right", tone: "from-orange-300 to-amber-100" },
    { value: "image-right", label: "Image right", desc: "Text on the left", tone: "from-sky-300 to-indigo-100" },
    { value: "centered", label: "Centered", desc: "Stacked & centered", tone: "from-emerald-300 to-lime-100" },
];

function Sketch({ layout }) {
    const lines = (align = "items-start") => (
        <div className={`flex min-w-0 flex-1 flex-col gap-1 ${align}`}>
            <span className="block h-1.5 w-10 rounded-full bg-gray-600/50" />
            <span className="block h-1 w-12 rounded-full bg-gray-600/30" />
            <span className="block h-1 w-9 rounded-full bg-gray-600/30" />
        </div>
    );
    if (layout === "centered")
        return (
            <div className="flex h-full flex-col items-center gap-1.5 px-3 pt-3">
                <span className="block h-7 w-full rounded-md bg-gray-600/30" />
                {lines("items-center")}
            </div>
        );
    return (
        <div className="flex h-full items-start gap-2 px-3 pt-4">
            {layout === "image-left" && <span className="block h-10 w-1/2 rounded-md bg-gray-600/30" />}
            {lines()}
            {layout === "image-right" && <span className="block h-10 w-1/2 rounded-md bg-gray-600/30" />}
        </div>
    );
}

function AboutPanel({ cfg, setCfg }) {
    const set = (patch) => setCfg((prev) => ({ ...prev, ...patch }));

    return (
        <div className="space-y-5 animate-fadeIn">
            <section>
                <StepHeader n={1} title="Choose a layout" />
                <div className="grid grid-cols-3 gap-2">
                    {LAYOUTS.map((l) => (
                        <OptionCard key={l.value} selected={cfg.layout === l.value} onSelect={() => set({ layout: l.value })} tone={l.tone} label={l.label} desc={l.desc}>
                            <Sketch layout={l.value} />
                        </OptionCard>
                    ))}
                </div>
            </section>

            <CustomizeCard label="About" visible={cfg.visible !== false} onVisibleChange={(v) => set({ visible: v })}>
                <SchemaForm fields={ABOUT_FIELDS} values={cfg} onChange={(k, v) => set({ [k]: v })} />
                <ResetButton onClick={() => setCfg({ ...ABOUT_DEFAULTS })}>Reset about to defaults</ResetButton>
            </CustomizeCard>
        </div>
    );
}

export default AboutPanel;
