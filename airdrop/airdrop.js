const AIRDROP_CONFIG_STORAGE_KEY = "airdrop_editor_config";
const AIRDROP_SELECTED_SECTION_STORAGE_KEY = "airdrop_editor_section";
const AIRDROP_PREVIEW_COLLAPSED_STORAGE_KEY = "airdrop_editor_preview_collapsed";
const AIRDROP_COLLAPSED_CARDS_STORAGE_KEY = "airdrop_editor_collapsed_cards";
const CLASSNAME_STORAGE_KEY = "gelik_common_classnames";

const DEFAULT_CONFIG = {
  Enabled: 1,
  AirdropSettings: {
    DiscordWebhookURL: "",
    MinPlayersToStart: 0,
    MaxDropsPerRestart: 1,
    TimeBetweenDrops: 60,
    CloseEventsTime: 235,
    DropVars: [
      { DropID: "AirDrop_car", Chance: 100, DropLocations: ["NWAF", "VMC"] }
    ],
    Notifications: {
      NotifTime: [30, 20, 10, 5],
      InGameMessageHeader: "Аирдроп",
      InGameMessageIconPath: "",
      InGameNotifMessage: "Внимание! Контейнер с автомобилем будет сброшен в районе %location% через %time% минут(ы).",
      InGameEventStartMessage: "Самолёт вылетел",
      InGameEventAbortMessage: "Слишком мало игроков, самолёт не вылетел",
      InGameDropMessage: "Контейнер с автомобилем сброшен у %location%!",
      InGameOpenMessage: "Открыли",
      DiscordNotifMessage: "CarDrop: Контейнер с автомобилем будет сброшен в районе %location% через %time% минут(ы).",
      DiscordEventStartMessage: "Самолёт вылетел",
      DiscordEventAbortMessage: "Слишком мало игроков, самолёт не вылетел",
      DiscordDropMessage: "CarDrop: Контейнер с автомобилем сброшен у %location%!",
      DiscordOpenMessage: "Открыли"
    },
    Marker: {
      Enabled: 1,
      Title: "AirDrop",
      Icon: "dz\\gear\\navigation\\data\\map_viewpoint_ca.paa"
    },
    DropLocations: [
      {
        Name: "NWAF",
        Positions: [[4628.32, 339.007, 10306.2]],
        ZombieCount: 15,
        ZombieList: ["ZmbM_CitizenASkinny_Blue", "ZmbM_CitizenASkinny_Grey"],
        ContaminatedArea: false
      }
    ],
    DropPresets: [
      {
        DropID: "AirDrop_car",
        AirType: "Gelik_AirDrop_IL76",
        AirSpeed: 180,
        AirHeight: 500,
        DropSpeed: 5,
        Locked: 1,
        Tools: { Default: 30, Hands: 60, Crowbar: 6 },
        TimeToRemove: 300,
        TimeToBoomOnOpen: 250,
        DropContainer: "Gelik_Container_Camo",
        CarPreset: "",
        Attachments: [],
        Cargo: [],
        DirectSpawn: [
          {
            Point: "spawn_cen",
            Items: [
              {
                Classname: "Barrel_Blue",
                Orientation: "0.000000 0.000000 -0.000000",
                Offset: "1.800293 0.181213 -4.421875",
                QuantityMinMax: "-1",
                HealthMinMax: "0|0",
                Chance: 100,
                Attachments: [],
                Cargo: []
              }
            ]
          }
        ]
      }
    ],
    CarPresets: [
      {
        Name: "DefaultCarDrop",
        Cars: [
          {
            Classname: "Offroad_02",
            Fuel: 10,
            Water: 50,
            Chance: 100,
            Attachments: [],
            Cargo: []
          }
        ]
      }
    ]
  }
};

const SECTIONS = [
  { id: "general", titleKey: "airdropGeneral", path: [] },
  { id: "settings", titleKey: "airdropSettings", path: ["AirdropSettings"], fields: ["DiscordWebhookURL", "MinPlayersToStart", "MaxDropsPerRestart", "TimeBetweenDrops", "CloseEventsTime"] },
  { id: "dropVars", titleKey: "airdropDropVars", path: ["AirdropSettings", "DropVars"] },
  { id: "notifications", titleKey: "airdropNotifications", path: ["AirdropSettings", "Notifications"] },
  { id: "marker", titleKey: "airdropMarker", path: ["AirdropSettings", "Marker"] },
  { id: "locations", titleKey: "airdropLocations", path: ["AirdropSettings", "DropLocations"] },
  { id: "dropPresets", titleKey: "airdropDropPresets", path: ["AirdropSettings", "DropPresets"] },
  { id: "carPresets", titleKey: "airdropCarPresets", path: ["AirdropSettings", "CarPresets"] }
];

