const CLASSNAME_JSON_STORAGE_KEY = "gelik_common_classnames_json";
const CLASSNAME_FILTERS_STORAGE_KEY = "gelik_common_classnames_filters";
const CLASSNAME_FLAT_STORAGE_KEY = "gelik_common_classnames";
const SPECIAL_CLASSNAME_CATEGORIES = {
  Gelik_ModernStash: "Gelik_Stash_",
  Gelik_RandomGifts: "Gelik_RandomGift_"
};
const CLASSNAME_CATEGORIES = ["Vanilla", ...Object.keys(SPECIAL_CLASSNAME_CATEGORIES), "CfgVehicles", "CfgWeapons", "CfgMagazines", "CfgAmmo", "CfgNonAIVehicles"];
const DATA_CATEGORIES = ["CfgVehicles", "CfgWeapons", "CfgMagazines", "CfgAmmo", "CfgNonAIVehicles"];
const CLASSNAME_SCOPES = ["scope1", "scope2"];
let vanillaClassnameData = normalizeClassnameData(window.VANILLA_CLASSNAMES || null);

function defaultClassnameData() {
  return Object.fromEntries(DATA_CATEGORIES.map((category) => [
    category,
    { scope1: [], scope2: [] }
  ]));
}

function getScopeLabel(scope) {
  return scope === "scope1" ? "scope=1" : "scope=2";
}

function defaultClassnameFilters() {
  return {
    categories: Object.fromEntries(CLASSNAME_CATEGORIES.map((category) => [category, category !== "CfgNonAIVehicles"])),
    scopes: { scope1: true, scope2: true }
  };
}

function normalizeClassnameData(input) {
  const normalized = defaultClassnameData();
  DATA_CATEGORIES.forEach((category) => {
    CLASSNAME_SCOPES.forEach((scope) => {
      const value = input?.[category]?.[scope];
      normalized[category][scope] = Array.isArray(value)
        ? value.map((item) => String(item).trim()).filter(Boolean)
        : [];
    });
  });
  return normalized;
}

function countClassnameData(data) {
  return DATA_CATEGORIES.reduce((sum, category) => (
    sum + CLASSNAME_SCOPES.reduce((scopeSum, scope) => scopeSum + data[category][scope].length, 0)
  ), 0);
}

function readUserClassnameData() {
  try {
    return normalizeClassnameData(JSON.parse(localStorage.getItem(CLASSNAME_JSON_STORAGE_KEY) || "null"));
  } catch {
    return defaultClassnameData();
  }
}

function readClassnameFilters() {
  try {
    const saved = JSON.parse(localStorage.getItem(CLASSNAME_FILTERS_STORAGE_KEY) || "null");
    return {
      categories: { ...defaultClassnameFilters().categories, ...(saved?.categories || {}) },
      scopes: { ...defaultClassnameFilters().scopes, ...(saved?.scopes || {}) }
    };
  } catch {
    return defaultClassnameFilters();
  }
}

function writeClassnameFilters(filters) {
  localStorage.setItem(CLASSNAME_FILTERS_STORAGE_KEY, JSON.stringify(filters));
}

function getSpecialClassnameCategory(classname) {
  return Object.entries(SPECIAL_CLASSNAME_CATEGORIES).find(([, prefix]) => classname.startsWith(prefix))?.[0] || "";
}

function collectRegularFromData(data, category, filters) {
  const result = [];
  CLASSNAME_SCOPES.forEach((scope) => {
    if (!filters.scopes[scope]) return;
    result.push(...data[category][scope].filter((classname) => !getSpecialClassnameCategory(classname)));
  });
  return result;
}

function collectSpecialFromData(data, specialCategory, filters) {
  const result = [];
  DATA_CATEGORIES.forEach((category) => {
    CLASSNAME_SCOPES.forEach((scope) => {
      if (!filters.scopes[scope]) return;
      result.push(...data[category][scope].filter((classname) => getSpecialClassnameCategory(classname) === specialCategory));
    });
  });
  return result;
}

function getFilteredClassnames(filters = readClassnameFilters()) {
  const userData = readUserClassnameData();
  const result = [];
  const specialCategories = Object.keys(SPECIAL_CLASSNAME_CATEGORIES);

  specialCategories.forEach((category) => {
    if (!filters.categories[category]) return;
    if (filters.categories.Vanilla) {
      result.push(...collectSpecialFromData(vanillaClassnameData, category, filters));
    }
    result.push(...collectSpecialFromData(userData, category, filters));
  });

  if (filters.categories.Vanilla) {
    DATA_CATEGORIES.forEach((category) => {
      if (filters.categories[category]) {
        result.push(...collectRegularFromData(vanillaClassnameData, category, filters));
      }
    });
  }

  DATA_CATEGORIES.forEach((category) => {
    if (filters.categories[category]) {
      result.push(...collectRegularFromData(userData, category, filters));
    }
  });

  return [...new Set(result)].sort((a, b) => a.localeCompare(b));
}

function getTotalClassnameCount() {
  return getFilteredClassnames(defaultClassnameFilters()).length;
}

function writeUserClassnameData(data) {
  localStorage.setItem(CLASSNAME_JSON_STORAGE_KEY, JSON.stringify(normalizeClassnameData(data)));
  syncFlatClassnames();
}

function syncFlatClassnames() {
  localStorage.setItem(CLASSNAME_FLAT_STORAGE_KEY, JSON.stringify(getFilteredClassnames()));
  window.dispatchEvent(new CustomEvent("gelik-classnames-updated"));
}

