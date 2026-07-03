const DEFAULT_CONFIG = {
  G_ModernStash: []
};

const CLASSNAME_STORAGE_KEY = "gelik_common_classnames";
const MODERNSTASH_CONFIG_STORAGE_KEY = "modernstash_editor_config";
const MODERNSTASH_SELECTED_GROUP_STORAGE_KEY = "modernstash_editor_selected_group";
const MODERNSTASH_PREVIEW_COLLAPSED_STORAGE_KEY = "modernstash_editor_preview_collapsed";
let isRestoringState = true;

let config = structuredClone(DEFAULT_CONFIG);
let selectedGroupIndex = -1;
let classnameOptions = [];
let baseClassnameOptions = [];
let userClassnameOptions = readStoredClassnames();

const fileInput = document.querySelector("#fileInput");
const classnamesInput = document.querySelector("#classnamesInput");
const downloadBtn = document.querySelector("#downloadBtn");
const addGroupBtn = document.querySelector("#addGroupBtn");
const groupList = document.querySelector("#groupList");
const groupForm = document.querySelector("#groupForm");
const groupTitle = document.querySelector("#groupTitle");
const groupSubtitle = document.querySelector("#groupSubtitle");
const duplicateGroupBtn = document.querySelector("#duplicateGroupBtn");
const deleteGroupBtn = document.querySelector("#deleteGroupBtn");
const classList = document.querySelector("#classList");
const toolList = document.querySelector("#toolList");
const itemList = document.querySelector("#itemList");
const jsonPreview = document.querySelector("#jsonPreview");
const status = document.querySelector("#status");
const copyBtn = document.querySelector("#copyBtn");
const togglePreviewBtn = document.querySelector("#togglePreviewBtn");
const resetConfigBtn = document.querySelector("#resetConfigBtn");
const classnameOptionsList = document.querySelector("#classnameOptions");
const tooltip = document.createElement("div");
tooltip.className = "field-tooltip";
document.body.append(tooltip);

function i18n(key, variables) {
  return window.gelikI18n?.t(key, variables) || key;
}

const fields = {
  itemsMin: document.querySelector("#itemsMin"),
  itemsMax: document.querySelector("#itemsMax"),
  openActionType: document.querySelector("#openActionType"),
  spawnType: document.querySelector("#spawnType"),
  spawnChance: document.querySelector("#spawnChance"),
  openable: document.querySelector("#openable"),
  removeOnOpen: document.querySelector("#removeOnOpen")
};

function createGroup() {
  return {
    G_StashClassname: ["Gelik_Stash_New"],
    G_StashItemsMinMax: [1, 1],
    G_OpenableWith: {
      Hands: "1|0"
    },
    G_OpenActionType: 0,
    G_StashSpawnType: 0,
    G_StashSpawnChance: 100,
    G_StashOpenable: 0,
    G_StashRemoveOnOpen: 15,
    G_Items: []
  };
}

function createItem() {
  return {
    G_ClassName: "NewItem",
    G_Attachments: [],
    G_Magazine: "",
    G_MagazineAmmoCountMinMax: [-1, -1],
    G_GlobalHealthMinMax: [-1, -1],
    G_QuantityMinMax: [-1, -1],
    G_Chance: -1
  };
}