let config = structuredClone(DEFAULT_CONFIG);
let selectedSectionId = localStorage.getItem(AIRDROP_SELECTED_SECTION_STORAGE_KEY) || "general";
let classnameOptions = readStoredClassnames();
let collapsedCards = readCollapsedCards();
let isRestoringState = true;

const fileInput = document.querySelector("#fileInput");
const downloadBtn = document.querySelector("#downloadBtn");
const sectionList = document.querySelector("#sectionList");
const sectionTitle = document.querySelector("#sectionTitle");
const sectionSubtitle = document.querySelector("#sectionSubtitle");
const editorContent = document.querySelector("#editorContent");
const jsonPreview = document.querySelector("#jsonPreview");
const status = document.querySelector("#status");
const copyBtn = document.querySelector("#copyBtn");
const togglePreviewBtn = document.querySelector("#togglePreviewBtn");
const resetConfigBtn = document.querySelector("#resetConfigBtn");
const classnameOptionsList = document.querySelector("#classnameOptions");
const dropPresetOptionsList = document.querySelector("#dropPresetOptions");
const dropLocationOptionsList = document.querySelector("#dropLocationOptions");
const carPresetOptionsList = document.querySelector("#carPresetOptions");
const tooltip = document.createElement("div");
tooltip.className = "field-tooltip";
document.body.append(tooltip);

function i18n(key, variables) {
  return window.gelikI18n?.t(key, variables) || key;
}

function render() {
  renderSections();
  renderLocalOptions();
  renderEditor();
  renderPreview();
  saveEditorState();
}

function renderSections() {
  sectionList.innerHTML = "";
  SECTIONS.forEach((section) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `group-card${section.id === selectedSectionId ? " active" : ""}`;
    button.innerHTML = `<strong>${i18n(section.titleKey)}</strong><span>${getSectionCount(section)}</span>`;
    button.addEventListener("click", () => {
      selectedSectionId = section.id;
      localStorage.setItem(AIRDROP_SELECTED_SECTION_STORAGE_KEY, selectedSectionId);
      render();
    });
    sectionList.append(button);
  });
}

function getSectionCount(section) {
  const value = getValue(section.path);
  if (Array.isArray(value)) return i18n("airdropRecords", { count: value.length });
  if (value && typeof value === "object") return i18n("airdropFields", { count: Object.keys(value).length });
  return "";
}

function renderEditor() {
  const section = SECTIONS.find((entry) => entry.id === selectedSectionId) || SECTIONS[0];
  sectionTitle.textContent = i18n(section.titleKey);
  sectionSubtitle.textContent = i18n("airdropEditorHint");
  editorContent.innerHTML = "";

  if (section.id === "general") {
    editorContent.append(renderObject(config, [], ["Enabled"]));
  } else {
    const value = getValue(section.path);
    editorContent.append(renderValue(value, section.path, section.fields));
  }

  applyTooltips(editorContent);
  applyClassnameAutocomplete(editorContent);
}

function renderValue(value, path, onlyFields = null) {
  if (Array.isArray(value)) return renderArray(value, path);
  if (value && typeof value === "object") {
    if (path[path.length - 1] === "Tools") return renderTools(value, path);
    return renderObject(value, path, onlyFields);
  }
  return renderPrimitive(value, path);
}

function renderObject(object, path, onlyFields = null) {
  const wrap = document.createElement("section");
  wrap.className = "panel block-panel";
  const keys = onlyFields || Object.keys(object);
  wrap.innerHTML = `<div class="object-grid"></div>`;
  const grid = wrap.querySelector(".object-grid");

  keys.forEach((key) => {
    if (!Object.hasOwn(object, key)) return;
    const childPath = [...path, key];
    const value = object[key];
    if (Array.isArray(value) || (value && typeof value === "object")) {
      const block = document.createElement("section");
      block.className = "item-subblock object-grid-wide";
      if (Array.isArray(value)) {
        block.append(renderValue(value, childPath));
      } else {
        block.innerHTML = `<div class="panel-head"><h3>${escapeHtml(key)}</h3></div>`;
        block.append(renderValue(value, childPath));
      }
      grid.append(block);
    } else {
      grid.append(renderPrimitive(value, childPath, key));
    }
  });

  return wrap;
}

