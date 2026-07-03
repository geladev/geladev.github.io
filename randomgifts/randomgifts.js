const DEFAULT_CONFIG = { G_RandomGifts: [] };
const CLASSNAME_STORAGE_KEY = "gelik_common_classnames";
const CONFIG_STORAGE_KEY = "randomgifts_editor_config";
const SELECTED_GROUP_STORAGE_KEY = "randomgifts_editor_selected_group";
const PREVIEW_COLLAPSED_STORAGE_KEY = "randomgifts_editor_preview_collapsed";

let config = structuredClone(DEFAULT_CONFIG);
let selectedGroupIndex = -1;
let baseClassnameOptions = [];
let userClassnameOptions = readStoredClassnames();
let classnameOptions = [];
let isRestoringState = true;

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
const addItemBtn = document.querySelector("#addItemBtn");
const itemList = document.querySelector("#itemList");
const giftClassname = document.querySelector("#giftClassname");
const itemsMin = document.querySelector("#itemsMin");
const itemsMax = document.querySelector("#itemsMax");
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

function createGroup() {
  return {
    G_GiftClassname: "Gelik_RandomGift_New",
    G_GiftItemsMinMax: [1, 1],
    G_Items: []
  };
}

function createItem() {
  return {
    G_ClassName: "NewItem",
    G_QuantityMinMax: [-1, -1],
    G_GlobalHealthMinMax: [-1, -1],
    G_Chance: -1
  };
}

