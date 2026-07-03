const GELIK_LANGUAGE_STORAGE_KEY = "gelik_config_tools_language";

const GELIK_TRANSLATIONS = {
  ru: {
    language: "Язык",
    russian: "Русский",
    english: "English",
    homeDescription: "Общие инструменты для редактирования конфигов модов DayZ.",
    classnamesSettings: "Настройка класснеймов",
    classnamesSettingsEditor: "Настройки класснеймов",
    editors: "Редакторы",
    modernstashCardText: "Редактор JSON-конфига для Gelik ModernStash.",
    randomgiftsCardText: "Редактор JSON-конфига для Gelik RandomGifts.",
    home: "Главная",
    hidePreview: "Скрыть JSON preview",
    showPreview: "Показать JSON preview",
    clearConfig: "Очистить конфиг",
    uploadJson: "Загрузить JSON",
    downloadConfig: "Скачать config.json",
    copy: "Копировать",
    ready: "Готово",
    add: "Добавить",
    addGroup: "Добавить группу",
    duplicate: "Дублировать",
    deleteGroup: "Удалить группу",
    delete: "Удалить",
    addItem: "Добавить предмет",
    groupSettings: "Параметры группы",
    stashGroups: "Stash группы",
    stashGroup: "Stash группа",
    giftGroups: "Gift группы",
    giftGroup: "Gift группа",
    item: "Предмет",
    itemNumber: "Предмет {number}",
    noClassname: "Без classname",
    groupOf: "Группа {current} из {total}",
    magazineAmmo: "Магазин и патроны",
    healthQuantity: "Состояние и количество",
    quantityHealth: "Количество и состояние",
    loadedFile: "Загружен {name}",
    loadedClassnames: "Загружено classnames: {count}",
    baseClassnames: "Базовые classnames: {count}",
    configDownloaded: "config.json скачан",
    jsonCopied: "JSON скопирован",
    configCleared: "Конфиг очищен",
    resetConfirm: "Точно очистить конфиг? Вся текущая информация в редакторе будет удалена, а конфиг станет начальным.",
    modernstashInvalidJson: "В JSON должен быть массив G_ModernStash.",
    randomgiftsInvalidJson: "В JSON должен быть массив G_RandomGifts.",
    time: "Время",
    damage: "Урон",
    healthUnset: "-1 - Не задавать (будет нетронутым)",
    healthPristine: "0 - нетронутое",
    healthWorn: "1 - поношенное",
    healthDamaged: "2 - поврежденное",
    healthBadlyDamaged: "3 - сильное поврежденное",
    healthRuined: "4 - уничтоженное",
    classnamesTitle: "Настройка класснеймов",
    classnamesIntro: "Загрузите JSON со scope1/scope2 и настройте, какие класснеймы показывать в автозаполнении.",
    classnamesHelpVanilla: "Категория Vanilla содержит класснеймы из стандартного classnames.json в корне сайта. Ее можно отключить, чтобы видеть только свои загруженные класснеймы.",
    classnamesHelpDownload: "Получить список всех класснеймов с вашего сервера можно используя данный мод:",
    classnamesHelpInstall: "Просто добавьте ПБО на серверную часть, запустите сервер и в папке Profiles/Gelik_Mods/gelik_classnames.json будет список класснеймов, данный файл затем загрузите сюда.",
    classnamesHelpScope: "*Класснеймы будут записаны всех объектов сервера со scope=1 и scope=2.",
    uploadClassnamesJson: "Загрузить JSON класснеймов",
    categories: "Категории",
    classnamesList: "Список класснеймов",
    shownAvailable: "Показано: {shown}. Всего доступно: {total}.",
    commonClassnamesAvailable: "Сейчас доступно класснеймов: {count}",
    classnamesNotLoaded: "JSON класснеймов пока не загружен.",
    emptyList: "Список пуст."
  },
  en: {
    language: "Language",
    russian: "Русский",
    english: "English",
    homeDescription: "Shared tools for editing DayZ mod config files.",
    classnamesSettings: "Classname Settings",
    classnamesSettingsEditor: "Classname Settings",
    editors: "Editors",
    modernstashCardText: "JSON config editor for Gelik ModernStash.",
    randomgiftsCardText: "JSON config editor for Gelik RandomGifts.",
    home: "Home",
    hidePreview: "Hide JSON preview",
    showPreview: "Show JSON preview",
    clearConfig: "Clear config",
    uploadJson: "Upload JSON",
    downloadConfig: "Download config.json",
    copy: "Copy",
    ready: "Ready",
    add: "Add",
    addGroup: "Add group",
    duplicate: "Duplicate",
    deleteGroup: "Delete group",
    delete: "Delete",
    addItem: "Add item",
    groupSettings: "Group settings",
    stashGroups: "Stash groups",
    stashGroup: "Stash group",
    giftGroups: "Gift groups",
    giftGroup: "Gift group",
    item: "Item",
    itemNumber: "Item {number}",
    noClassname: "No classname",
    groupOf: "Group {current} of {total}",
    magazineAmmo: "Magazine and ammo",
    healthQuantity: "Health and quantity",
    quantityHealth: "Quantity and health",
    loadedFile: "Loaded {name}",
    loadedClassnames: "Loaded classnames: {count}",
    baseClassnames: "Base classnames: {count}",
    configDownloaded: "config.json downloaded",
    jsonCopied: "JSON copied",
    configCleared: "Config cleared",
    resetConfirm: "Clear the config? All current editor data will be deleted and the config will be reset to the initial state.",
    modernstashInvalidJson: "JSON must contain a G_ModernStash array.",
    randomgiftsInvalidJson: "JSON must contain a G_RandomGifts array.",
    time: "Time",
    damage: "Damage",
    healthUnset: "-1 - Do not set (will be pristine)",
    healthPristine: "0 - pristine",
    healthWorn: "1 - worn",
    healthDamaged: "2 - damaged",
    healthBadlyDamaged: "3 - badly damaged",
    healthRuined: "4 - ruined",
    classnamesTitle: "Classname Settings",
    classnamesIntro: "Upload JSON with scope1/scope2 and choose which classnames appear in autocomplete.",
    classnamesHelpVanilla: "The Vanilla category contains classnames from the default classnames.json file in the site root. Disable it to show only your uploaded classnames.",
    classnamesHelpDownload: "You can get a list of all classnames from your server with this mod:",
    classnamesHelpInstall: "Add the PBO to the server side, start the server, and Profiles/Gelik_Mods/gelik_classnames.json will contain the classname list. Upload that file here.",
    classnamesHelpScope: "*Classnames will be written for all server objects with scope=1 and scope=2.",
    uploadClassnamesJson: "Upload classnames JSON",
    categories: "Categories",
    classnamesList: "Classname list",
    shownAvailable: "Shown: {shown}. Total available: {total}.",
    commonClassnamesAvailable: "Currently available classnames: {count}",
    classnamesNotLoaded: "Classnames JSON is not loaded yet.",
    emptyList: "The list is empty."
  }
};

