//Editor/SettingsPanel.jsx


import { SEO_DEFAULTS, SEO_FIELDS } from "./siteConfig";
import { CustomizeCard, GroupTitle, ResetButton, SchemaForm, TextField } from "./panelControls";

function SettingsPanel({ storeName, setStoreName, seo, setSeo }) {
    return (
        <div className="animate-fadeIn">
            <CustomizeCard step={1} label="Settings">
                <div className="space-y-3">
                    <GroupTitle>Store</GroupTitle>
                    <TextField label="Store name" hint="Used in your dashboard and as the default tab title." value={storeName} onChange={setStoreName} />
                </div>
                <SchemaForm fields={SEO_FIELDS} values={seo} onChange={(k, v) => setSeo((prev) => ({ ...prev, [k]: v }))} />
                <ResetButton onClick={() => setSeo({ ...SEO_DEFAULTS })}>Clear search & sharing details</ResetButton>
            </CustomizeCard>
        </div>
    );
}

export default SettingsPanel;