function renderArray(array, path) {
  const wrap = document.createElement("section");
  wrap.className = "array-panel";
  wrap.innerHTML = `
    <div class="panel-head">
      <h3>${escapeHtml(String(path[path.length - 1] || "Array"))}</h3>
      <button class="small-button" type="button" data-action="add" data-path="${escapeAttribute(JSON.stringify(path))}">${i18n("add")}</button>
    </div>
    <div class="item-list"></div>
  `;

  const list = wrap.querySelector(".item-list");
  array.forEach((item, index) => {
    const itemPath = [...path, index];
    if (isPositionVector(path, item)) {
      const row = document.createElement("div");
      row.className = "row";
      row.innerHTML = `
        <label>${index}<input type="text" value="${escapeAttribute(formatPositionVector(item))}" data-position-path="${escapeAttribute(JSON.stringify(itemPath))}" data-tooltip-key="Positions"></label>
        <button class="remove" type="button" title="${i18n("delete")}" data-action="delete" data-path="${escapeAttribute(JSON.stringify(itemPath))}">×</button>
      `;
      list.append(row);
      return;
    }

    if (item === null || typeof item !== "object") {
      const row = document.createElement("div");
      row.className = "row";
      if (isDropVarLocationValue(itemPath)) {
        row.innerHTML = `
          <label>${index}${createDropLocationSelect(item, itemPath)}</label>
        `;
      } else {
        row.append(renderPrimitive(item, itemPath, String(index)));
      }
      row.insertAdjacentHTML("beforeend", `<button class="remove" type="button" title="${i18n("delete")}" data-action="delete" data-path="${escapeAttribute(JSON.stringify(itemPath))}">×</button>`);
      list.append(row);
      return;
    }

    const card = document.createElement("div");
    const cardKey = getCardKey(itemPath);
    const collapsed = collapsedCards.has(cardKey);
    card.className = `item-card compact-card${collapsed ? " collapsed" : ""}`;
    card.innerHTML = `
      <div class="item-head">
        <h3>${escapeHtml(getItemTitle(item, index))}</h3>
        <div class="item-head-actions">
          <button class="collapse-button" type="button" title="${collapsed ? "Развернуть" : "Свернуть"}" data-action="toggleCard" data-card-key="${escapeAttribute(cardKey)}">${collapsed ? "+" : "−"}</button>
          <button class="remove" type="button" title="${i18n("delete")}" data-action="delete" data-path="${escapeAttribute(JSON.stringify(itemPath))}">×</button>
        </div>
      </div>
    `;
    const body = document.createElement("div");
    body.className = "item-card-body";
    body.append(renderValue(item, itemPath));
    card.append(body);
    list.append(card);
  });

  return wrap;
}

function renderPrimitive(value, path, label = path[path.length - 1]) {
  const field = document.createElement("label");
  const fieldName = String(label);
  const tooltipKey = getTooltipKey(path);
  const pathAttr = escapeAttribute(JSON.stringify(path));
  const tooltipAttr = tooltipKey ? ` data-tooltip-key="${tooltipKey}"` : "";
  const classAttr = shouldUseClassnameList(path) ? " data-classname-field" : "";
  const listAttr = getDatalistId(path) ? ` list="${getDatalistId(path)}"` : "";

  if (fieldName === "HealthMinMax") {
    return renderHealthMinMax(value, path, tooltipKey);
  }

  if (fieldName === "QuantityMinMax") {
    return renderQuantityMinMax(value, path, tooltipKey);
  }

  if (typeof value === "boolean") {
    field.className = "check-row";
    field.innerHTML = `<input type="checkbox" data-path="${pathAttr}"${value ? " checked" : ""}${tooltipAttr}><span>${escapeHtml(fieldName)}</span>`;
    return field;
  }

  if (typeof value === "number") {
    field.innerHTML = `${escapeHtml(fieldName)}<input type="number" step="any" value="${escapeAttribute(value)}" data-path="${pathAttr}"${tooltipAttr}>`;
    return field;
  }

  const long = String(value).length > 80 || fieldName.toLowerCase().includes("message") || fieldName.toLowerCase().includes("webhook");
  if (long) {
    field.innerHTML = `${escapeHtml(fieldName)}<textarea rows="3" data-path="${pathAttr}"${tooltipAttr}${classAttr}>${escapeHtml(value)}</textarea>`;
  } else {
    field.innerHTML = `${escapeHtml(fieldName)}<input type="text" value="${escapeAttribute(value)}" data-previous-value="${escapeAttribute(value)}" data-path="${pathAttr}"${tooltipAttr}${classAttr}${listAttr}>`;
  }
  return field;
}

