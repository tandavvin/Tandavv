//Editor/TestimonialsPanel.jsx


import { TESTIMONIALS_DEFAULTS, TESTIMONIALS_FIELDS } from "./sectionsConfig";
import { CustomizeCard, OptionCard, ResetButton, SchemaForm, StepHeader } from "./panelControls";

const LAYOUTS = [
    { value: "cards", label: "Review cards", desc: "Grid of cards", tone: "from-amber-300 to-orange-100" },
    { value: "quotes", label: "Large quotes", desc: "One per row", tone: "from-sky-300 to-indigo-100" },
];

function Sketch({ layout }) {
    if (layout === "quotes")
        return (
            <div className="flex h-full flex-col items-center gap-1.5 pt-4">
                {[0, 1].map((i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                        <span className="block h-1 w-8 rounded-full bg-amber-500/80" />
                        <span className="block h-1 w-16 rounded-full bg-gray-600/40" />
                    </div>
                ))}
            </div>
        );
    return (
        <div className="flex h-full items-start gap-1.5 px-3 pt-4">
            {[0, 1, 2].map((i) => (
                <div key={i} className="flex h-10 min-w-0 flex-1 flex-col gap-1 rounded-md bg-white/70 p-1.5 shadow-sm">
                    <span className="block h-1 w-5 rounded-full bg-amber-500/80" />
                    <span className="block h-1 w-full rounded-full bg-gray-600/30" />
                    <span className="block h-1 w-3/4 rounded-full bg-gray-600/30" />
                </div>
            ))}
        </div>
    );
}

function TestimonialsPanel({ cfg, setCfg }) {
    const set = (patch) => setCfg((prev) => ({ ...prev, ...patch }));

    return (
        <div className="space-y-5 animate-fadeIn">
            <section>
                <StepHeader n={1} title="Choose a layout" />
                <div className="grid grid-cols-2 gap-2.5">
                    {LAYOUTS.map((l) => (
                        <OptionCard key={l.value} selected={cfg.layout === l.value} onSelect={() => set({ layout: l.value })} tone={l.tone} label={l.label} desc={l.desc}>
                            <Sketch layout={l.value} />
                        </OptionCard>
                    ))}
                </div>
            </section>

            <CustomizeCard label="Testimonials" visible={cfg.visible !== false} onVisibleChange={(v) => set({ visible: v })}>
                <SchemaForm fields={TESTIMONIALS_FIELDS} values={cfg} onChange={(k, v) => set({ [k]: v })} />
                <ResetButton onClick={() => setCfg({ ...TESTIMONIALS_DEFAULTS })}>Reset testimonials to defaults</ResetButton>
            </CustomizeCard>
        </div>
    );
}

export default TestimonialsPanel;