function normalizeConfig(input) {
  if (!input || !Array.isArray(input.G_ModernStash)) {
    throw new Error(i18n("modernstashInvalidJson"));
  }

  input.G_ModernStash.forEach((group) => {
    group.G_StashClassname = Array.isArray(group.G_StashClassname) ? group.G_StashClassname : [];
    group.G_StashItemsMinMax = normalizePair(group.G_StashItemsMinMax, [1, 1]);
    group.G_OpenableWith = group.G_OpenableWith && typeof group.G_OpenableWith === "object" && !Array.isArray(group.G_OpenableWith)
      ? group.G_OpenableWith
      : {};
    group.G_OpenActionType = numberOr(group.G_OpenActionType, 0);
    group.G_StashSpawnType = numberOr(group.G_StashSpawnType, 0);
    group.G_StashSpawnChance = numberOr(group.G_StashSpawnChance, 100);
    group.G_StashOpenable = numberOr(group.G_StashOpenable, 0);
    group.G_StashRemoveOnOpen = numberOr(group.G_StashRemoveOnOpen, 15);
    group.G_Items = Array.isArray(group.G_Items) ? group.G_Items : [];

    group.G_Items.forEach((item) => {
      item.G_ClassName = item.G_ClassName || "";
      item.G_Attachments = Array.isArray(item.G_Attachments) ? item.G_Attachments : [];
      item.G_Magazine = item.G_Magazine || "";
      item.G_MagazineAmmoCountMinMax = normalizePair(item.G_MagazineAmmoCountMinMax, [-1, -1]);
      item.G_GlobalHealthMinMax = normalizePair(item.G_GlobalHealthMinMax, [-1, -1]);
      item.G_QuantityMinMax = normalizePair(item.G_QuantityMinMax, [-1, -1]);
      item.G_Chance = numberOr(item.G_Chance, -1);
    });
  });

  return input;
}

function normalizePair(value, fallback) {
  if (!Array.isArray(value)) return [...fallback];
  return [numberOr(value[0], fallback[0]), numberOr(value[1], fallback[1])];
}

