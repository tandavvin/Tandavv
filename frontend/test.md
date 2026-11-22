

src/
│
├── components/
│   ├── RequireAuth.jsx
│   │
│   └── BusinessDashboard/
│       ├── DashboardLayout.jsx
│       ├── Sidebar.jsx
│       ├── Header.jsx
│       ├── StatCard.jsx
│       ├── RecentActivity.jsx
│       ├── TeamMemberCard.jsx
│       ├── DashboardChart.jsx
│       |── ConfirmModal.jsx
|       |__ ResourcePage.jsx
|       |__ FormPage.jsx
│
├── Editor/
│   ├── TemplateEditor.jsx
│   ├── AboutPanel.jsx
│   ├── CustomSectionPanel.jsx
│   ├── customSectionsConfig.js
│   ├── FooterPanel.jsx
│   ├── heroConfig.js
│   ├── HeroPanel.jsx
│   ├── modals.jsx
│   ├── navbarConfig.js
│   ├── NavbarPanel.jsx
│   ├── panelControls.jsx
│   ├── ProductsPanel.jsx
│   ├── sectionsConfig.js
│   ├── SettingsPanel.jsx
│   ├── siteConfig.js
│   ├── starterTemplates.js
│   ├── storeConfig.js
│   |── ThemePanel.jsx
|   |__ TestimonialsPanel.jsx
│
├── pages/
│   │
│   ├── BusinessDashboard/
│   │   ├── Overview.jsx
│   │   │
│   │   ├── Website/
│   │   │   ├── WebsiteOverview.jsx
│   │   │   ├── ManagePages.jsx
│   │   │   ├── NavigationMenu.jsx
│   │   │   ├── DomainSettings.jsx
│   │   │   |── SEOSettings.jsx
|   |   |   |__ Domain.jsx
|   |   |   |__ Pages.jsx
|   |   |   |__ EditCustomPage.jsx
│   │   │
│   │   ├── Products/
│   │   │   ├── Products.jsx
│   │   │   ├── AddProduct.jsx
│   │   │   ├── EditProduct.jsx
│   │   │   └── Categories.jsx
│   │   │
│   │   ├── Orders/
│   │   │   ├── Orders.jsx
│   │   │   ├── OrderDetails.jsx
│   │   │   └── Refunds.jsx
│   │   │
│   │   ├── Customers/
│   │   │   ├── Customers.jsx
│   │   │   └── CustomerDetails.jsx
│   │   │
│   │   ├── Marketing/
│   │   │   ├── Marketing.jsx
│   │   │   ├── Coupons.jsx
│   │   │   └── Campaigns.jsx
|   |   |   
|   |   |__ Support/
|   |   |   |__ Support.jsx
│   │   │
│   │   ├── Team/
│   │   │   ├── TeamMenagement.jsx
│   │   │   ├── InviteMember.jsx
│   │   │   ├── EditMember.jsx
│   │   │   ├── RolesPermissions.jsx
│   │   │   └── ActivityLogs.jsx
|   |   |
|   |   |__ Billing/
|   |   |   |__ Billing.jsx
│   │   │
│   │   ├── Analytics/
│   │   │   ├── Analytics.jsx
│   │   │   ├── SalesReports.jsx
│   │   │   └── RevenueReports.jsx
│   │   │
│   │   └── Settings/
│   │       ├── ProfileSettings.jsx
│   │       ├── AccountSettings.jsx
│   │       ├── PaymentSettings.jsx
│   │       ├── ShippingSettings.jsx
│   │       ├── NotificationSettings.jsx
│   │       |── BillingPlans.jsx
|   |       |__ GeneralSetting.jsx
|   |       |__ SecuritySettings.jsx
|   |       |__ Settings.jsx
│   │
|   |__ Dashboard.jsx
|   |
│   ├── GoogleCallback.jsx
│   ├── LandingPage.jsx
│   ├── Login.jsx
│   ├── NotFound.jsx
│   ├── PublicStore.jsx
│   └── Signup.jsx
│
├── Templates/
│   ├── StoreFront.jsx
│   │
│   |── Common_Templates/
│   |    ├── Hero/
│   |    │   ├── Banner.jsx
│   |    │   ├── Centered.jsx
│   |    │   ├── Split.jsx
│   |    │   ├── Gradient.jsx
│   |    │   ├── Video.jsx
│   |    │   ├── ProductShowCase.jsx
│   |    │   ├── Portfolio.jsx
│   |    │   ├── Ecommerce.jsx
│   |    │   ├── HeroSection.jsx
│   |    │   ├── HeroShell.jsx
│   |    │   └── Slider.jsx
│   |    │
│   |    ├── Custom/
│   |    │   ├── Cta.jsx
│   |    │   ├── Faq.jsx
│   |    │   ├── Features.jsx
│   |    │   ├── Gallery.jsx
│   |    │   ├── Pricing.jsx
│   |    │   └── TextBlock.jsx
│   |    │
│   |    ├── Navbar.jsx
│   |    ├── Products.jsx
│   |    ├── About.jsx
│   |    ├── CustomSection.jsx
│   |    ├── Footer.jsx
│   |    └── Testimonials.jsx
│   |__ shared
|       |__ iconMap.js
|       |__ icons.jsx
|       |__ safeHref.js
|       |__ SectionHeader.jsx
|       |__ sectionStyle.js
|       |__ SmartLink.jsx
|       |__ socialIcons.jsx
|
|
├── utils/
│   ├── api.js
│   ├── theme.js
│   ├── useHistoryState.js
│   ├── permissions.js
│   └── dashboardNavigation.js
│
├── App.jsx
└── main.jsx








Editor/
├── TemplateEditor.jsx             # Main layout orchestrator & global state
├── editorState.js                 # Central state (selected element, viewport, history)
│
├── Sidebar/
│   ├── EditorSidebar.jsx          # Left panel container with 4 professional tabs
│   ├── AddComponentTab.jsx        # Tab 1: Drag-and-drop elements & sections library
│   ├── SectionsTab.jsx            # Tab 2: Page sections reordering & visibility
│   ├── PagesTab.jsx               # Tab 3: Multi-page management
│   └── LayersTab.jsx              # Tab 4: DOM tree hierarchy
│
├── Canvas/
│   ├── CanvasWorkspace.jsx        # Center workspace with viewport framing (Desktop/Tablet/Mobile)
│   └── CanvasRenderer.jsx         # Live interactive rendering with selection bounding boxes
│
├── Properties/
│   ├── PropertiesInspector.jsx    # Right panel: Dynamic property inspector (Typography, Style, Layout)
│   └── panelControls.jsx          # Reusable UI controls (inputs, swatches, sliders)
│
└── Toolbar/
    ├── TopToolbar.jsx             # Header actions (Logo, Undo/Redo, Viewports, Save, Publish)
    └── Modals.jsx                 # Publish, SEO, and template creation modals