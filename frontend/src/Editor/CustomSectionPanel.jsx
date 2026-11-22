//Editor/CustomSectionPanel.jsx


import { CUSTOM_TYPES, makeCustomSection } from "./customSectionsConfig";
import { CustomizeCard, ResetButton, SchemaForm, TextField } from "./panelControls";

function CustomSectionPanel({ cfg, setCfg, label, onRename }) {
    const spec = CUSTOM_TYPES[cfg.type] || CUSTOM_TYPES.text;
    const set = (patch) => setCfg((prev) => ({ ...prev, ...patch }));

    return (
        <div className="animate-fadeIn">
            <CustomizeCard step={1} label={spec.label} visible={cfg.visible !== false} onVisibleChange={(v) => set({ visible: v })}>
                <TextField label="Section name" hint="Only shown here in the editor, to help you find it." value={label} onChange={onRename} />
                <SchemaForm fields={spec.fields} values={cfg} onChange={(k, v) => set({ [k]: v })} />
                <ResetButton onClick={() => setCfg({ ...makeCustomSection(cfg.type), visible: cfg.visible })}>Reset this section to defaults</ResetButton>
            </CustomizeCard>
        </div>
    );
}

export default CustomSectionPanel;
