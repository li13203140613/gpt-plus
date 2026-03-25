export interface Translations {
  // Header
  headerSubtitle: string
  myOrders: string
  headerStats: { label: string; value: string }[]
  notificationNames: string[]
  notificationSuffixes: string[]
  notificationJustNow: string
  notificationMinutesAgo: string // "{n} minutes ago" with {n} placeholder
  notificationAction: string // "successfully recharged ChatGPT Plus"

  // Hero
  heroBadge: string
  heroTitleLine1: string
  heroTitleLine2: string
  heroDesc: string
  socialProofCount: string
  socialProofText: string

  // Typewriter
  typewriterPhrases: string[]

  // CodeGrid
  officialPlan: string
  perMonth: string
  priceNote: string
  priceNoteOverride: string
  emailLabel: string
  emailPlaceholder: string
  buyButton: string
  invalidEmail: string
  paymentCreateFailed: string
  noPaymentUrl: string
  paymentRetry: string
  trustAfterSale: string
  trustAfterSaleDesc: string
  trustPayment: string
  trustPaymentDesc: string
  plusBenefitsTitle: string
  plusBenefits: string[]

  // Trust Stats
  stats: { value: string; label: string }[]

  // Why Choose Us
  whyChooseTitle: string
  whyChooseDesc: string
  features: { title: string; desc: string }[]

  // Testimonials
  testimonialsTitle: string
  testimonialsSubtitle: string
  testimonials: {
    name: string
    role: string
    content: string
    avatar: string
  }[]

  // How It Works
  howItWorksTitle: string
  howItWorksDesc: string
  howItWorksSteps: { title: string; desc: string }[]

  // Service Notice
  serviceNoticeTitle: string
  serviceSteps: {
    title: string
    desc: string
    link?: { url: string; text: string }
    extra?: string
    cta?: { url: string; text: string }
  }[]
  warranty: { title: string; items: string[] }
  beforeYouBuy: { title: string; items: string[] }
  riskNotice: { title: string; text: string }
  contactSupport: string
  contactWechat: string

  // Trust Badges
  trustBadgeSSL: string
  trustBadgeStripe: string
  trustBadgeSupport: string
  trustBadgeWarranty: string

  // FAQ
  faqTitle: string
  faqItems: { q: string; a: string }[]

  // Footer
  footerPrimaryLinks: { href: string; label: string }[]
  footerDesc: string

  // Success Page
  success: {
    confirming: string
    confirmingDesc: string
    paymentSuccess: string
    codeDesc: string
    copyCode: string
    codeCopied: string
    backupEmailLabel: string
    backupEmailDesc: string
    nextStepsTitle: string
    step1: string
    step2: string
    step3prefix: string
    step3site: string
    goToActivation: string
    retryHint: string
    backToHome: string
    contactSupportText: string
    noOrder: string
    noOrderDesc: string
    expired: string
    expiredDesc: string
    failed: string
    failedNoSession: string
    failedTimeout: string
    restoredFromCookie: string
  }

  // Customer Service
  cs: {
    button: string
    title: string
    aiToolsTitle: string
    aiToolsDesc: string
    qrDesc: string
    qrAlt: string
    tip1: string
    tip2: string
  }
}