function numberOr(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function currentGroup() {
  return config.G_ModernStash[selectedGroupIndex];
}

function render() {
  renderGroups();
  renderEditor();
  renderPreview();
  saveEditorState();
}

function loadEditorState() {
  try {
    const savedConfig = JSON.parse(localStorage.getItem(MODERNSTASH_CONFIG_STORAGE_KEY) || "null");
    if (savedConfig && Array.isArray(savedConfig.G_ModernStash)) {
      config = normalizeConfig(savedConfig);
      const savedIndex = Number(localStorage.getItem(MODERNSTASH_SELECTED_GROUP_STORAGE_KEY));
      selectedGroupIndex = Number.isInteger(savedIndex)
        ? Math.min(Math.max(savedIndex, 0), config.G_ModernStash.length - 1)
        : (config.G_ModernStash.length ? 0 : -1);
      return;
    }
  } catch {
    config = structuredClone(DEFAULT_CONFIG);
    selectedGroupIndex = -1;
  }

  config.G_ModernStash.push(createGroup());
  selectedGroupIndex = 0;
}

function saveEditorState() {
  if (isRestoringState) return;
  localStorage.setItem(MODERNSTASH_CONFIG_STORAGE_KEY, JSON.stringify(cleanConfig(config)));
  localStorage.setItem(MODERNSTASH_SELECTED_GROUP_STORAGE_KEY, String(selectedGroupIndex));
  localStorage.setItem(MODERNSTASH_PREVIEW_COLLAPSED_STORAGE_KEY, document.body.classList.contains("preview-collapsed") ? "1" : "0");
}

function restorePreviewState() {
  const collapsed = localStorage.getItem(MODERNSTASH_PREVIEW_COLLAPSED_STORAGE_KEY) === "1";
  document.body.classList.toggle("preview-collapsed", collapsed);
  togglePreviewBtn.textContent = collapsed ? i18n("showPreview") : i18n("hidePreview");
}

function resetConfigToDefault() {
  config = structuredClone(DEFAULT_CONFIG);
  config.G_ModernStash.push(createGroup());
  selectedGroupIndex = 0;
  render();
  saveEditorState();
  setStatus(i18n("configCleared"));
}

function renderGroups() {
  groupList.innerHTML = "";

  config.G_ModernStash.forEach((group, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `group-card${index === selectedGroupIndex ? " active" : ""}`;
    const firstClass = group.G_StashClassname[0] || i18n("noClassname");
    button.innerHTML = `<strong>${escapeHtml(firstClass)}</strong><span>${group.G_StashClassname.length} classname, ${group.G_Items.length} loot</span>`;
    button.addEventListener("click", () => {
      selectedGroupIndex = index;
      render();
      saveEditorState();
    });
    groupList.append(button);
  });
}

function renderEditor() {
  const group = currentGroup();
  groupForm.classList.toggle("hidden", !group);
  if (!group) return;

  groupTitle.textContent = group.G_StashClassname[0] || i18n("stashGroup");
  groupSubtitle.textContent = i18n("groupOf", { current: selectedGroupIndex + 1, total: config.G_ModernStash.length });
  fields.itemsMin.value = group.G_StashItemsMinMax[0];
  fields.itemsMax.value = group.G_StashItemsMinMax[1];
  fields.openActionType.value = group.G_OpenActionType;
  fields.spawnType.value = group.G_StashSpawnType;
  fields.spawnChance.value = group.G_StashSpawnChance;
  fields.openable.value = group.G_StashOpenable;
  fields.removeOnOpen.value = group.G_StashRemoveOnOpen;

  renderClassnames(group);
  renderTools(group);
  renderItems(group);
  toggleOpenableWithPanel(group);
  applyTooltips(groupForm);
  applyClassnameAutocomplete(groupForm);
}

function renderClassnames(group) {
  classList.innerHTML = "";
  group.G_StashClassname.forEach((classname, index) => {
    const row = createTextRow(classname, "Classname", (value) => {
      group.G_StashClassname[index] = value;
      renderGroups();
      renderPreview();
    }, () => {
      group.G_StashClassname.splice(index, 1);
      render();
    }, "stashClassname", true);
    classList.append(row);
  });
}

function renderTools(group) {
  toolList.innerHTML = "";
  Object.entries(group.G_OpenableWith).forEach(([tool, value]) => {
    const [time, damage] = String(value).split("|");
    const row = document.createElement("div");
    row.className = "row tool-row";
    row.innerHTML = `
      <input type="text" aria-label="G_OpenableWith classname" placeholder="Classname / Hands" value="${escapeAttribute(tool)}" data-tooltip-key="openableTool" data-classname-field>
      <input type="number" step="1" aria-label="G_OpenableWith time" placeholder="${i18n("time")}" value="${escapeAttribute(time || "0")}" data-tooltip-key="openableTime">
      <input type="number" step="1" aria-label="G_OpenableWith damage" placeholder="${i18n("damage")}" value="${escapeAttribute(damage || "0")}" data-tooltip-key="openableDamage">
      <button class="remove" type="button" title="${i18n("delete")}">×</button>
    `;
    const [nameInput, timeInput, damageInput] = row.querySelectorAll("input");
    const update = () => {
      delete group.G_OpenableWith[tool];
      const nextName = nameInput.value.trim();
      if (nextName) {
        group.G_OpenableWith[nextName] = `${numberOr(timeInput.value, 0)}|${numberOr(damageInput.value, 0)}`;
      }
      renderPreview();
    };
    nameInput.addEventListener("change", () => {
      update();
      render();
    });
    timeInput.addEventListener("input", update);
    damageInput.addEventListener("input", update);
    row.querySelector("button").addEventListener("click", () => {
      delete group.G_OpenableWith[tool];
      render();
    });
    toolList.append(row);
  });
}

function renderItems(group) {
  itemList.innerHTML = "";
  group.G_Items.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `
      <div class="item-head">
        <h3>${escapeHtml(item.G_ClassName || i18n("itemNumber", { number: index + 1 }))}</h3>
        <button class="remove" type="button" title="${i18n("delete")}">×</button>
      </div>
      <div class="item-settings">
        <section class="item-subblock">
          <h4>${i18n("item")}</h4>
          <div class="item-grid two-cols">
            <label>G_ClassName<input data-key="G_ClassName" type="text" value="${escapeAttribute(item.G_ClassName)}" data-tooltip-key="itemClassname" data-classname-field></label>
            <label>G_Chance<input data-key="G_Chance" type="number" min="0" max="100" step="1" value="${escapeAttribute(item.G_Chance)}" data-tooltip-key="itemChance"></label>
          </div>
        </section>

        <section class="item-subblock">
          <h4>${i18n("magazineAmmo")}</h4>
          <div class="item-grid">
            <label>G_Magazine<input data-key="G_Magazine" type="text" value="${escapeAttribute(item.G_Magazine)}" data-tooltip-key="itemMagazine" data-classname-field></label>
            <label>G_MagazineAmmoCountMinMax min<input data-pair="G_MagazineAmmoCountMinMax" data-index="0" type="number" step="1" value="${escapeAttribute(item.G_MagazineAmmoCountMinMax[0])}" data-tooltip-key="itemAmmoMin"></label>
            <label>G_MagazineAmmoCountMinMax max<input data-pair="G_MagazineAmmoCountMinMax" data-index="1" type="number" step="1" value="${escapeAttribute(item.G_MagazineAmmoCountMinMax[1])}" data-tooltip-key="itemAmmoMax"></label>
          </div>
        </section>

        <section class="item-subblock">
          <h4>${i18n("healthQuantity")}</h4>
          <div class="item-grid">
            <label>G_GlobalHealthMinMax min${createHealthSelect("G_GlobalHealthMinMax", 0, item.G_GlobalHealthMinMax[0], "itemHealthMin")}</label>
            <label>G_GlobalHealthMinMax max${createHealthSelect("G_GlobalHealthMinMax", 1, item.G_GlobalHealthMinMax[1], "itemHealthMax")}</label>
            <label>G_QuantityMinMax min<input data-pair="G_QuantityMinMax" data-index="0" type="number" step="1" value="${escapeAttribute(item.G_QuantityMinMax[0])}" data-tooltip-key="itemQuantityMin"></label>
            <label>G_QuantityMinMax max<input data-pair="G_QuantityMinMax" data-index="1" type="number" step="1" value="${escapeAttribute(item.G_QuantityMinMax[1])}" data-tooltip-key="itemQuantityMax"></label>
          </div>
        </section>
      </div>
      <div class="attachments-panel item-subblock">
        <div class="panel-head">
          <h3>G_Attachments</h3>
          <button class="small-button add-attachment" type="button">${i18n("add")}</button>
        </div>
        <div class="stack attachment-list"></div>
      </div>
    `;

    card.querySelector(".remove").addEventListener("click", () => {
      group.G_Items.splice(index, 1);
      render();
    });

    card.querySelectorAll("input, select").forEach((input) => {
      input.addEventListener("input", () => {
        if (input.dataset.key) {
          item[input.dataset.key] = input.type === "number" ? numberOr(input.value, 0) : input.value;
        } else if (input.dataset.pair) {
          updatePairValue(item, input.dataset.pair, Number(input.dataset.index), numberOr(input.value, 0));
        }
        renderGroups();
        renderPreview();
      });
    });

    const attachmentList = card.querySelector(".attachment-list");
    renderAttachments(attachmentList, item);
    card.querySelector(".add-attachment").addEventListener("click", () => {
      item.G_Attachments.push("");
      render();
    });

    itemList.append(card);
  });
}

