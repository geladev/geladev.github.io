window.MODERN_STASH_TOOLTIPS = {
  duplicateGroup: {
    ru: "Создает копию текущей stash-группы со всеми classnames, настройками открытия и списком предметов.",
    en: "Creates a copy of the current stash group with all classnames, opening settings, and loot items."
  },
  deleteGroup: {
    ru: "Удаляет текущую stash-группу из конфига.",
    en: "Deletes the current stash group from the config."
  },
  itemsMin: {
    ru: "G_StashItemsMinMax[0]: минимальное количество предметов, которое может появиться в стеше.",
    en: "G_StashItemsMinMax[0]: minimum number of items that can spawn in the stash."
  },
  itemsMax: {
    ru: "G_StashItemsMinMax[1]: максимальное количество предметов, которое может появиться в стеше.",
    en: "G_StashItemsMinMax[1]: maximum number of items that can spawn in the stash."
  },
  openActionType: {
    ru: "G_OpenActionType: 0 - не открывается экшенами; 1 - быстрый экшен без удержания; 2 - открытие удержанием ЛКМ.",
    en: "G_OpenActionType: 0 - cannot be opened by actions; 1 - quick action without holding; 2 - hold LMB to open."
  },
  spawnType: {
    ru: "G_StashSpawnType: 1 - маппинговый стеш; 0 - обычный спавн. Для маппингового стеша при удалении он спавнится заново.",
    en: "G_StashSpawnType: 1 - mapped stash; 0 - regular spawn. A mapped stash respawns after removal."
  },
  spawnChance: {
    ru: "G_StashSpawnChance: шанс оставить/заспавнить стеш. Работает для маппингового спавна, когда G_StashSpawnType = 1.",
    en: "G_StashSpawnChance: chance to keep/spawn the stash. Works for mapped spawns when G_StashSpawnType = 1."
  },
  openable: {
    ru: "G_StashOpenable: 0 - всегда открыт; 1 - нужно открыть, лут спавнится при загрузке сервера; 2 - нужно открыть, лут спавнится при открытии.",
    en: "G_StashOpenable: 0 - always open; 1 - must be opened, loot spawns on server load; 2 - must be opened, loot spawns on opening."
  },
  removeOnOpen: {
    ru: "G_StashRemoveOnOpen: -1 - не удаляется; 0 - удаляется сразу после открытия; значение выше 0 - через сколько минут удалить открытый ящик.",
    en: "G_StashRemoveOnOpen: -1 - never removed; 0 - removed immediately after opening; values above 0 define minutes before removing an opened crate."
  },
  stashClassname: {
    ru: "G_StashClassname: classname стеша, к которому применяются настройки этой группы.",
    en: "G_StashClassname: stash classname that uses this group's settings."
  },
  openableTool: {
    ru: "G_OpenableWith: classname предмета, которым можно открыть стеш. Для открытия руками оставьте Hands.",
    en: "G_OpenableWith: classname of the item that can open the stash. Keep Hands for opening by hand."
  },
  openableTime: {
    ru: "G_OpenableWith: время открытия. Формат в JSON: \"Время открытия|Урон предмету\".",
    en: "G_OpenableWith: opening time. JSON format: \"Opening time|Item damage\"."
  },
  openableDamage: {
    ru: "G_OpenableWith: урон предмету в процентах. Если для Hands указать урон больше 0, этот процент урона будет нанесен игроку.",
    en: "G_OpenableWith: item damage in percent. If Hands has damage above 0, that damage percent will be applied to the player."
  },
  itemClassname: {
    ru: "G_ClassName: classname предмета, который может появиться в стеше.",
    en: "G_ClassName: classname of the item that can spawn in the stash."
  },
  itemChance: {
    ru: "G_Chance: шанс спавна этого предмета.",
    en: "G_Chance: spawn chance for this item."
  },
  itemMagazine: {
    ru: "G_Magazine: магазин для оружия или пуля для оружия с внутренним магазином. Не добавляйте магазин в G_Attachments.",
    en: "G_Magazine: weapon magazine or ammo for a weapon with an internal magazine. Do not add magazines to G_Attachments."
  },
  itemAmmoMin: {
    ru: "G_MagazineAmmoCountMinMax[0]: минимальное количество патронов в магазине при спавне.",
    en: "G_MagazineAmmoCountMinMax[0]: minimum ammo count in the magazine on spawn."
  },
  itemAmmoMax: {
    ru: "G_MagazineAmmoCountMinMax[1]: максимальное количество патронов в магазине при спавне.",
    en: "G_MagazineAmmoCountMinMax[1]: maximum ammo count in the magazine on spawn."
  },
  itemHealthMin: {
    ru: "G_GlobalHealthMinMax[0]: минимальное состояние. -1 не задавать, 0 нетронутое, 1 поношенное, 2 поврежденное, 3 сильное поврежденное, 4 уничтоженное.",
    en: "G_GlobalHealthMinMax[0]: minimum health state. -1 do not set, 0 pristine, 1 worn, 2 damaged, 3 badly damaged, 4 ruined."
  },
  itemHealthMax: {
    ru: "G_GlobalHealthMinMax[1]: максимальное состояние. -1 не задавать, 0 нетронутое, 1 поношенное, 2 поврежденное, 3 сильное поврежденное, 4 уничтоженное.",
    en: "G_GlobalHealthMinMax[1]: maximum health state. -1 do not set, 0 pristine, 1 worn, 2 damaged, 3 badly damaged, 4 ruined."
  },
  itemQuantityMin: {
    ru: "G_QuantityMinMax[0]: минимальное quantity значение предмета при спавне.",
    en: "G_QuantityMinMax[0]: minimum item quantity value on spawn."
  },
  itemQuantityMax: {
    ru: "G_QuantityMinMax[1]: максимальное quantity значение предмета при спавне.",
    en: "G_QuantityMinMax[1]: maximum item quantity value on spawn."
  },
  itemAttachment: {
    ru: "G_Attachments: список аттачментов, которые спавнятся в слоты предмета, не в инвентарь. Магазин оружия указывайте в G_Magazine.",
    en: "G_Attachments: attachments that spawn into item slots, not inventory. Put weapon magazines into G_Magazine."
  }
};
