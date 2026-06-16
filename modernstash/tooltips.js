window.MODERN_STASH_TOOLTIPS = {
  duplicateGroup: "Создает копию текущей stash-группы со всеми classnames, настройками открытия и списком предметов.",
  deleteGroup: "Удаляет текущую stash-группу из конфига.",

  itemsMin: "G_StashItemsMinMax[0]: минимальное количество предметов, которое может появиться в стеше.",
  itemsMax: "G_StashItemsMinMax[1]: максимальное количество предметов, которое может появиться в стеше.",

  openActionType: "G_OpenActionType: 0 - не открывается экшенами; 1 - быстрый экшен без удержания; 2 - открытие удержанием ЛКМ.",
  spawnType: "G_StashSpawnType: 1 - маппинговый стеш; 0 - обычный спавн. Для маппингового стеша при удалении он спавнится заново.",
  spawnChance: "G_StashSpawnChance: шанс оставить/заспавнить стеш. Работает для маппингового спавна, когда G_StashSpawnType = 1.",
  openable: "G_StashOpenable: 0 - всегда открыт; 1 - нужно открыть, лут спавнится при загрузке сервера; 2 - нужно открыть, лут спавнится при открытии.",
  removeOnOpen: "G_StashRemoveOnOpen: -1 - не удаляется; 0 - удаляется сразу после открытия; значение выше 0 - через сколько минут удалить открытый ящик.",

  stashClassname: "G_StashClassname: classname стеша, к которому применяются настройки этой группы.",

  openableTool: "G_OpenableWith: classname предмета, которым можно открыть стеш. Для открытия руками оставьте Hands.",
  openableTime: "G_OpenableWith: время открытия. Формат в JSON: \"Время открытия|Урон предмету\".",
  openableDamage: "G_OpenableWith: урон предмету в процентах. Если для Hands указать урон больше 0, этот процент урона будет нанесен игроку.",

  itemClassname: "G_ClassName: classname предмета, который может появиться в стеше.",
  itemChance: "G_Chance: шанс спавна этого предмета.",
  itemMagazine: "G_Magazine: магазин для оружия или пуля для оружия с внутренним магазином. Не добавляйте магазин в G_Attachments.",
  itemAmmoMin: "G_MagazineAmmoCountMinMax[0]: минимальное количество патронов в магазине при спавне.",
  itemAmmoMax: "G_MagazineAmmoCountMinMax[1]: максимальное количество патронов в магазине при спавне.",
  itemHealthMin: "G_GlobalHealthMinMax[0]: минимальное состояние. -1 не задавать, 0 нетронутое, 1 поношенное, 2 поврежденное, 3 сильное поврежденное, 4 уничтоженное.",
  itemHealthMax: "G_GlobalHealthMinMax[1]: максимальное состояние. -1 не задавать, 0 нетронутое, 1 поношенное, 2 поврежденное, 3 сильное поврежденное, 4 уничтоженное.",
  itemQuantityMin: "G_QuantityMinMax[0]: минимальное quantity значение предмета при спавне.",
  itemQuantityMax: "G_QuantityMinMax[1]: максимальное quantity значение предмета при спавне.",
  itemAttachment: "G_Attachments: список аттачментов, которые спавнятся в слоты предмета, не в инвентарь. Магазин оружия указывайте в G_Magazine."
};