function renderAttachments(container, item) {
  container.innerHTML = "";
  item.G_Attachments.forEach((attachment, index) => {
    const row = createTextRow(attachment, "Attachment", (value) => {
      item.G_Attachments[index] = value;
      renderPreview();
    }, () => {
      item.G_Attachments.splice(index, 1);
      render();
    }, "itemAttachment", true);
    container.append(row);
  });
}

function createTextRow(value, label, onInput, onRemove, tooltipKey, useClassnameList = false) {
  const row = document.createElement("div");
  row.className = "row";
  row.innerHTML = `<input type="text" aria-label="${label}" value="${escapeAttribute(value)}"${tooltipKey ? ` data-tooltip-key="${tooltipKey}"` : ""}${useClassnameList ? " data-classname-field" : ""}><button class="remove" type="button" title="${i18n("delete")}">×</button>`;
  row.querySelector("input").addEventListener("input", (event) => onInput(event.target.value));
  row.querySelector("button").addEventListener("click", onRemove);
  return row;
}

function createHealthSelect(pairName, index, value, tooltipKey) {
  const options = [
    [-1, i18n("healthUnset")],
    [0, i18n("healthPristine")],
    [1, i18n("healthWorn")],
    [2, i18n("healthDamaged")],
    [3, i18n("healthBadlyDamaged")],
    [4, i18n("healthRuined")]
  ];
  return `<select data-pair="${pairName}" data-index="${index}" data-tooltip-key="${tooltipKey}">${options.map(([optionValue, label]) => `<option value="${optionValue}"${Number(value) === optionValue ? " selected" : ""}>${label}</option>`).join("")}</select>`;
}