function renderHealthMinMax(value, path, tooltipKey) {
  const field = document.createElement("div");
  field.className = "health-pair object-grid-wide";
  const [min, max] = parseHealthMinMax(value);
  const pathAttr = escapeAttribute(JSON.stringify(path));
  const tooltipAttr = tooltipKey ? ` data-tooltip-key="${tooltipKey}"` : "";
  field.innerHTML = `
    <label>HealthMinMax min${createAirdropHealthSelect(pathAttr, 0, min, tooltipAttr)}</label>
    <label>HealthMinMax max${createAirdropHealthSelect(pathAttr, 1, max, tooltipAttr)}</label>
  `;
  return field;
}

function parseHealthMinMax(value) {
  const parts = String(value || "0|0").split("|").map((part) => Number(part));
  const min = Number.isFinite(parts[0]) ? clampHealth(parts[0]) : 0;
  const max = Number.isFinite(parts[1]) ? clampHealth(parts[1]) : min;
  return [min, max];
}

function clampHealth(value) {
  return Math.min(4, Math.max(0, Number(value)));
}

function createAirdropHealthSelect(pathAttr, index, value, tooltipAttr) {
  const options = [
    [0, i18n("healthPristine")],
    [1, i18n("healthWorn")],
    [2, i18n("healthDamaged")],
    [3, i18n("healthBadlyDamaged")],
    [4, i18n("healthRuined")]
  ];
  return `<select data-health-path="${pathAttr}" data-health-index="${index}"${tooltipAttr}>${options.map(([optionValue, label]) => `<option value="${optionValue}"${Number(value) === optionValue ? " selected" : ""}>${label}</option>`).join("")}</select>`;
}

function renderQuantityMinMax(value, path, tooltipKey) {
  const field = document.createElement("div");
  field.className = "quantity-pair object-grid-wide";
  const [min, max] = parseQuantityMinMax(value);
  const pathAttr = escapeAttribute(JSON.stringify(path));
  const tooltipAttr = tooltipKey ? ` data-tooltip-key="${tooltipKey}"` : "";
  field.innerHTML = `
    <label>QuantityMinMax min<input type="number" step="any" value="${escapeAttribute(min)}" data-quantity-path="${pathAttr}" data-quantity-index="0"${tooltipAttr}></label>
    <label>QuantityMinMax max<input type="number" step="any" value="${escapeAttribute(max)}" data-quantity-path="${pathAttr}" data-quantity-index="1"${tooltipAttr}></label>
  `;
  return field;
}

function parseQuantityMinMax(value) {
  if (String(value) === "-1") return [-1, -1];
  const parts = String(value || "-1").split("|").map((part) => Number(part));
  const min = Number.isFinite(parts[0]) ? parts[0] : -1;
  const max = Number.isFinite(parts[1]) ? parts[1] : min;
  return [min, max];
}

function formatQuantityMinMax(pair) {
  if (pair[0] === -1 && pair[1] === -1) return "-1";
  return `${pair[0]}|${pair[1]}`;
}

function renderTools(object, path) {
  const wrap = document.createElement("section");
  wrap.className = "array-panel";
  wrap.innerHTML = `
    <div class="panel-head">
      <h3>Tools</h3>
      <button class="small-button" type="button" data-action="addTool" data-path="${escapeAttribute(JSON.stringify(path))}">${i18n("add")}</button>
    </div>
    <div class="stack"></div>
  `;
  const list = wrap.querySelector(".stack");
  getOrderedToolEntries(object).forEach(([key, value]) => {
    const row = document.createElement("div");
    row.className = "row tool-row";
    row.innerHTML = `
      <input type="text" value="${escapeAttribute(key)}" data-tool-key="${escapeAttribute(key)}" data-path="${escapeAttribute(JSON.stringify(path))}" data-tooltip-key="Tools" data-classname-field>
      <input type="number" step="any" value="${escapeAttribute(value)}" data-tool-time="${escapeAttribute(key)}" data-path="${escapeAttribute(JSON.stringify(path))}" data-tooltip-key="Tools">
      <button class="remove" type="button" title="${i18n("delete")}" data-action="deleteTool" data-tool-key="${escapeAttribute(key)}" data-path="${escapeAttribute(JSON.stringify(path))}">×</button>
    `;
    list.append(row);
  });
  return wrap;
}

function getOrderedToolEntries(object) {
  const entries = Object.entries(object);
  const priority = ["Default", "Hands"];
  return [
    ...priority.filter((key) => Object.hasOwn(object, key)).map((key) => [key, object[key]]),
    ...entries.filter(([key]) => !priority.includes(key))
  ];
}

function addToolEntry(tools) {
  if (!Object.hasOwn(tools, "Default")) {
    tools.Default = 30;
    return;
  }
  if (!Object.hasOwn(tools, "Hands")) {
    tools.Hands = 60;
    return;
  }
  if (!Object.hasOwn(tools, "")) {
    tools[""] = 0;
    return;
  }

  let index = 1;
  let name = `NewTool${index}`;
  while (Object.hasOwn(tools, name)) {
    index += 1;
    name = `NewTool${index}`;
  }
  tools[name] = 0;
}

