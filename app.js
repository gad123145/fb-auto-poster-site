const SITE_CONFIG = Object.freeze({
  whatsappNumber: '201273241214'
});

const screens = {
  dashboard: {
    ar: 'assets/screenshots/dashboard-ar.png',
    en: 'assets/screenshots/dashboard-en.png',
    altAr: 'لوحة تحكم FB Auto Poster Pro',
    altEn: 'FB Auto Poster Pro dashboard',
    captionAr: 'لوحة واحدة لمتابعة الحسابات والمجموعات والعمليات الجارية.',
    captionEn: 'One dashboard for accounts, groups and live operations.'
  },
  posting: {
    ar: 'assets/screenshots/posting-ar.png', en: 'assets/screenshots/posting-en.png',
    altAr: 'واجهة النشر على المجموعات', altEn: 'Group publishing workspace',
    captionAr: 'اختيار الحساب والمنشور والوجهات وإعدادات التشغيل من شاشة واحدة.',
    captionEn: 'Choose the account, content, destinations and campaign controls in one place.'
  },
  engagement: {
    ar: 'assets/screenshots/engagement-ar.png', en: 'assets/screenshots/engagement-ar.png',
    altAr: 'واجهة حملات التفاعل', altEn: 'Engagement campaigns workspace',
    captionAr: 'حملات مستقلة للتفاعل والتعليقات مع مهام واضحة لكل حساب.',
    captionEn: 'Independent engagement campaigns with explicit actions per account.'
  },
  replies: {
    ar: 'assets/screenshots/replies-ar.png', en: 'assets/screenshots/replies-ar.png',
    altAr: 'واجهة ردود العملاء', altEn: 'Customer replies workspace',
    captionAr: 'ربط ردود مخصصة بالمنشورات ومتابعة الفحص والتنفيذ والتحقق.',
    captionEn: 'Attach custom replies to posts and track scans, delivery and verification.'
  },
  search: {
    ar: 'assets/screenshots/search-ar.png', en: 'assets/screenshots/search-ar.png',
    altAr: 'واجهة البحث والاستخراج', altEn: 'Search and extraction workspace',
    captionAr: 'استخراج منظم للتعليقات والتفاعلات والنتائج القابلة للتصدير.',
    captionEn: 'Structured extraction for comments, reactions and export-ready results.'
  }
};

let language = localStorage.getItem('site-language') || 'ar';
let activeScreen = 'dashboard';

const setLanguage = lang => {
  language = lang === 'en' ? 'en' : 'ar';
  localStorage.setItem('site-language', language);
  document.documentElement.lang = language;
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  document.title = language === 'ar'
    ? 'FB Auto Poster Pro | إدارة فيسبوك باحتراف'
    : 'FB Auto Poster Pro | Professional Facebook Operations';
  document.querySelectorAll('[data-ar][data-en]').forEach(element => {
    element.textContent = element.dataset[language];
  });
  document.querySelectorAll('[data-placeholder-ar][data-placeholder-en]').forEach(element => {
    element.placeholder = element.dataset[`placeholder${language === 'ar' ? 'Ar' : 'En'}`];
  });
  document.getElementById('language-label').textContent = language === 'ar' ? 'EN' : 'AR';
  updateTour(activeScreen);
  if (window.lucide) lucide.createIcons();
};

const updateTour = key => {
  activeScreen = screens[key] ? key : 'dashboard';
  const screen = screens[activeScreen];
  const image = document.getElementById('tour-image');
  const caption = document.getElementById('tour-caption');
  if (!image || !caption) return;
  image.src = screen[language];
  image.alt = language === 'ar' ? screen.altAr : screen.altEn;
  caption.textContent = language === 'ar' ? screen.captionAr : screen.captionEn;
  document.querySelectorAll('.tour-tab').forEach(tab => {
    const selected = tab.dataset.screen === activeScreen;
    tab.classList.toggle('active', selected);
    tab.setAttribute('aria-selected', String(selected));
  });
};

const showToast = message => {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 3200);
};

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();
  setLanguage(language);

  const header = document.querySelector('.site-header');
  const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  document.getElementById('language-toggle').addEventListener('click', () => setLanguage(language === 'ar' ? 'en' : 'ar'));

  const menuButton = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const closeMenu = () => {
    mobileNav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };
  menuButton.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  });
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

  document.querySelectorAll('.tour-tab').forEach(tab => tab.addEventListener('click', () => updateTour(tab.dataset.screen)));

  document.querySelectorAll('.plan-button').forEach(button => button.addEventListener('click', () => {
    const plan = language === 'ar' ? button.dataset.planAr : button.dataset.planEn;
    const select = document.getElementById('lead-plan');
    const values = { 'شهري': 'monthly', 'Monthly': 'monthly', 'ربع سنوي': 'quarterly', 'Quarterly': 'quarterly', 'سنوي': 'annual', 'Annual': 'annual' };
    select.value = values[plan] || 'trial';
  }));

  document.querySelectorAll('.accordion details').forEach(item => item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.accordion details').forEach(other => { if (other !== item) other.open = false; });
  }));

  document.getElementById('trial-form').addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('lead-name').value.trim();
    const phone = document.getElementById('lead-phone').value.trim();
    const planSelect = document.getElementById('lead-plan');
    const plan = planSelect.options[planSelect.selectedIndex].text;
    const note = document.getElementById('lead-note').value.trim();
    const message = language === 'ar'
      ? `مرحباً، أريد الاستفسار عن FB Auto Poster Pro.\nالاسم: ${name}\nرقم التواصل: ${phone}\nالطلب: ${plan}${note ? `\nملاحظة: ${note}` : ''}`
      : `Hello, I am interested in FB Auto Poster Pro.\nName: ${name}\nContact number: ${phone}\nRequest: ${plan}${note ? `\nNote: ${note}` : ''}`;
    const url = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    showToast(language === 'ar' ? 'جاري فتح واتساب لإرسال طلبك...' : 'Opening WhatsApp with your request...');
    window.open(url, '_blank', 'noopener,noreferrer');
  });
});