function updatePairValue(item, pairName, index, value) {
  item[pairName][index] = value;
  if (pairName === "G_GlobalHealthMinMax" && value === -1) {
    item[pairName] = [-1, -1];
    render();
  }
}

function renderPreview() {
  jsonPreview.textContent = stringifyConfig(cleanConfig(config));
  saveEditorState();
}

function cleanConfig(source) {
  return {
    G_ModernStash: source.G_ModernStash.map((group) => ({
      G_StashClassname: group.G_StashClassname.filter(Boolean),
      G_StashItemsMinMax: group.G_StashItemsMinMax,
      G_OpenableWith: group.G_OpenableWith,
      G_OpenActionType: group.G_OpenActionType,
      G_StashSpawnType: group.G_StashSpawnType,
      G_StashSpawnChance: group.G_StashSpawnChance,
      G_StashOpenable: group.G_StashOpenable,
      G_StashRemoveOnOpen: group.G_StashRemoveOnOpen,
      G_Items: group.G_Items.map(cleanItem)
    }))
  };
}

function cleanItem(item) {
  const result = {
    G_ClassName: item.G_ClassName
  };

  const attachments = item.G_Attachments.filter(Boolean);
  if (attachments.length) result.G_Attachments = attachments;
  if (item.G_Magazine) result.G_Magazine = item.G_Magazine;
  if (hasUsefulPair(item.G_MagazineAmmoCountMinMax) && !item.G_MagazineAmmoCountMinMax.includes(-1)) result.G_MagazineAmmoCountMinMax = item.G_MagazineAmmoCountMinMax;
  if (hasUsefulPair(item.G_GlobalHealthMinMax) && !item.G_GlobalHealthMinMax.includes(-1)) result.G_GlobalHealthMinMax = item.G_GlobalHealthMinMax;
  if (hasUsefulPair(item.G_QuantityMinMax) && !item.G_QuantityMinMax.includes(-1)) result.G_QuantityMinMax = item.G_QuantityMinMax;
  if (item.G_Chance !== -1) result.G_Chance = item.G_Chance;

  return result;
}

function hasUsefulPair(pair) {
  return Array.isArray(pair) && (pair[0] !== 0 || pair[1] !== 0);
}

function stringifyConfig(value) {
  return JSON.stringify(value, null, 4).replace(/\[\n\s+((?:"[^"]*"|-?\d+(?:\.\d+)?)(?:,\n\s+(?:"[^"]*"|-?\d+(?:\.\d+)?))*)\n\s+\]/g, (match) => {
    return match.replace(/\s*\n\s*/g, " ");
  });
}

function setStatus(message) {
  status.textContent = message;
  window.clearTimeout(setStatus.timer);
  setStatus.timer = window.setTimeout(() => {
    status.textContent = i18n("ready");
  }, 2500);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

function applyTooltips(root = document) {
  root.querySelectorAll("[data-tooltip-key]").forEach((element) => {
    if (!getTooltipText(window.MODERN_STASH_TOOLTIPS?.[element.dataset.tooltipKey]) || element.dataset.tooltipBound === "true") return;

    element.dataset.tooltipBound = "true";
    element.addEventListener("mouseenter", (event) => showTooltip(element, getTooltipText(window.MODERN_STASH_TOOLTIPS?.[element.dataset.tooltipKey]), event));
    element.addEventListener("mousemove", (event) => moveTooltip(event));
    element.addEventListener("mouseleave", hideTooltip);
    element.addEventListener("focus", (event) => showTooltip(element, getTooltipText(window.MODERN_STASH_TOOLTIPS?.[element.dataset.tooltipKey]), event));
    element.addEventListener("blur", hideTooltip);
  });
}

function getTooltipText(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[window.gelikI18n?.getLanguage?.() || "ru"] || value.ru || "";
}

function applyClassnameAutocomplete(root = document) {
  root.querySelectorAll("[data-classname-field]").forEach((element) => {
    element.setAttribute("list", "classnameOptions");
    element.setAttribute("autocomplete", "off");
  });
}

function toggleOpenableWithPanel(group) {
  const panel = toolList.closest(".block-panel");
  if (!panel) return;
  panel.classList.toggle("hidden", Number(group.G_OpenActionType) !== 2);
}

function renderClassnameOptions() {
  classnameOptions = mergeClassnameOptions(baseClassnameOptions, userClassnameOptions);
  classnameOptionsList.innerHTML = "";
  classnameOptions.forEach((classname) => {
    const option = document.createElement("option");
    option.value = classname;
    classnameOptionsList.append(option);
  });
  applyClassnameAutocomplete(groupForm);
}

function parseClassnameText(text) {
  return text.split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && !line.startsWith("//"));
}