function getCurrentLanguage() {
  const saved = localStorage.getItem(GELIK_LANGUAGE_STORAGE_KEY);
  return saved === "en" ? "en" : "ru";
}

function translate(key, variables = {}) {
  const language = getCurrentLanguage();
  const template = GELIK_TRANSLATIONS[language]?.[key] || GELIK_TRANSLATIONS.ru[key] || key;
  return template.replace(/\{(\w+)\}/g, (match, name) => variables[name] ?? match);
}

function setLanguage(language) {
  localStorage.setItem(GELIK_LANGUAGE_STORAGE_KEY, language === "en" ? "en" : "ru");
  applyTranslations();
  window.dispatchEvent(new CustomEvent("gelik-language-changed"));
}

function applyTranslations(root = document) {
  document.documentElement.lang = getCurrentLanguage();
  root.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = translate(element.dataset.i18n);
  });
  root.querySelectorAll("[data-i18n-title]").forEach((element) => {
    element.title = translate(element.dataset.i18nTitle);
  });
  root.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = translate(element.dataset.i18nPlaceholder);
  });
  root.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", translate(element.dataset.i18nAriaLabel));
  });
  root.querySelectorAll("[data-language-select]").forEach((select) => {
    select.value = getCurrentLanguage();
  });
}

function injectLanguageSelect() {
  if (document.querySelector("[data-language-select]")) return;
  const target = document.querySelector(".actions") || document.querySelector(".home-header");
  if (!target) return;

  const wrapper = document.createElement("label");
  wrapper.className = "language-select";
  wrapper.innerHTML = `
    <span data-i18n="language">${translate("language")}</span>
    <select data-language-select>
      <option value="ru" data-i18n="russian">${translate("russian")}</option>
      <option value="en" data-i18n="english">${translate("english")}</option>
    </select>
  `;
  target.append(wrapper);
  wrapper.querySelector("select").addEventListener("change", (event) => setLanguage(event.target.value));
}

function initI18n() {
  injectLanguageSelect();
  applyTranslations();
}

window.gelikI18n = {
  t: translate,
  getLanguage: getCurrentLanguage,
  setLanguage,
  apply: applyTranslations
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initI18n);
} else {
  initI18n();
}
