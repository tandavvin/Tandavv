export default function CanvasWorkspace({ viewport, config, activeSection, setActiveSection, setSelectedElement, setIsPropertiesOpen, user }) {
    return (
        <main className="flex h-full flex-1 flex-col overflow-hidden bg-gray-200 relative">
            <div className="flex-1 overflow-auto p-8 flex items-start justify-center [scrollbar-width:thin]">
                <div className={`bg-white shadow-2xl transition-all duration-300 rounded-lg overflow-hidden my-auto ${
                    viewport === "mobile" ? "w-[380px]" : viewport === "tablet" ? "w-[768px]" : viewport === "laptop" ? "w-[1024px]" : "w-full max-w-7xl"
                }`}>
                    {/* Rendered workspace content via Storefront */}
                </div>
            </div>
        </main>
    );
}