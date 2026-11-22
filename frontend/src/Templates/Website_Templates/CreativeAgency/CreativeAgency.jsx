import { useMemo } from "react";

import Navbar from "../../Common_Templates/Navbar";
import Footer from "../../Common_Templates/Footer";
import CustomSection from "../../Common_Templates/CustomSection";

import { themeStyle, useGoogleFont } from "../../../utils/theme";

const isVisible = (config, id) => {
    const section = config?.sections?.find(
        (item) => item.id === id
    );

    return section ? section.visible !== false : true;
};

const getSection = (config, id) => {
    return config?.sections?.find(
        (item) => item.id === id
    );
};

function AgencyHero({ config }) {
    const hero = config?.hero || {};

    return (
        <section className="relative overflow-hidden bg-[#171717] px-6 py-24 text-white sm:px-12 lg:px-20 lg:py-36">
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />

            <div className="relative mx-auto max-w-7xl">
                <p className="mb-8 text-xs font-bold uppercase tracking-[0.35em] text-orange-400">
                    Independent Creative Studio
                </p>

                <h1 className="max-w-5xl text-5xl font-black leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl">
                    {hero.title || "We create digital experiences that move brands forward."}
                </h1>

                <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
                    <p className="max-w-xl text-base leading-8 text-neutral-400 sm:text-lg">
                        {hero.subtitle || "We combine strategy, design and technology to build meaningful digital experiences for ambitious businesses."}
                    </p>

                    <a
                        href="#agency-services"
                        className="inline-flex w-fit items-center gap-3 border-b border-orange-500 pb-3 text-sm font-bold transition hover:text-orange-400"
                    >
                        Explore our work
                        <span className="text-xl">↗</span>
                    </a>
                </div>

                <div className="mt-20 grid grid-cols-2 gap-6 border-t border-white/15 pt-8 sm:grid-cols-4">
                    {[
                        ["01", "Strategy"],
                        ["02", "Branding"],
                        ["03", "Digital Design"],
                        ["04", "Development"],
                    ].map(([number, label]) => (
                        <div key={number}>
                            <span className="text-xs text-orange-400">
                                {number}
                            </span>
                            <p className="mt-2 text-sm font-semibold text-neutral-300">
                                {label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function AgencyAbout({ config }) {
    const about = config?.about || {};

    return (
        <section className="bg-[#f5f3ef] px-6 py-24 sm:px-12 lg:px-20 lg:py-32">
            <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-24">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-600">
                        Who We Are
                    </p>

                    <h2 className="mt-6 text-4xl font-black leading-tight tracking-tight text-neutral-900 sm:text-6xl">
                        {about.title || "Good ideas deserve great execution."}
                    </h2>
                </div>

                <div className="flex flex-col justify-center">
                    <p className="text-lg leading-9 text-neutral-600">
                        {about.description || "We are a team of designers, strategists and developers who believe in creating purposeful work. Every project starts with understanding people, solving problems and building something worth remembering."}
                    </p>

                    <div className="mt-10 border-l-2 border-orange-500 pl-5">
                        <p className="text-sm font-bold text-neutral-900">
                            Think differently. Create meaningfully.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

function AgencyServices() {
    const services = [
        {
            number: "01",
            title: "Brand Strategy",
            description: "Positioning, brand identity and visual direction.",
        },
        {
            number: "02",
            title: "Digital Experiences",
            description: "Websites and interfaces designed around people.",
        },
        {
            number: "03",
            title: "Creative Development",
            description: "Modern, responsive and scalable digital products.",
        },
        {
            number: "04",
            title: "Content & Campaigns",
            description: "Creative storytelling that connects with audiences.",
        },
    ];

    return (
        <section
            id="agency-services"
            className="bg-white px-6 py-24 sm:px-12 lg:px-20 lg:py-32"
        >
            <div className="mx-auto max-w-7xl">
                <div className="mb-16 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-600">
                            What We Do
                        </p>
                        <h2 className="mt-5 text-4xl font-black tracking-tight text-neutral-900 sm:text-6xl">
                            Our Expertise.
                        </h2>
                    </div>

                    <p className="max-w-sm text-sm leading-7 text-neutral-500">
                        From the first idea to the final launch, we bring
                        every part of your brand experience together.
                    </p>
                </div>

                <div className="border-t border-neutral-200">
                    {services.map((service) => (
                        <div
                            key={service.number}
                            className="grid gap-4 border-b border-neutral-200 py-8 transition hover:bg-neutral-50 sm:grid-cols-[80px_1fr_1fr] sm:items-center sm:px-4"
                        >
                            <span className="text-sm font-bold text-orange-600">
                                {service.number}
                            </span>

                            <h3 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
                                {service.title}
                            </h3>

                            <p className="text-sm leading-7 text-neutral-500">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function AgencyProjects({ config }) {
    const products = config?.products || [];

    const projects = products.length
        ? products.slice(0, 4)
        : [
            { name: "Brand Identity", category: "Branding" },
            { name: "Digital Experience", category: "Web Design" },
            { name: "Creative Direction", category: "Strategy" },
            { name: "Digital Platform", category: "Development" },
        ];

    return (
        <section className="bg-[#171717] px-6 py-24 text-white sm:px-12 lg:px-20 lg:py-32">
            <div className="mx-auto max-w-7xl">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-400">
                    Selected Work
                </p>

                <div className="mb-16 mt-5 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                    <h2 className="text-4xl font-black tracking-tight sm:text-6xl">
                        Ideas into impact.
                    </h2>

                    <p className="max-w-sm text-sm leading-7 text-neutral-400">
                        A selection of creative projects and digital
                        experiences.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {projects.map((project, index) => (
                        <article
                            key={project._id || project.id || index}
                            className="group"
                        >
                            <div
                                className={`flex aspect-[5/4] items-center justify-center overflow-hidden ${
                                    index % 2 === 0
                                        ? "bg-[#292929]"
                                        : "bg-[#35312d]"
                                }`}
                            >
                                <span className="text-6xl font-black tracking-tighter text-white/10 transition duration-500 group-hover:scale-110 sm:text-8xl">
                                    0{index + 1}
                                </span>
                            </div>

                            <div className="flex items-center justify-between gap-4 py-5">
                                <div>
                                    <h3 className="text-lg font-bold">
                                        {project.name || project.title || `Project ${index + 1}`}
                                    </h3>
                                    <p className="mt-1 text-xs text-neutral-400">
                                        {project.category || "Creative Project"}
                                    </p>
                                </div>

                                <span className="text-2xl text-orange-400">
                                    ↗
                                </span>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

function AgencyTestimonials({ config }) {
    const testimonials = config?.testimonials || [];

    const testimonial = testimonials[0] || {
        name: "Our Happy Client",
        message: "The team understood our vision and transformed it into an experience that exceeded our expectations.",
        role: "Business Owner",
    };

    return (
        <section className="bg-[#f5f3ef] px-6 py-24 sm:px-12 lg:px-20 lg:py-32">
            <div className="mx-auto max-w-5xl">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-600">
                    Client Perspective
                </p>

                <p className="mt-10 text-3xl font-semibold leading-relaxed tracking-tight text-neutral-900 sm:text-5xl">
                    “{testimonial.message || testimonial.text || testimonial.content}”
                </p>

                <div className="mt-10 border-t border-neutral-300 pt-6">
                    <p className="font-bold text-neutral-900">
                        {testimonial.name || "Our Happy Client"}
                    </p>
                    <p className="mt-1 text-sm text-neutral-500">
                        {testimonial.role || testimonial.designation || "Client"}
                    </p>
                </div>
            </div>
        </section>
    );
}

function AgencyContact() {
    return (
        <section className="bg-orange-600 px-6 py-24 text-white sm:px-12 lg:px-20 lg:py-32">
            <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 sm:flex-row sm:items-end">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/70">
                        Have a project in mind?
                    </p>

                    <h2 className="mt-6 max-w-3xl text-5xl font-black leading-tight tracking-tight sm:text-7xl">
                        Let's make something meaningful.
                    </h2>
                </div>

                <a
                    href="mailto:hello@example.com"
                    className="inline-flex w-fit shrink-0 items-center gap-3 rounded-full bg-[#171717] px-7 py-4 text-sm font-bold transition hover:bg-neutral-800"
                >
                    Start a Conversation
                    <span className="text-lg">↗</span>
                </a>
            </div>
        </section>
    );
}

export default function CreativeAgency({ config, storeSlug = null }) {
    const sections = useMemo(() => {
        const configured = config?.sections || [];

        const customSections = configured.filter(
            (section) => section.type === "custom"
        );

        const defaultOrder = [
            "navbar",
            "hero",
            "about",
            "services",
            "projects",
            "testimonials",
            "contact",
            "footer",
        ];

        const configuredOrder = configured
            .filter((section) => defaultOrder.includes(section.id))
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((section) => section.id);

        return configuredOrder.length
            ? configuredOrder
            : defaultOrder;
    }, [config]);

    const style = themeStyle(config?.theme || {});
    useGoogleFont(config?.theme?.fontFamily);

    const sectionComponents = {
        navbar: isVisible(config, "navbar") && (
            <Navbar
                config={config}
                storeSlug={storeSlug}
                loggedIn={false}
                darkMode={false}
            />
        ),

        hero: isVisible(config, "hero") && (
            <AgencyHero config={config} />
        ),

        about: isVisible(config, "about") && (
            <AgencyAbout config={config} />
        ),

        services: isVisible(config, "services") && (
            <AgencyServices />
        ),

        projects: isVisible(config, "products") && (
            <AgencyProjects config={config} />
        ),

        testimonials: isVisible(config, "testimonials") && (
            <AgencyTestimonials config={config} />
        ),

        contact: isVisible(config, "contact") && (
            <AgencyContact />
        ),

        footer: isVisible(config, "footer") && (
            <Footer
                config={config}
                logo={config?.navbar?.logo}
                useNavbarLogo={true}
            />
        ),
    };

    return (
        <div style={style} className="min-h-screen overflow-hidden bg-white">
            {sections.map((sectionId) => {
                if (sectionId === "custom") {
                    return null;
                }

                return (
                    <div key={sectionId}>
                        {sectionComponents[sectionId]}
                    </div>
                );
            })}

            {(config?.sections || [])
                .filter(
                    (section) =>
                        section.type === "custom" &&
                        section.visible !== false
                )
                .map((section) => (
                    <CustomSection
                        key={section.id}
                        section={section}
                        config={config}
                    />
                ))}
        </div>
    );
}