function normalizeConfig(input) {
  if (!input || !Array.isArray(input.G_RandomGifts)) {
    throw new Error(i18n("randomgiftsInvalidJson"));
  }

  input.G_RandomGifts.forEach((group) => {
    group.G_GiftClassname = group.G_GiftClassname || "";
    group.G_GiftItemsMinMax = normalizePair(group.G_GiftItemsMinMax, [1, 1]);
    group.G_Items = Array.isArray(group.G_Items) ? group.G_Items : [];
    group.G_Items.forEach((item) => {
      item.G_ClassName = item.G_ClassName || "";
      item.G_QuantityMinMax = normalizePair(item.G_QuantityMinMax, [-1, -1]);
      item.G_GlobalHealthMinMax = normalizePair(item.G_GlobalHealthMinMax, [-1, -1]);
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
  return config.G_RandomGifts[selectedGroupIndex];
}

function render() {
  renderGroups();
  renderEditor();
  renderPreview();
  saveEditorState();
}

function renderGroups() {
  groupList.innerHTML = "";
  config.G_RandomGifts.forEach((group, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `group-card${index === selectedGroupIndex ? " active" : ""}`;
    button.innerHTML = `<strong>${escapeHtml(group.G_GiftClassname || i18n("noClassname"))}</strong><span>${group.G_Items.length} loot</span>`;
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

  groupTitle.textContent = group.G_GiftClassname || i18n("giftGroup");
  groupSubtitle.textContent = i18n("groupOf", { current: selectedGroupIndex + 1, total: config.G_RandomGifts.length });
  giftClassname.value = group.G_GiftClassname;
  itemsMin.value = group.G_GiftItemsMinMax[0];
  itemsMax.value = group.G_GiftItemsMinMax[1];
  renderItems(group);
  applyTooltips(groupForm);
  applyClassnameAutocomplete(groupForm);
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
            <label>G_ClassName<input data-key="G_ClassName" type="text" value="${escapeAttribute(item.G_ClassName)}" data-classname-field data-tooltip-key="itemClassname"></label>
            <label>G_Chance<input data-key="G_Chance" type="number" min="0" max="100" step="1" value="${escapeAttribute(item.G_Chance)}" data-tooltip-key="itemChance"></label>
          </div>
        </section>
        <section class="item-subblock">
          <h4>${i18n("quantityHealth")}</h4>
          <div class="item-grid">
            <label>G_QuantityMinMax min<input data-pair="G_QuantityMinMax" data-index="0" type="number" step="1" value="${escapeAttribute(item.G_QuantityMinMax[0])}" data-tooltip-key="itemQuantityMin"></label>
            <label>G_QuantityMinMax max<input data-pair="G_QuantityMinMax" data-index="1" type="number" step="1" value="${escapeAttribute(item.G_QuantityMinMax[1])}" data-tooltip-key="itemQuantityMax"></label>
            <label>G_GlobalHealthMinMax min${createHealthSelect("G_GlobalHealthMinMax", 0, item.G_GlobalHealthMinMax[0], "itemHealthMin")}</label>
            <label>G_GlobalHealthMinMax max${createHealthSelect("G_GlobalHealthMinMax", 1, item.G_GlobalHealthMinMax[1], "itemHealthMax")}</label>
          </div>
        </section>
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

    itemList.append(card);
  });
}

function renderPreview() {
  jsonPreview.textContent = stringifyConfig(cleanConfig(config));
  saveEditorState();
}

function cleanConfig(source) {
  return {
    G_RandomGifts: source.G_RandomGifts.map((group) => ({
      G_GiftClassname: group.G_GiftClassname,
      G_GiftItemsMinMax: group.G_GiftItemsMinMax,
      G_Items: group.G_Items.map(cleanItem)
    }))
  };
}

function cleanItem(item) {
  const result = {
    G_ClassName: item.G_ClassName
  };
  if (hasUsefulPair(item.G_QuantityMinMax) && !item.G_QuantityMinMax.includes(-1)) result.G_QuantityMinMax = item.G_QuantityMinMax;
  if (hasUsefulPair(item.G_GlobalHealthMinMax) && !item.G_GlobalHealthMinMax.includes(-1)) result.G_GlobalHealthMinMax = item.G_GlobalHealthMinMax;
  if (item.G_Chance !== -1) result.G_Chance = item.G_Chance;
  return result;
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

function hasUsefulPair(pair) {
  return Array.isArray(pair) && (pair[0] !== 0 || pair[1] !== 0);
}

function stringifyConfig(value) {
  return JSON.stringify(value, null, 4).replace(/\[\n\s+((?:"[^"]*"|-?\d+(?:\.\d+)?)(?:,\n\s+(?:"[^"]*"|-?\d+(?:\.\d+)?))*)\n\s+\]/g, (match) => match.replace(/\s*\n\s*/g, " "));
}

function loadEditorState() {
  try {
    const savedConfig = JSON.parse(localStorage.getItem(CONFIG_STORAGE_KEY) || "null");
    if (savedConfig && Array.isArray(savedConfig.G_RandomGifts)) {
      config = normalizeConfig(savedConfig);
      const savedIndex = Number(localStorage.getItem(SELECTED_GROUP_STORAGE_KEY));
      selectedGroupIndex = Number.isInteger(savedIndex)
        ? Math.min(Math.max(savedIndex, 0), config.G_RandomGifts.length - 1)
        : (config.G_RandomGifts.length ? 0 : -1);
      return;
    }
  } catch {
    config = structuredClone(DEFAULT_CONFIG);
    selectedGroupIndex = -1;
  }
  resetConfigToDefault(false);
}

function saveEditorState() {
  if (isRestoringState) return;
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(cleanConfig(config)));
  localStorage.setItem(SELECTED_GROUP_STORAGE_KEY, String(selectedGroupIndex));
  localStorage.setItem(PREVIEW_COLLAPSED_STORAGE_KEY, document.body.classList.contains("preview-collapsed") ? "1" : "0");
}

function restorePreviewState() {
  const collapsed = localStorage.getItem(PREVIEW_COLLAPSED_STORAGE_KEY) === "1";
  document.body.classList.toggle("preview-collapsed", collapsed);
  togglePreviewBtn.textContent = collapsed ? i18n("showPreview") : i18n("hidePreview");
}

function resetConfigToDefault(shouldRender = true) {
  config = structuredClone(DEFAULT_CONFIG);
  config.G_RandomGifts.push(createGroup());
  selectedGroupIndex = 0;
  if (shouldRender) {
    render();
    saveEditorState();
    setStatus(i18n("configCleared"));
  }
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

function applyClassnameAutocomplete(root = document) {
  root.querySelectorAll("[data-classname-field]").forEach((element) => {
    element.setAttribute("list", "classnameOptions");
    element.setAttribute("autocomplete", "off");
  });
}

function applyTooltips(root = document) {
  root.querySelectorAll("[data-tooltip-key]").forEach((element) => {
    if (!getTooltipText(window.RANDOMGIFTS_TOOLTIPS?.[element.dataset.tooltipKey]) || element.dataset.tooltipBound === "true") return;

    element.dataset.tooltipBound = "true";
    element.addEventListener("mouseenter", (event) => showTooltip(element, getTooltipText(window.RANDOMGIFTS_TOOLTIPS?.[element.dataset.tooltipKey]), event));
    element.addEventListener("mousemove", (event) => moveTooltip(event));
    element.addEventListener("mouseleave", hideTooltip);
    element.addEventListener("focus", (event) => showTooltip(element, getTooltipText(window.RANDOMGIFTS_TOOLTIPS?.[element.dataset.tooltipKey]), event));
    element.addEventListener("blur", hideTooltip);
  });
}

function getTooltipText(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[window.gelikI18n?.getLanguage?.() || "ru"] || value.ru || "";
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
  }
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

giftClassname.addEventListener("input", () => {
  const group = currentGroup();
  if (!group) return;
  group.G_GiftClassname = giftClassname.value;
  renderGroups();
  renderPreview();
});

itemsMin.addEventListener("input", () => {
  const group = currentGroup();
  if (!group) return;
  group.G_GiftItemsMinMax[0] = numberOr(itemsMin.value, 0);
  renderPreview();
});

itemsMax.addEventListener("input", () => {
  const group = currentGroup();
  if (!group) return;
  group.G_GiftItemsMinMax[1] = numberOr(itemsMax.value, 0);
  renderPreview();
});

fileInput.addEventListener("change", async () => {
  const file = fileInput.files[0];
  if (!file) return;
  try {
    config = normalizeConfig(JSON.parse(await file.text()));
    selectedGroupIndex = config.G_RandomGifts.length ? 0 : -1;
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
  config.G_RandomGifts.push(createGroup());
  selectedGroupIndex = config.G_RandomGifts.length - 1;
  render();
});

duplicateGroupBtn.addEventListener("click", () => {
  const group = currentGroup();
  if (!group) return;
  config.G_RandomGifts.splice(selectedGroupIndex + 1, 0, structuredClone(group));
  selectedGroupIndex += 1;
  render();
});

deleteGroupBtn.addEventListener("click", () => {
  if (selectedGroupIndex < 0) return;
  config.G_RandomGifts.splice(selectedGroupIndex, 1);
  selectedGroupIndex = Math.min(selectedGroupIndex, config.G_RandomGifts.length - 1);
  render();
});

addItemBtn.addEventListener("click", () => {
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
