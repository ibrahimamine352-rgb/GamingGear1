import type { Lang } from "@/context/language-context";

export const UI_TEXT: Record<
  Lang,
  {
    searchPlaceholder: string;
    filterButton: string;
    filtersTitle: string;
    sortLabel: string;
    allProducts: string;
    resultsFor: string;
    resultsCount: (n: number) => string;
    navAllProducts: string;
  navBuilds: string;
  navLaptops: string;
  navAllLaptops:string
  navMonitors: string;
  navAllMonitors:string;
  navComponents: string;
  navPeripherals: string;
  navBuildYourPc: string;
  navFullSetup: string;
  navSignIn: string;
  navSignout:string;
  navCpu: string;
  navGpu: string;
  navMotherboards: string;
  navRam: string;
  navStorage: string;
  navPsu: string;
  navCases: string;
  navCooling: string;

  navKeyboards: string;
  navMouse: string;
  navHeadsets: string;
  navMousepads: string;
  navMicrophones: string;
  navControllers: string;
  navCameras: string;
  landingHeroBadge: string;
  landingHeroTitleMain:string; 
  landingHeroTitleHighlight:string;
  landingHeroSubtitle:string;
  landingHeroLine2: string;

  landingHeroCtaBuild: string;
  landingHeroCtaBrowse: string;
  landingHeroWarranty: string;
  landingHeroDelivery: string;
  landingHeroStressTest: string;

  landingConfigTitle: string;
  landingConfigPriceHint: string;
  landingConfigBudgetLabel: string;
  landingConfigUseCaseLabel: string;
  landingConfigBrandLabel: string;
  landingConfigUseEsports: string;
  landingConfigUseAAA: string;
  landingConfigUseCreator: string;
  landingConfigBrandNvidia: string;
  landingConfigBrandAmd: string;
  landingConfigBrandIntel: string;
  landingConfigEstPrice: string;
  landingConfigEstNote: string;
  landingConfigWhatsapp: string;
  resultsHeading: string;
categoriesHeading: string;
seeAllResults: string;
builderRequiredTag: string;
builderCompatTitle: string;
builderCompatMotherboard: string;
builderCompatProcessor: string;
builderCompatGraphicsCard: string;
builderCompatRam: string;
builderCompatStorage: string;
builderCompatPsu: string;
builderCompatCase: string;
builderCompatScreen: string;
builderCompatCooling: string;

builderToggleCompatWithMotherboard: string;

builderNoResults: string;
builderResultsSummary: (count: number, seconds: number) => string;

builderBtnChange: string;
builderBtnAdd: string;
builderLinkSeeInStore: string;
builderCompatprimary:string;
builderCompatsecondary:string;
builderBtndetails:string;
cartFormTitle: string;
cartFormSubtitle: string;
cartFirstNameLabel: string;
cartLastNameLabel: string;
cartEmailLabel: string;
cartPhoneLabel: string;
cartAddressLabel: string;
cartPostalCodeLabel: string;
cartPaymentMethodLabel: string;
cartPaymentPlaceholder: string;
cartPaymentOnSite: string;
cartPaymentCashOnDelivery: string;
cartValidateButton: string;

cartSummaryTitle: string;
cartTotalLabel: string;
cartCheckoutButton: string;

cartEmptyTitle: string;
cartEmptySubtitle: string;
cartClearButton: string;
priceLabel: string;
minPriceLabel: string;
maxPriceLabel: string;
landingfullsetupbundles:string;
landingutilslink:string;
  }