function mergeClassnameOptions(...lists) {
  return [...new Set(lists.flat())].sort((a, b) => a.localeCompare(b));
}

function readStoredClassnames() {
  try {
    const value = JSON.parse(localStorage.getItem(CLASSNAME_STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function writeStoredClassnames(names) {
  localStorage.setItem(CLASSNAME_STORAGE_KEY, JSON.stringify(mergeClassnameOptions(names)));
}

async function loadBaseClassnames() {
  baseClassnameOptions = readStoredClassnames();
  renderClassnameOptions();
  return;
  try {
    const response = await fetch("../classnames.json", { cache: "no-store" });
    if (!response.ok) return;
    baseClassnameOptions = parseClassnameText(await response.text());
    renderClassnameOptions();
    setStatus(i18n("baseClassnames", { count: baseClassnameOptions.length }));
  } catch {
    // При открытии index.html напрямую браузер может заблокировать fetch локального txt.
  }
}

function showTooltip(element, text, event) {
  if (!text) return;
  tooltip.textContent = text;
  tooltip.classList.add("visible");
  element.classList.add("tooltip-active");

  if (event instanceof MouseEvent) {
    moveTooltip(event);
  } else {
    placeTooltipUnderElement(element);
  }
}

function moveTooltip(event) {
  placeTooltip(event.clientX + 14, event.clientY + 16);
}

function placeTooltipUnderElement(element) {
  const rect = element.getBoundingClientRect();
  placeTooltip(rect.left, rect.bottom + 8);
}

function placeTooltip(left, top) {
  const margin = 12;
  const maxLeft = window.innerWidth - tooltip.offsetWidth - margin;
  const maxTop = window.innerHeight - tooltip.offsetHeight - margin;
  tooltip.style.left = `${Math.max(margin, Math.min(left, maxLeft))}px`;
  tooltip.style.top = `${Math.max(margin, Math.min(top, maxTop))}px`;
}

function hideTooltip() {
  tooltip.classList.remove("visible");
  document.querySelectorAll(".tooltip-active").forEach((element) => {
    element.classList.remove("tooltip-active");
  });
}

Object.values(fields).forEach((input) => {
  input.addEventListener("input", () => {
    const group = currentGroup();
    if (!group) return;
    group.G_StashItemsMinMax = [numberOr(fields.itemsMin.value, 0), numberOr(fields.itemsMax.value, 0)];
    group.G_OpenActionType = numberOr(fields.openActionType.value, 0);
    group.G_StashSpawnType = numberOr(fields.spawnType.value, 0);
    group.G_StashSpawnChance = numberOr(fields.spawnChance.value, 0);
    group.G_StashOpenable = numberOr(fields.openable.value, 0);
    group.G_StashRemoveOnOpen = numberOr(fields.removeOnOpen.value, 0);
    toggleOpenableWithPanel(group);
    renderPreview();
  });
});

fileInput.addEventListener("change", async () => {
  const file = fileInput.files[0];
  if (!file) return;

  try {
    const text = await file.text();
    config = normalizeConfig(JSON.parse(text));
    selectedGroupIndex = config.G_ModernStash.length ? 0 : -1;
    render();
    setStatus(i18n("loadedFile", { name: file.name }));
  } catch (error) {
    setStatus(error.message);
  } finally {
    fileInput.value = "";
  }
});

classnamesInput.addEventListener("change", async () => {
  const file = classnamesInput.files[0];
  if (!file) return;

  try {
    const text = await file.text();
    const names = text.split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && !line.startsWith("//"));
    classnameOptions = [...new Set(names)].sort((a, b) => a.localeCompare(b));
    renderClassnameOptions();
    setStatus(i18n("loadedClassnames", { count: classnameOptions.length }));
  } catch (error) {
    setStatus(error.message);
  } finally {
    classnamesInput.value = "";
  }
});

classnamesInput.addEventListener("change", async (event) => {
  event.stopImmediatePropagation();
  const file = classnamesInput.files[0];
  if (!file) return;

  try {
    userClassnameOptions = parseClassnameText(await file.text());
    writeStoredClassnames(mergeClassnameOptions(userClassnameOptions, readStoredClassnames()));
    userClassnameOptions = readStoredClassnames();
    renderClassnameOptions();
    setStatus(i18n("loadedClassnames", { count: classnameOptions.length }));
  } catch (error) {
    setStatus(error.message);
  } finally {
    classnamesInput.value = "";
  }
}, true);

classnamesInput.addEventListener("change", async () => {
  const file = classnamesInput.files[0];
  if (!file) return;

  try {
    userClassnameOptions = parseClassnameText(await file.text());
    writeStoredClassnames(mergeClassnameOptions(userClassnameOptions, readStoredClassnames()));
    userClassnameOptions = readStoredClassnames();
    renderClassnameOptions();
    setStatus(i18n("loadedClassnames", { count: classnameOptions.length }));
  } catch (error) {
    setStatus(error.message);
  }
});

downloadBtn.addEventListener("click", () => {
  const blob = new Blob([stringifyConfig(cleanConfig(config))], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "config.json";
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  setStatus(i18n("configDownloaded"));
});

copyBtn.addEventListener("click", async () => {
  await navigator.clipboard.writeText(jsonPreview.textContent);
  setStatus(i18n("jsonCopied"));
});

togglePreviewBtn.addEventListener("click", () => {
  document.body.classList.toggle("preview-collapsed");
  togglePreviewBtn.textContent = document.body.classList.contains("preview-collapsed") ? i18n("showPreview") : i18n("hidePreview");
  saveEditorState();
});

resetConfigBtn.addEventListener("click", () => {
  const confirmed = window.confirm(i18n("resetConfirm"));
  if (!confirmed) return;
  resetConfigToDefault();
});

addGroupBtn.addEventListener("click", () => {
  config.G_ModernStash.push(createGroup());
  selectedGroupIndex = config.G_ModernStash.length - 1;
  render();
});

duplicateGroupBtn.addEventListener("click", () => {
  const group = currentGroup();
  if (!group) return;
  config.G_ModernStash.splice(selectedGroupIndex + 1, 0, structuredClone(group));
  selectedGroupIndex += 1;
  render();
});

deleteGroupBtn.addEventListener("click", () => {
  if (selectedGroupIndex < 0) return;
  config.G_ModernStash.splice(selectedGroupIndex, 1);
  selectedGroupIndex = Math.min(selectedGroupIndex, config.G_ModernStash.length - 1);
  render();
});

document.querySelector("#addClassBtn").addEventListener("click", () => {
  currentGroup().G_StashClassname.push("");
  render();
});

document.querySelector("#addToolBtn").addEventListener("click", () => {
  const group = currentGroup();
  let name = "NewTool";
  let index = 1;
  while (Object.hasOwn(group.G_OpenableWith, name)) {
    index += 1;
    name = `NewTool${index}`;
  }
  group.G_OpenableWith[name] = "0|0";
  render();
});

document.querySelector("#addItemBtn").addEventListener("click", () => {
  currentGroup().G_Items.push(createItem());
  render();
});

window.addEventListener("gelik-classnames-updated", () => {
  userClassnameOptions = readStoredClassnames();
  baseClassnameOptions = userClassnameOptions;
  renderClassnameOptions();
});

window.addEventListener("gelik-language-changed", () => {
  restorePreviewState();
  render();
  window.gelikI18n?.apply();
});

loadEditorState();
restorePreviewState();
renderClassnameOptions();
render();
isRestoringState = false;
saveEditorState();
loadBaseClassnames();