function getItemTitle(item, index) {
  if (item && typeof item === "object" && !Array.isArray(item)) {
    return item.DropID || item.Name || item.Classname || item.Point || `${i18n("item")} ${index + 1}`;
  }
  if (Array.isArray(item)) return item.join(", ");
  return String(item || `${i18n("item")} ${index + 1}`);
}

function getTooltipKey(path) {
  return String(path[path.length - 1]);
}

function isPositionVector(path, value) {
  return path[path.length - 1] === "Positions"
    && Array.isArray(value)
    && value.every((item) => typeof item === "number" || typeof item === "string");
}

function formatPositionVector(value) {
  return value.map((item) => Number.isFinite(Number(item)) ? Number(item) : item).join(", ");
}

function parsePositionVector(value) {
  return value
    .split(/[,\s]+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => Number(part.replace(",", ".")))
    .filter((number) => Number.isFinite(number));
}

function shouldUseClassnameList(path) {
  const key = String(path[path.length - 1]);
  return ["Classname", "AirType", "DropContainer"].includes(key) || path.includes("ZombieList");
}

function getDatalistId(path) {
  const key = String(path[path.length - 1]);
  if (key === "DropID" && path.includes("DropVars")) return "dropPresetOptions";
  if (key === "CarPreset") return "carPresetOptions";
  if (isDropVarLocationValue(path)) return "dropLocationOptions";
  return "";
}

function isDropVarLocationValue(path) {
  return path.includes("DropVars")
    && path.includes("DropLocations")
    && typeof path[path.length - 1] === "number";
}

function createDropLocationSelect(value, path) {
  const values = [...new Set([value, ...getDropLocationNames()].filter(Boolean))];
  if (!values.length) values.push("");
  return `<select data-path="${escapeAttribute(JSON.stringify(path))}" data-tooltip-key="DropLocations">${values.map((name) => `<option value="${escapeAttribute(name)}"${name === value ? " selected" : ""}>${escapeHtml(name || i18n("airdropNoCarPreset"))}</option>`).join("")}</select>`;
}

function getValue(path) {
  return path.reduce((current, key) => current?.[key], config);
}

function setValue(path, value) {
  const parent = getValue(path.slice(0, -1));
  parent[path[path.length - 1]] = value;
}

function deleteValue(path) {
  const parent = getValue(path.slice(0, -1));
  const key = path[path.length - 1];
  if (Array.isArray(parent)) parent.splice(key, 1);
  else delete parent[key];
}

function getDefaultArrayItem(path) {
  const key = String(path[path.length - 1]);
  if (key === "DropLocations" && path.includes("DropVars")) return "AirDrop";
  if (key === "DropLocations") {
    return { Name: "NewLocation", Positions: [[0, 0, 0]], ZombieCount: 0, ZombieList: [], ContaminatedArea: false };
  }

  const templates = {
    DropVars: { DropID: "AirDrop_new", Chance: 100, DropLocations: [] },
    DropPresets: structuredClone(DEFAULT_CONFIG.AirdropSettings.DropPresets[0]),
    CarPresets: structuredClone(DEFAULT_CONFIG.AirdropSettings.CarPresets[0]),
    Cars: { Classname: "Offroad_02", Fuel: 0, Water: 0, Chance: 100, Attachments: [], Cargo: [] },
    Items: createAirdropItem(true),
    DirectSpawn: { Point: "spawn_cen", Items: [] },
    Positions: [0, 0, 0],
    ZombieList: "ZmbM_CitizenASkinny_Blue",
    Attachments: createAirdropItem(false),
    Cargo: createAirdropItem(false),
    NotifTime: 5
  };
  return structuredClone(templates[key] ?? "");
}

function createAirdropItem(includeTransform) {
  const item = {
    Classname: "NewItem",
    QuantityMinMax: "-1",
    HealthMinMax: "0|0",
    Chance: 100,
    Attachments: [],
    Cargo: []
  };
  if (includeTransform) {
    item.Orientation = "0.000000 0.000000 -0.000000";
    item.Offset = "0.000000 0.000000 0.000000";
  }
  return item;
}

function normalizeConfig(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error(i18n("airdropInvalidJson"));
  }
  if (!input.AirdropSettings || typeof input.AirdropSettings !== "object") {
    input.AirdropSettings = structuredClone(DEFAULT_CONFIG.AirdropSettings);
  }
  return sanitizeAirdropConfig(input);
}