> = {
  en: {
    priceLabel: "Price (TND)",
  minPriceLabel: "Min Price",
  maxPriceLabel: "Max Price",
    searchPlaceholder: "Search...",
    filterButton: "Filter",
    filtersTitle: "Filters",
    sortLabel: "Sort", 
    allProducts: "All Products",
    resultsFor: "Results for",
    resultsCount: (n) => `${n} results`,
    navAllProducts: "All Products",
  navBuilds: "Builds",
  navLaptops: "Laptops",
  navAllLaptops:"All Laptops",
  navMonitors: "Monitors",
  navAllMonitors:"All Monitors",
  navComponents: "Components",
  navPeripherals: "Peripherals",
  navBuildYourPc: "Build Your PC",
  navFullSetup: "Full Setup",
  navSignIn: "Sign in",
  navSignout: "Sign out",
  navCpu: "Processors (CPU)",
    navGpu: "Graphics Cards (GPU)",
    navMotherboards: "Motherboards",
    navRam: "Memory (RAM)",
    navStorage: "Storage",
    navPsu: "Power Supplies",
    navCases: "Cases",
    navCooling: "Cooling",

    navKeyboards: "Keyboards",
    navMouse: "Mouse",
    navHeadsets: "Headsets",
    navMousepads: "Mousepads",
    navMicrophones: "Microphones",
    navControllers: "Controllers",
    navCameras: "Cameras",
    landingHeroBadge: "Custom Builds, Tuned for Tunisia",
    landingHeroTitleMain: "Build Your Dream Rig.",
    landingHeroTitleHighlight: "Your Dream Rig",
    landingHeroSubtitle:
      "From budget beasts to liquid-cooled monsters — we design, assemble, and stress-test PCs that match your games, workflow, and budget.",
    landingHeroLine2: "We make it fast, quiet, and reliable.",

    landingHeroCtaBuild: "Configure My PC",
    landingHeroCtaBrowse: "Browse Products",
    landingHeroWarranty: "1 Year Warranty",
    landingHeroDelivery: "Delivery in Tunisia",
    landingHeroStressTest: "Stress-Tested",

    // config section:
    landingConfigTitle: "Start a Build",
    landingConfigPriceHint: "Est. Price is live & based on parts",
    landingConfigBudgetLabel: "Price (TND)",
    landingConfigUseCaseLabel: "Use Case",
    landingConfigBrandLabel: "Brand Preference",
    landingConfigUseEsports: "Esports / 1080p",
    landingConfigUseAAA: "AAA / 1440p",
    landingConfigUseCreator: "Creator + Gaming",
    landingConfigBrandNvidia: "NVIDIA GPU",
    landingConfigBrandAmd: "AMD (CPU/GPU)",
    landingConfigBrandIntel: "Intel CPU",
    landingConfigEstPrice: "Estimated Price",
    landingConfigEstNote: "incl. assembly & stress test",
    landingConfigWhatsapp: "Reserve on WhatsApp",
    resultsHeading: "Results",
categoriesHeading: "Categories",
seeAllResults: "See All",
builderRequiredTag: "(*Required)",
builderCompatTitle: "Compatibility:",
builderCompatMotherboard: "Motherboard:",
builderCompatProcessor: "Processor:",
builderCompatGraphicsCard: "Graphics card:",
builderCompatRam: "Memory (RAM):",
builderCompatStorage: "Storage:",
builderCompatPsu: "Power supply:",
builderCompatCase: "Case:",
builderCompatScreen: "Monitor:",
builderCompatCooling: "CPU Cooler",
builderCompatprimary:"Primary",
builderCompatsecondary:"Secondary",
builderToggleCompatWithMotherboard: "Compatible with motherboard",

builderNoResults: "No results found.",
builderResultsSummary: (count, seconds) =>
  `${count} results in ${seconds.toFixed(2)} s`,

builderBtnChange: "To Change",
builderBtnAdd: "Add",
builderLinkSeeInStore: "See in store",
builderBtndetails:"Details",
cartFormTitle: "Order Validation",
cartFormSubtitle: "Enter your details to validate your order. Click Save when you're done.",
cartFirstNameLabel: "First Name*",
cartLastNameLabel: "Last Name*",
cartEmailLabel: "Email (optional)",
cartPhoneLabel: "Phone Number*",
cartAddressLabel: "Address*",
cartPostalCodeLabel: "Postal Code (optional)",
cartPaymentMethodLabel: "Payment Method*",
cartPaymentPlaceholder: "Choose payment method",
cartPaymentOnSite: "Payment on site",
cartPaymentCashOnDelivery: "Cash on delivery",
cartValidateButton: "Validate",

cartSummaryTitle: "Order Summary",
cartTotalLabel: "Total",
cartCheckoutButton: "Checkout",

cartEmptyTitle: "Shopping Cart",
cartEmptySubtitle: "Your cart is empty.",
cartClearButton: "Clear Cart",
landingfullsetupbundles:"Full Setup Bundles",
landingutilslink:"Useful Links"
  },
  fr: {
    priceLabel: "Prix (TND)",
    minPriceLabel: "Prix min",
    maxPriceLabel: "Prix max",
    searchPlaceholder: "Rechercher...",
    filterButton: "Filtrer",
    filtersTitle: "Filtres",
    sortLabel: "Trier",
    allProducts: "Tous les produits",
    resultsFor: "Résultats pour",
    resultsCount: (n) => `${n} résultats`,
    navAllProducts: "Tous les produits",
  navBuilds: "Configs",
  navLaptops: "PC portables",
  navAllLaptops:"Tous les Pc ",
  navMonitors: "Écrans",
  navAllMonitors:"Tous les écrans " ,
  navComponents: "Composants",
  navPeripherals: "Périphériques",
  navBuildYourPc: "Construire votre PC",
  navFullSetup: "Setup complet",
  navSignIn: "Se connecter",
  navSignout:"se déconnecter",
  navCpu: "Processeurs (CPU)",
    navGpu: "Cartes graphiques (GPU)",
    navMotherboards: "Cartes mères",
    navRam: "Mémoire (RAM)",
    navStorage: "Stockage",
    navPsu: "Alimentations",
    navCases: "Boîtiers",
    navCooling: "Refroidissement",

    navKeyboards: "Claviers",
    navMouse: "Souris",
    navHeadsets: "Casques",
    navMousepads: "Tapis de souris",
    navMicrophones: "Microphones",
    navControllers: "Manettes",
    navCameras: "Caméras",
    landingHeroBadge: "Configurations sur mesure, optimisées pour la Tunisie",
    landingHeroTitleMain: "Construisez votre PC de rêve.",
    landingHeroTitleHighlight: "PC de rêve",
    landingHeroSubtitle:
      "Du setup abordable au monstre watercoolé — nous concevons, assemblons et testons vos PCs selon vos jeux, votre usage et votre budget.",
    landingHeroLine2: "Rapide, silencieux et fiable.",

    landingHeroCtaBuild: "Configurer mon PC",
    landingHeroCtaBrowse: "Voir les produits",
    landingHeroWarranty: "Garantie 1 ans",
    landingHeroDelivery: "Livraison partout en Tunisie",
    landingHeroStressTest: "Stress testé",

    landingConfigTitle: "Lancez une configuration",
    landingConfigPriceHint: "Le prix estimé est calculé à partir des composants",
    landingConfigBudgetLabel: "Prix (TND)",
    landingConfigUseCaseLabel: "Usage prévu",
    landingConfigBrandLabel: "Préférence de marque",
    landingConfigUseEsports: "Esport / 1080p",
    landingConfigUseAAA: "AAA / 1440p",
    landingConfigUseCreator: "Création + Gaming",
    landingConfigBrandNvidia: "GPU NVIDIA",
    landingConfigBrandAmd: "AMD (CPU/GPU)",
    landingConfigBrandIntel: "CPU Intel",
    landingConfigEstPrice: "Prix estimé",
    landingConfigEstNote: "inclut montage & tests",
    landingConfigWhatsapp: "Réserver sur WhatsApp",
    resultsHeading: "Résultats",
categoriesHeading: "Catégories",
seeAllResults: "Voir tout",
builderRequiredTag: "(*Obligatoire)",
builderCompatTitle: "Compatibilité :",
builderCompatMotherboard: "Carte mère :",
builderCompatProcessor: "Processeur :",
builderCompatGraphicsCard: "Carte graphique :",
builderCompatRam: "Mémoire (RAM) :",
builderCompatStorage: "Stockage :",
builderCompatPsu: "Alimentation :",
builderCompatCase: "Boîtier :",
builderCompatScreen: "Écran :",
builderCompatCooling: " CPU Refroidisseur",
builderCompatprimary:"Primaire",
builderCompatsecondary:"Secondaire",
builderToggleCompatWithMotherboard: "Compatible avec la carte mère",
builderBtndetails:"Détails",
builderNoResults: "Aucun résultat trouvé.",
builderResultsSummary: (count, seconds) =>
  `${count} résultats en ${seconds.toFixed(2)} s`,

builderBtnChange: "Changer",
builderBtnAdd: "Ajouter",
builderLinkSeeInStore: "Voir en boutique",
cartFormTitle: "Validation de commande",
cartFormSubtitle: "Entrez vos informations pour valider votre commande. Cliquez sur Enregistrer lorsque vous avez terminé.",
cartFirstNameLabel: "Prénom*",
cartLastNameLabel: "Nom*",
cartEmailLabel: "Email (optionnel)",
cartPhoneLabel: "Numéro de téléphone*",
cartAddressLabel: "Adresse*",
cartPostalCodeLabel: "Code postal (optionnel)",
cartPaymentMethodLabel: "Mode de paiement*",
cartPaymentPlaceholder: "Choisir le mode de paiement",
cartPaymentOnSite: "Paiement sur place",
cartPaymentCashOnDelivery: "Paiement à la livraison",
cartValidateButton: "Valider",

cartSummaryTitle: "Récapitulatif de la commande",
cartTotalLabel: "Total",
cartCheckoutButton: "Passer au paiement",

cartEmptyTitle: "Panier",
cartEmptySubtitle: "Votre panier est vide.",
cartClearButton: "Vider le panier",
landingfullsetupbundles:"Packs d'installation complets",
landingutilslink:"Liens Utiles"
  },

  ar: {
    priceLabel: "السعر (دينار)",
  minPriceLabel: "أدنى سعر",
  maxPriceLabel: "أعلى سعر",
    searchPlaceholder: "بحث...",
    filterButton: "تصفية",
    filtersTitle: "عوامل التصفية",
    sortLabel: "ترتيب",
    allProducts: "كل المنتجات",
    resultsFor: "نتائج لـ",
    resultsCount: (n) => `${n} نتيجة`,
    navAllProducts: "كل المنتجات",
  navBuilds: "تجميعات جاهزة",
  navLaptops: "حواسيب محمولة",
  navAllLaptops:"جميع الحواسيب",
  navMonitors: "شاشات",
  navAllMonitors:"جميع الشاشات",
  navComponents: "مكوّنات",
  navPeripherals: "ملحقات",
  navBuildYourPc: "ابنِ حاسوبك",
  navFullSetup: "إعداد كامل",
  navSignIn: "تسجيل الدخول",
  navSignout:"تسجيل الخروج",
  navCpu: "معالجات (CPU)",
    navGpu: "بطاقات رسومية (GPU)",
    navMotherboards: "لوحات أم",
    navRam: "ذاكرة (RAM)",
    navStorage: "التخزين",
    navPsu: "مزودات طاقة",
    navCases: "صناديق الحاسوب",
    navCooling: "نظام التبريد",

    navKeyboards: "لوحات مفاتيح",
    navMouse: "فأرات",
    navHeadsets: "سماعات رأس",
    navMousepads: "لوحات فأرة",
    navMicrophones: "ميكروفونات",
    navControllers: "يد تحكم",
    navCameras: "كاميرات",
    landingHeroBadge: "تجميعات مخصصة، مضبوطة لتونس",
    landingHeroTitleMain: "ابنِ حاسوب أحلامك.",
    landingHeroTitleHighlight: "حاسوب أحلامك",
    landingHeroSubtitle:
      "من الأجهزة الاقتصادية إلى الوحوش المبرّدة بالماء — نقوم بتصميم وتجميع واختبار الأجهزة حسب ألعابك، عملك وميزانيتك.",
    landingHeroLine2: "سريع، هادئ وموثوق.",

    landingHeroCtaBuild: "أعد تكوين حاسوبي",
    landingHeroCtaBrowse: "تصفّح المنتجات",
    landingHeroWarranty: "ضمان لمدة سنة",
    landingHeroDelivery: "توصيل داخل تونس",
    landingHeroStressTest: "اختبارات ضغط مكثفة",

    landingConfigTitle: "ابدأ تجميعتك",
    landingConfigPriceHint: "السعر التقديري محسوب حسب المكوّنات",
    landingConfigBudgetLabel: "السعر بالدينار",
    landingConfigUseCaseLabel: "الاستخدام",
    landingConfigBrandLabel: "تفضيل العلامة",
    landingConfigUseEsports: "ألعاب تنافسية / 1080p",
    landingConfigUseAAA: "ألعاب AAA / 1440p",
    landingConfigUseCreator: "إنشاء محتوى + ألعاب",
    landingConfigBrandNvidia: "بطاقة رسومية NVIDIA",
    landingConfigBrandAmd: "AMD (معالج/بطاقة رسومية)",
    landingConfigBrandIntel: "معالج Intel",
    landingConfigEstPrice: "السعر التقديري",
    landingConfigEstNote: "يشمل التجميع والفحص",
    landingConfigWhatsapp: "الحجز عبر واتساب",
    resultsHeading: "النتائج",
categoriesHeading: "الفئات",
seeAllResults: "عرض الكل",
builderRequiredTag: "(*إجباري)",
builderCompatTitle: "التوافق:",
builderCompatMotherboard: "اللوحة الأم:",
builderCompatProcessor: "المعالج:",
builderCompatGraphicsCard: "بطاقة الرسوميات:",
builderCompatRam: "الذاكرة (RAM):",
builderCompatStorage: "التخزين:",
builderCompatPsu: "مزود الطاقة:",
builderCompatCase: "الصندوق:",
builderCompatScreen: "الشاشة:",
builderCompatCooling: "التبريد:",
builderCompatprimary:"أساسي",
builderCompatsecondary:"ثانوي",
builderToggleCompatWithMotherboard: "متوافق مع اللوحة الأم",
builderBtndetails:"تفاصيل",
builderNoResults: "لا توجد نتائج.",
builderResultsSummary: (count, seconds) =>
  `${count} نتيجة في ${seconds.toFixed(2)} ث`, // tweak wording if you like

builderBtnChange: "تغيير",
builderBtnAdd: "إضافة",
builderLinkSeeInStore: "مشاهدة في المتجر",
cartFormTitle: "تأكيد الطلب",
cartFormSubtitle: "أدخل معلوماتك لتأكيد الطلب. اضغط حفظ عند الانتهاء.",
cartFirstNameLabel: "الاسم الأول*",
cartLastNameLabel: "اللقب*",
cartEmailLabel: "البريد الإلكتروني (اختياري)",
cartPhoneLabel: "رقم الهاتف*",
cartAddressLabel: "العنوان*",
cartPostalCodeLabel: "الرمز البريدي (اختياري)",
cartPaymentMethodLabel: "طريقة الدفع*",
cartPaymentPlaceholder: "اختر طريقة الدفع",
cartPaymentOnSite: "الدفع في المتجر",
cartPaymentCashOnDelivery: "الدفع عند التسليم",
cartValidateButton: "تأكيد",

cartSummaryTitle: "ملخص الطلب",
cartTotalLabel: "الإجمالي",
cartCheckoutButton: "إتمام الطلب",

cartEmptyTitle: "سلة المشتريات",
cartEmptySubtitle: "سلة المشتريات فارغة.",
cartClearButton: "إفراغ السلة",
landingfullsetupbundles:"حزم الإعداد الكاملة",
landingutilslink:"روابط مفيدة"

  },
};