function injectClassnameModal() {
  if (document.querySelector("#classnamesModal")) return;

  const modal = document.createElement("div");
  modal.id = "classnamesModal";
  modal.className = "modal hidden";
  modal.innerHTML = `
    <div class="modal-backdrop" data-close-classnames></div>
    <section class="modal-panel">
      <div class="modal-head">
        <div>
          <h2>Настройка класснеймов</h2>
          <p>Загрузите JSON со scope1/scope2 и настройте, какие класснеймы показывать в автозаполнении.</p>
        </div>
        <button class="icon-button" type="button" data-close-classnames>×</button>
      </div>
      <div class="classnames-help">
        <p>Категория Vanilla содержит класснеймы из стандартного <code>classnames.json</code> в корне сайта. Ее можно отключить, чтобы видеть только свои загруженные класснеймы.</p>
        <p>Получить список всех класснеймов с вашего сервера можно используя данный мод: <a href="${getRootPrefix()}Gelik_GetClassnames_SERVER.pbo" download>Gelik_GetClassnames_SERVER.pbo</a>.</p>
        <p>Просто добавьте ПБО на серверную часть, запустите сервер и в папке <code>Profiles/Gelik_Mods/gelik_classnames.json</code> будет список класснеймов, данный файл затем загрузите сюда.</p>
        <p><em>*Класснеймы будут записаны всех объектов сервера со scope=1 и scope=2.</em></p>
      </div>
      <div class="modal-tools">
        <label class="button file-button">
          Загрузить JSON класснеймов
          <input id="classnamesJsonInput" type="file" accept=".json,application/json">
        </label>
        <div id="classnamesModalStatus" class="home-status"></div>
      </div>
      <div class="filter-grid">
        <section>
          <h3>Категории</h3>
          <div id="classnameCategoryFilters" class="check-list"></div>
        </section>
        <section>
          <h3>Scope</h3>
          <div id="classnameScopeFilters" class="check-list"></div>
        </section>
      </div>
      <section class="classnames-list-wrap">
        <h3>Список класснеймов</h3>
        <div id="classnamesList" class="classnames-list"></div>
      </section>
    </section>
  `;
  document.body.append(modal);
}

function renderClassnameManager() {
  injectClassnameModal();
  const filters = readClassnameFilters();
  const filtered = getFilteredClassnames(filters);
  const total = getTotalClassnameCount();
  const status = document.querySelector("#classnamesModalStatus");
  const summary = document.querySelector("#commonClassnamesSummary");
  const categoryFilters = document.querySelector("#classnameCategoryFilters");
  const scopeFilters = document.querySelector("#classnameScopeFilters");
  const list = document.querySelector("#classnamesList");

  if (status) status.textContent = `Показано: ${filtered.length}. Всего доступно: ${total}.`;
  if (summary) summary.textContent = filtered.length ? `Сейчас доступно класснеймов: ${filtered.length}` : "JSON класснеймов пока не загружен.";

  categoryFilters.innerHTML = CLASSNAME_CATEGORIES.map((category) => `
    <label class="check-row">
      <input type="checkbox" data-filter-category="${category}" ${filters.categories[category] ? "checked" : ""}>
      <span>${category}</span>
    </label>
  `).join("");

  scopeFilters.innerHTML = CLASSNAME_SCOPES.map((scope) => `
    <label class="check-row">
      <input type="checkbox" data-filter-scope="${scope}" ${filters.scopes[scope] ? "checked" : ""}>
      <span>${getScopeLabel(scope)}</span>
    </label>
  `).join("");

  list.innerHTML = filtered.length
    ? filtered.map((classname) => `<div>${escapeHtmlForClassnames(classname)}</div>`).join("")
    : "<div>Список пуст.</div>";
}

function bindClassnameManager() {
  injectClassnameModal();
  document.querySelectorAll("[data-open-classnames]").forEach((button) => {
    if (button.dataset.classnamesBound === "true") return;
    button.dataset.classnamesBound = "true";
    button.addEventListener("click", () => {
      renderClassnameManager();
      document.querySelector("#classnamesModal").classList.remove("hidden");
    });
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-classnames]")) {
      document.querySelector("#classnamesModal")?.classList.add("hidden");
    }
  });

  document.addEventListener("change", async (event) => {
    if (event.target.id === "classnamesJsonInput") {
      const file = event.target.files[0];
      if (!file) return;
      try {
        writeUserClassnameData(JSON.parse(await file.text()));
        renderClassnameManager();
      } catch (error) {
        document.querySelector("#classnamesModalStatus").textContent = error.message;
      } finally {
        event.target.value = "";
      }
    }

    if (event.target.dataset.filterCategory) {
      const filters = readClassnameFilters();
      filters.categories[event.target.dataset.filterCategory] = event.target.checked;
      writeClassnameFilters(filters);
      syncFlatClassnames();
      renderClassnameManager();
    }

    if (event.target.dataset.filterScope) {
      const filters = readClassnameFilters();
      filters.scopes[event.target.dataset.filterScope] = event.target.checked;
      writeClassnameFilters(filters);
      syncFlatClassnames();
      renderClassnameManager();
    }
  });

  syncFlatClassnames();
  renderClassnameManager();
  loadVanillaClassnameJson();
}

async function loadVanillaClassnameJson() {
  if (countClassnameData(vanillaClassnameData)) {
    syncFlatClassnames();
    renderClassnameManager();
    return;
  }

  try {
    const response = await fetch(`${getRootPrefix()}classnames.json`, { cache: "no-store" });
    if (!response.ok) return;
    vanillaClassnameData = normalizeClassnameData(JSON.parse(await response.text()));
    syncFlatClassnames();
    renderClassnameManager();
  } catch {
  }
}

function getRootPrefix() {
  return location.pathname.includes("/modernstash/") || location.pathname.includes("/randomgifts/") ? "../" : "";
}

function escapeHtmlForClassnames(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

bindClassnameManager();