function sanitizeAirdropConfig(source) {
  return sanitizeAirdropValue(structuredClone(source), []);
}

function sanitizeAirdropValue(value, path) {
  if (Array.isArray(value)) {
    return value.map((item, index) => sanitizeAirdropValue(item, [...path, index]));
  }
  if (value && typeof value === "object") {
    if (isAttachmentOrCargoPath(path)) {
      delete value.Orientation;
      delete value.Offset;
    }
    Object.keys(value).forEach((key) => {
      value[key] = sanitizeAirdropValue(value[key], [...path, key]);
    });
  }
  return value;
}

function isAttachmentOrCargoPath(path) {
  return path.includes("Attachments") || path.includes("Cargo");
}

function stripJsonComments(text) {
  let result = "";
  let inString = false;
  let escaped = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (inString) {
      result += char;
      if (escaped) {
        escaped = false;
        continue;
      }
      if (char === "\\") {
        escaped = true;
        continue;
      }
      if (char === "\"") inString = false;
      continue;
    }
    if (char === "\"") {
      inString = true;
      result += char;
      continue;
    }
    if (char === "/" && next === "/") {
      while (index < text.length && text[index] !== "\n") index += 1;
      result += "\n";
      continue;
    }
    result += char;
  }
  return result;
}

function stringifyConfig(value) {
  return JSON.stringify(value, null, 4)
    .replace(/\[\n\s+((?:"[^"]*"|-?\d+(?:\.\d+)?|true|false|null)(?:,\n\s+(?:"[^"]*"|-?\d+(?:\.\d+)?|true|false|null))*)\n\s+\]/g, (match) => match.replace(/\s*\n\s*/g, " "));
}

function renderPreview() {
  jsonPreview.textContent = stringifyConfig(sanitizeAirdropConfig(config));
  saveEditorState();
}

function loadEditorState() {
  try {
    const saved = JSON.parse(localStorage.getItem(AIRDROP_CONFIG_STORAGE_KEY) || "null");
    if (saved) config = normalizeConfig(saved);
  } catch {
    config = structuredClone(DEFAULT_CONFIG);
  }
}

function saveEditorState() {
  if (isRestoringState) return;
  localStorage.setItem(AIRDROP_CONFIG_STORAGE_KEY, JSON.stringify(sanitizeAirdropConfig(config)));
  localStorage.setItem(AIRDROP_PREVIEW_COLLAPSED_STORAGE_KEY, document.body.classList.contains("preview-collapsed") ? "1" : "0");
}

function restorePreviewState() {
  const collapsed = localStorage.getItem(AIRDROP_PREVIEW_COLLAPSED_STORAGE_KEY) === "1";
  document.body.classList.toggle("preview-collapsed", collapsed);
  togglePreviewBtn.textContent = collapsed ? i18n("showPreview") : i18n("hidePreview");
}

function resetConfigToDefault() {
  config = structuredClone(DEFAULT_CONFIG);
  selectedSectionId = "general";
  render();
  saveEditorState();
  setStatus(i18n("configCleared"));
}

function setStatus(message) {
  status.textContent = message;
  window.clearTimeout(setStatus.timer);
  setStatus.timer = window.setTimeout(() => {
    status.textContent = i18n("ready");
  }, 2500);
}

