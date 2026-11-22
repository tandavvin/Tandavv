//Editor/HeroPanel.jsx


import { HERO_FIELDS, HERO_VARIANTS, mergeHero, switchHeroVariant } from "./heroConfig";
import { CustomizeCard, OptionCard, ResetButton, SchemaForm, StepHeader } from "./panelControls";

// tiny wireframe so users see the layout at a glance
function Sketch({ layout, dark }) {
    const line = dark ? "bg-white/80" : "bg-gray-600/50";
    const faint = dark ? "bg-white/45" : "bg-gray-500/30";
    const btn = dark ? "bg-white/90" : "bg-orange-500";
    const box = dark ? "bg-white/35" : "bg-gray-500/25";

    const textBlock = (align = "items-start") => (
        <div className={`flex flex-col gap-1 ${align}`}>
            <span className={`block h-1.5 w-16 rounded-full ${line}`} />
            <span className={`block h-1 w-20 rounded-full ${faint}`} />
            <span className={`block h-1 w-12 rounded-full ${faint}`} />
            <span className={`mt-1 block h-2 w-8 rounded-full ${btn}`} />
        </div>
    );

    if (layout === "center") return <div className="flex h-full items-start justify-center pt-4">{textBlock("items-center")}</div>;
    if (layout === "split")
        return (
            <div className="flex h-full items-start gap-3 px-3 pt-4">
                {textBlock()}
                <span className={`mt-0.5 block h-9 min-w-0 flex-1 rounded-md ${box}`} />
            </div>
        );
    if (layout === "cards")
        return (
            <div className="flex h-full items-start gap-3 px-3 pt-4">
                {textBlock()}
                <div className="flex min-w-0 flex-1 gap-1">
                    {[0, 1, 2].map((i) => <span key={i} className={`block h-10 min-w-0 flex-1 rounded-sm ${box}`} />)}
                </div>
            </div>
        );
    return <div className="flex h-full items-start px-3 pt-4">{textBlock()}</div>;
}

function HeroPanel({ hero, setHero }) {
    const selected = HERO_VARIANTS.find((v) => v.id === hero.variant) || HERO_VARIANTS[0];
    const fields = selected.fields.map((key) => HERO_FIELDS[key]).filter(Boolean);
    const set = (patch) => setHero((prev) => ({ ...prev, ...patch }));

    return (
        <div className="space-y-5 animate-fadeIn">
            <section>
                <StepHeader n={1} title="Choose a layout" />
                <div className="grid grid-cols-2 gap-2.5">
                    {HERO_VARIANTS.map((v) => (
                        <OptionCard
                            key={v.id}
                            selected={v.id === selected.id}
                            onSelect={() => setHero((prev) => switchHeroVariant(prev, v.id))}
                            tone={v.tone}
                            label={v.label}
                            desc={v.desc}
                        >
                            <Sketch layout={v.layout} dark={v.dark} />
                        </OptionCard>
                    ))}
                </div>
            </section>

            <CustomizeCard label={selected.label} visible={hero.visible !== false} onVisibleChange={(v) => set({ visible: v })}>
                <SchemaForm fields={fields} values={hero} onChange={(k, v) => set({ [k]: v })} />
                <ResetButton onClick={() => setHero(mergeHero({ variant: hero.variant }))}>Reset this hero to defaults</ResetButton>
            </CustomizeCard>
        </div>
    );
}

export default HeroPanel;
