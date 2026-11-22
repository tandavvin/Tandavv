//Editor/ProductsPanel.jsx


import { PRODUCTS_DEFAULTS, PRODUCTS_FIELDS } from "./sectionsConfig";
import { CustomizeCard, OptionCard, ResetButton, SchemaForm, StepHeader } from "./panelControls";

const COLUMN_CHOICES = [
    { value: 2, label: "2 Columns", desc: "Large cards", tone: "from-orange-300 to-amber-100" },
    { value: 3, label: "3 Columns", desc: "Balanced", tone: "from-sky-300 to-indigo-100" },
    { value: 4, label: "4 Columns", desc: "Compact", tone: "from-emerald-300 to-lime-100" },
];

function Sketch({ cols }) {
    return (
        <div className="flex h-full flex-col gap-1 px-2.5 pt-3">
            <span className="mx-auto block h-1.5 w-10 rounded-full bg-gray-600/50" />
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
                {Array.from({ length: cols * 2 }).map((_, i) => <span key={i} className="block h-3.5 rounded-sm bg-gray-600/30" />)}
            </div>
        </div>
    );
}

function ProductsPanel({ cfg, setCfg }) {
    const set = (patch) => setCfg((prev) => ({ ...prev, ...patch }));

    return (
        <div className="space-y-5 animate-fadeIn">
            <section>
                <StepHeader n={1} title="Choose a grid" />
                <div className="grid grid-cols-3 gap-2">
                    {COLUMN_CHOICES.map((c) => (
                        <OptionCard key={c.value} selected={Number(cfg.columns) === c.value} onSelect={() => set({ columns: c.value })} tone={c.tone} label={c.label} desc={c.desc}>
                            <Sketch cols={c.value} />
                        </OptionCard>
                    ))}
                </div>
            </section>

            <CustomizeCard label="Products" visible={cfg.visible !== false} onVisibleChange={(v) => set({ visible: v })}>
                <SchemaForm fields={PRODUCTS_FIELDS} values={cfg} onChange={(k, v) => set({ [k]: v })} />
                <ResetButton onClick={() => setCfg({ ...PRODUCTS_DEFAULTS })}>Reset products to defaults</ResetButton>
            </CustomizeCard>
        </div>
    );
}

export default ProductsPanel;