function readStoredClassnames() {
  try {
    const value = JSON.parse(localStorage.getItem(CLASSNAME_STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function renderClassnameOptions() {
  classnameOptions = readStoredClassnames();
  classnameOptionsList.innerHTML = "";
  classnameOptions.forEach((classname) => {
    const option = document.createElement("option");
    option.value = classname;
    classnameOptionsList.append(option);
  });
  applyClassnameAutocomplete(editorContent);
}

function renderLocalOptions() {
  renderOptions(dropPresetOptionsList, getDropPresetNames());
  renderOptions(dropLocationOptionsList, getDropLocationNames());
  renderOptions(carPresetOptionsList, [{ value: "", label: i18n("airdropNoCarPreset") }, ...getCarPresetNames()]);
}

function renderOptions(list, values) {
  if (!list) return;
  list.innerHTML = "";
  const seen = new Set();
  values.forEach((entry) => {
    const value = typeof entry === "object" ? entry.value : entry;
    const label = typeof entry === "object" ? entry.label : "";
    if (seen.has(value)) return;
    seen.add(value);
    const option = document.createElement("option");
    option.value = value;
    if (label) option.label = label;
    list.append(option);
  });
}

function getDropPresetNames() {
  return (config.AirdropSettings?.DropPresets || [])
    .map((preset) => preset?.DropID)
    .filter(Boolean);
}

function getDropLocationNames() {
  return (config.AirdropSettings?.DropLocations || [])
    .map((location) => location?.Name)
    .filter(Boolean);
}

function getCarPresetNames() {
  return (config.AirdropSettings?.CarPresets || [])
    .map((preset) => preset?.Name)
    .filter(Boolean);
}

function applyClassnameAutocomplete(root = document) {
  root.querySelectorAll("[data-classname-field]").forEach((element) => {
    if (element.hasAttribute("list")) return;
    element.setAttribute("list", "classnameOptions");
    element.setAttribute("autocomplete", "off");
  });
}

function applyTooltips(root = document) {
  root.querySelectorAll("[data-tooltip-key]").forEach((element) => {
    if (!getTooltipText(window.AIRDROP_TOOLTIPS?.[element.dataset.tooltipKey]) || element.dataset.tooltipBound === "true") return;
    element.dataset.tooltipBound = "true";
    element.addEventListener("mouseenter", (event) => showTooltip(element, getTooltipText(window.AIRDROP_TOOLTIPS?.[element.dataset.tooltipKey]), event));
    element.addEventListener("mousemove", (event) => moveTooltip(event));
    element.addEventListener("mouseleave", hideTooltip);
    element.addEventListener("focus", (event) => showTooltip(element, getTooltipText(window.AIRDROP_TOOLTIPS?.[element.dataset.tooltipKey]), event));
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
  if (event instanceof MouseEvent) moveTooltip(event);
  else placeTooltipUnderElement(element);
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
  document.querySelectorAll(".tooltip-active").forEach((element) => element.classList.remove("tooltip-active"));
}

function parsePath(value) {
  return JSON.parse(value);
}

function getCardKey(path) {
  return JSON.stringify(path);
}

function readCollapsedCards() {
  try {
    const value = JSON.parse(localStorage.getItem(AIRDROP_COLLAPSED_CARDS_STORAGE_KEY) || "[]");
    return new Set(Array.isArray(value) ? value : []);
  } catch {
    return new Set();
  }
}

function writeCollapsedCards() {
  localStorage.setItem(AIRDROP_COLLAPSED_CARDS_STORAGE_KEY, JSON.stringify([...collapsedCards]));
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

editorContent.addEventListener("input", (event) => {
  if (event.target.dataset.quantityPath) {
    const path = parsePath(event.target.dataset.quantityPath);
    const pair = parseQuantityMinMax(getValue(path));
    pair[Number(event.target.dataset.quantityIndex)] = Number(event.target.value);
    setValue(path, formatQuantityMinMax(pair));
    renderPreview();
    return;
  }

  if (event.target.dataset.healthPath) {
    const path = parsePath(event.target.dataset.healthPath);
    const pair = parseHealthMinMax(getValue(path));
    pair[Number(event.target.dataset.healthIndex)] = clampHealth(event.target.value);
    setValue(path, `${pair[0]}|${pair[1]}`);
    renderPreview();
    return;
  }

  if (event.target.dataset.positionPath) {
    const numbers = parsePositionVector(event.target.value);
    if (numbers.length) {
      setValue(parsePath(event.target.dataset.positionPath), numbers);
      renderPreview();
    }
    return;
  }

  const pathValue = event.target.dataset.path;
  if (!pathValue || event.target.hasAttribute("data-tool-key") || event.target.hasAttribute("data-tool-time")) return;
  const path = parsePath(pathValue);
  let value = event.target.value;
  if (event.target.type === "number") value = Number(value);
  if (event.target.type === "checkbox") value = event.target.checked;
  const oldValue = getPreviousInputValue(event.target, path);
  setValue(path, value);
  propagateLinkedNameChange(path, oldValue, value);
  setPreviousInputValue(event.target, value);
  updateNearestCardTitle(event.target, path);
  renderLocalOptions();
  renderSections();
  renderPreview();
});

editorContent.addEventListener("change", (event) => {
  if (event.target.dataset.quantityPath) {
    const path = parsePath(event.target.dataset.quantityPath);
    const pair = parseQuantityMinMax(getValue(path));
    pair[Number(event.target.dataset.quantityIndex)] = Number(event.target.value);
    setValue(path, formatQuantityMinMax(pair));
    renderPreview();
    return;
  }

  if (event.target.dataset.healthPath) {
    const path = parsePath(event.target.dataset.healthPath);
    const pair = parseHealthMinMax(getValue(path));
    pair[Number(event.target.dataset.healthIndex)] = clampHealth(event.target.value);
    setValue(path, `${pair[0]}|${pair[1]}`);
    renderPreview();
    return;
  }

  if (event.target.dataset.positionPath) {
    const numbers = parsePositionVector(event.target.value);
    setValue(parsePath(event.target.dataset.positionPath), numbers);
    event.target.value = formatPositionVector(numbers);
    renderSections();
    renderPreview();
    return;
  }

  if (event.target.hasAttribute("data-tool-key")) {
    const path = parsePath(event.target.dataset.path);
    const tools = getValue(path);
    const oldKey = event.target.dataset.toolKey;
    const newKey = event.target.value.trim();
    if (!newKey && oldKey !== "") return;
    if (newKey === oldKey) return;
    const value = tools[oldKey];
    delete tools[oldKey];
    tools[newKey] = value;
    renderLocalOptions();
    render();
  }

  if (event.target.hasAttribute("data-tool-time")) {
    const path = parsePath(event.target.dataset.path);
    const tools = getValue(path);
    tools[event.target.dataset.toolTime] = Number(event.target.value);
    renderPreview();
  }

  if (event.target.dataset.path && !event.target.hasAttribute("data-tool-key") && !event.target.hasAttribute("data-tool-time")) {
    const path = parsePath(event.target.dataset.path);
    let value = event.target.value;
    if (event.target.type === "number") value = Number(value);
    if (event.target.type === "checkbox") value = event.target.checked;
    const oldValue = getPreviousInputValue(event.target, path);
    setValue(path, value);
    propagateLinkedNameChange(path, oldValue, value);
    setPreviousInputValue(event.target, value);
    updateNearestCardTitle(event.target, path);
    renderLocalOptions();
    renderSections();
    renderPreview();
  }
});

function updateNearestCardTitle(element, path) {
  const key = path[path.length - 1];
  if (!["Name", "DropID", "Classname", "Point"].includes(key)) return;
  const card = element.closest(".item-card");
  const title = card?.querySelector(".item-head h3");
  if (!title) return;
  const parent = getValue(path.slice(0, -1));
  const index = path[path.length - 2];
  title.textContent = getItemTitle(parent, Number.isInteger(index) ? index : 0);
}

function getPreviousInputValue(element, path) {
  if (element.hasAttribute("data-previous-value")) return element.dataset.previousValue;
  return getValue(path);
}

function setPreviousInputValue(element, value) {
  if (element.hasAttribute("data-previous-value")) {
    element.dataset.previousValue = String(value);
  }
}

function propagateLinkedNameChange(path, oldValue, newValue) {
  if (!oldValue || !newValue || oldValue === newValue) return;
  const key = path[path.length - 1];
  const parentArray = path[path.length - 3];

  if (key === "Name" && parentArray === "DropLocations") {
    (config.AirdropSettings?.DropVars || []).forEach((dropVar) => {
      if (!Array.isArray(dropVar.DropLocations)) return;
      dropVar.DropLocations = dropVar.DropLocations.map((name) => name === oldValue ? newValue : name);
    });
  }

  if (key === "Name" && parentArray === "CarPresets") {
    (config.AirdropSettings?.DropPresets || []).forEach((dropPreset) => {
      if (dropPreset.CarPreset === oldValue) {
        dropPreset.CarPreset = newValue;
      }
    });
  }
}

editorContent.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  if (button.dataset.action === "toggleCard") {
    const key = button.dataset.cardKey;
    if (collapsedCards.has(key)) collapsedCards.delete(key);
    else collapsedCards.add(key);
    writeCollapsedCards();
    render();
    return;
  }

  const path = parsePath(button.dataset.path);
  if (button.dataset.action === "add") {
    getValue(path).push(getDefaultArrayItem(path));
    render();
  }
  if (button.dataset.action === "delete") {
    deleteValue(path);
    render();
  }
  if (button.dataset.action === "addTool") {
    addToolEntry(getValue(path));
    render();
  }
  if (button.dataset.action === "deleteTool") {
    delete getValue(path)[button.dataset.toolKey];
    render();
  }
});

fileInput.addEventListener("change", async () => {
  const file = fileInput.files[0];
  if (!file) return;
  try {
    config = normalizeConfig(JSON.parse(stripJsonComments(await file.text())));
    selectedSectionId = "general";
    render();
    setStatus(i18n("loadedFile", { name: file.name }));
  } catch (error) {
    setStatus(error.message);
  } finally {
    fileInput.value = "";
  }
});

downloadBtn.addEventListener("click", () => {
  const blob = new Blob([stringifyConfig(sanitizeAirdropConfig(config))], { type: "application/json" });
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
  if (!window.confirm(i18n("resetConfirm"))) return;
  resetConfigToDefault();
});

window.addEventListener("gelik-classnames-updated", renderClassnameOptions);
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
