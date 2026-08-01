window.AIRDROP_TOOLTIPS = {
  Enabled: {
    ru: "Включен ли мод.",
    en: "Whether the mod is enabled."
  },
  DiscordWebhookURL: {
    ru: "Discord webhook для отправки уведомлений.",
    en: "Discord webhook URL used for notifications."
  },
  MinPlayersToStart: {
    ru: "Минимальное количество игроков для запуска события.",
    en: "Minimum player count required to start the event."
  },
  MaxDropsPerRestart: {
    ru: "Максимальное количество дропов за один рестарт.",
    en: "Maximum number of drops per restart."
  },
  TimeBetweenDrops: {
    ru: "Время перед запуском первого дропа и между следующими дропами, в минутах.",
    en: "Delay before the first drop and between following drops, in minutes."
  },
  CloseEventsTime: {
    ru: "Время, через которое мод самостоятельно завершает работу. Обычно ставится за 5-15 минут до рестарта, в минутах.",
    en: "Time after which the mod stops events by itself. Usually set 5-15 minutes before restart, in minutes."
  },
  DropID: {
    ru: "ID/название пресета дропа. В DropVars должен совпадать с DropPresets.",
    en: "Drop preset ID/name. In DropVars it should match a DropPresets entry."
  },
  Chance: {
    ru: "Шанс выбора/спавна.",
    en: "Selection/spawn chance."
  },
  DropLocations: {
    ru: "Пресеты координат, где может произойти дроп.",
    en: "Location presets where the drop can happen."
  },
  NotifTime: {
    ru: "Время, за сколько минут игроки получают уведомление. Указывайте от большего к меньшему, например 30, 20, 10, 5.",
    en: "How many minutes before the event players receive notifications. Use descending order, for example 30, 20, 10, 5."
  },
  InGameMessageHeader: {
    ru: "Заголовок игрового уведомления.",
    en: "In-game notification header."
  },
  InGameMessageIconPath: {
    ru: "Путь к иконке уведомления.",
    en: "Notification icon path."
  },
  InGameNotifMessage: {
    ru: "Игровое сообщение о том, где и через сколько будет сброшен дроп. Можно использовать %location% и %time%.",
    en: "In-game message that says where and when the drop will arrive. Supports %location% and %time%."
  },
  InGameEventStartMessage: {
    ru: "Игровое сообщение о вылете самолета.",
    en: "In-game message when the plane departs."
  },
  InGameEventAbortMessage: {
    ru: "Игровое сообщение, когда игроков слишком мало и дроп не запускается.",
    en: "In-game message when there are too few players and the drop is aborted."
  },
  InGameDropMessage: {
    ru: "Игровое сообщение, когда контейнер сброшен.",
    en: "In-game message when the container is dropped."
  },
  InGameOpenMessage: {
    ru: "Игровое сообщение, когда контейнер открыт.",
    en: "In-game message when the container is opened."
  },
  DiscordNotifMessage: {
    ru: "Discord сообщение о том, где и через сколько будет сброшен дроп. Можно использовать %location% и %time%.",
    en: "Discord message that says where and when the drop will arrive. Supports %location% and %time%."
  },
  DiscordEventStartMessage: {
    ru: "Discord сообщение о вылете самолета.",
    en: "Discord message when the plane departs."
  },
  DiscordEventAbortMessage: {
    ru: "Discord сообщение, когда игроков слишком мало и дроп не запускается.",
    en: "Discord message when there are too few players and the drop is aborted."
  },
  DiscordDropMessage: {
    ru: "Discord сообщение, когда контейнер сброшен.",
    en: "Discord message when the container is dropped."
  },
  DiscordOpenMessage: {
    ru: "Discord сообщение, когда контейнер открыт.",
    en: "Discord message when the container is opened."
  },
  Title: {
    ru: "Название метки на карте.",
    en: "Map marker title."
  },
  Icon: {
    ru: "Иконка метки на карте.",
    en: "Map marker icon."
  },
  Name: {
    ru: "Название пресета.",
    en: "Preset name."
  },
  Positions: {
    ru: "Координаты. Можно добавить несколько точек.",
    en: "Coordinates. Multiple positions can be added."
  },
  ZombieCount: {
    ru: "Количество зомби в зоне падения.",
    en: "Zombie count in the drop area."
  },
  ZombieList: {
    ru: "Класснеймы зомби.",
    en: "Zombie classnames."
  },
  ContaminatedArea: {
    ru: "Запускать ли токсичную зону в области падения дропа.",
    en: "Whether to start a contaminated area around the drop."
  },
  AirType: {
    ru: "Класснейм самолета.",
    en: "Aircraft classname."
  },
  AirSpeed: {
    ru: "Скорость полета самолета.",
    en: "Aircraft flight speed."
  },
  AirHeight: {
    ru: "Высота полета самолета.",
    en: "Aircraft flight altitude."
  },
  DropSpeed: {
    ru: "Скорость падения контейнера.",
    en: "Container fall speed."
  },
  Locked: {
    ru: "Закрыт ли дроп.",
    en: "Whether the drop is locked."
  },
  Tools: {
    ru: "Инструменты открытия дропа. Слева classname инструмента, справа время открытия в секундах. Default - время открытия чем угодно.",
    en: "Drop opening tools. Left side is the tool classname, right side is opening time in seconds. Default - opening time with anything."
  },
  TimeToRemove: {
    ru: "Через сколько секунд удалить дроп после спавна.",
    en: "Seconds before removing the drop after spawn."
  },
  TimeToBoomOnOpen: {
    ru: "Через сколько секунд произойдет взрыв после открытия.",
    en: "Seconds before explosion after opening."
  },
  DropContainer: {
    ru: "Класснейм контейнера.",
    en: "Container classname."
  },
  CarPreset: {
    ru: "Название пресета машины, если нужен кардроп.",
    en: "Car preset name if this drop should spawn a vehicle."
  },
  Attachments: {
    ru: "Аттачменты.",
    en: "Attachments."
  },
  Cargo: {
    ru: "Предметы в cargo.",
    en: "Cargo items."
  },
  DirectSpawn: {
    ru: "Спавн предметов внутри контейнера.",
    en: "Items spawned directly inside the container."
  },
  Point: {
    ru: "Название точки. Обычно всегда spawn_cen.",
    en: "Spawn point name. Usually spawn_cen."
  },
  Classname: {
    ru: "Класснейм предмета или машины.",
    en: "Item or vehicle classname."
  },
  Orientation: {
    ru: "Ориентация предмета.",
    en: "Item orientation."
  },
  Offset: {
    ru: "Расположение относительно центра контейнера.",
    en: "Position relative to the container center."
  },
  QuantityMinMax: {
    ru: "Quantity мин-макс. -1 если выключено.",
    en: "Quantity min-max. Use -1 when disabled."
  },
  HealthMinMax: {
    ru: "HP мин-макс через |. 0 нетронутое, 4 уничтоженное.",
    en: "Health min-max separated by |. 0 pristine, 4 ruined."
  },
  Fuel: {
    ru: "Количество топлива в машине.",
    en: "Vehicle fuel amount."
  },
  Water: {
    ru: "Количество воды в радиаторе.",
    en: "Radiator water amount."
  }
};

Object.assign(window.AIRDROP_TOOLTIPS, {
  InGameEnabled: {
    ru: "Включить или выключить уведомления в игре.",
    en: "Enable or disable in-game notifications."
  },
  DiscordEnabled: {
    ru: "Включить или выключить уведомления через Discord webhook.",
    en: "Enable or disable Discord webhook notifications."
  },
  ToolsTimeDamage: {
    ru: "Инструменты открытия дропа. Слева classname инструмента, рядом время открытия в секундах, справа урон инструменту. Default - время открытия чем угодно.",
    en: "Drop opening tools. Left is the tool classname, then opening time in seconds, then tool damage. Default - opening time with anything."
  },
  ToolsTimeDamageDamage: {
    ru: "Урон инструменту при открытии.",
    en: "Tool damage dealt on opening."
  },
  AttachmentsMinMax: {
    ru: "Мин-макс количество предметов, которое может выпасть из списка Attachments.",
    en: "Min-max amount of items that can spawn from the Attachments list."
  },
  CargoMinMax: {
    ru: "Мин-макс количество предметов, которое может выпасть в Cargo.",
    en: "Min-max amount of items that can spawn into Cargo."
  },
  SpawnOnce: {
    ru: "Если включено, предмет не должен спавниться более одного раза.",
    en: "If enabled, this item should not spawn more than once."
  }
});

Object.assign(window.AIRDROP_TOOLTIPS, {
  ToolsTimeDamageClassname: {
    ru: "Класснейм инструмента для открытия. Default - открытие чем угодно. Hands - открытие руками.",
    en: "Tool classname used for opening. Default - opening with anything. Hands - opening by hand."
  },
  ToolsTimeDamageTime: {
    ru: "Время открытия данным инструментом (секунды).",
    en: "Opening time with this tool, in seconds."
  },
  ToolsTimeDamageDamage: {
    ru: "Урон инструменту после открытия.",
    en: "Tool damage after opening."
  }
});

Object.assign(window.AIRDROP_TOOLTIPS, {
  ActionBrokenToolMessage: {
    ru: "Уведомление когда у инструмента для открытия недостаточно ХП.",
    en: "Notification shown when the opening tool does not have enough HP."
  }
});

Object.assign(window.AIRDROP_TOOLTIPS, {
  AttachmentsMinMaxMin: {
    ru: "Минимальное количество аттачментов которые должно заспавнить.",
    en: "Minimum number of attachments that should spawn."
  },
  AttachmentsMinMaxMax: {
    ru: "Максимальное количество аттачментов которые должно заспавнить.",
    en: "Maximum number of attachments that should spawn."
  },
  CargoMinMaxMin: {
    ru: "Минимальное количество предметов в карго которые должно заспавнить.",
    en: "Minimum number of cargo items that should spawn."
  },
  CargoMinMaxMax: {
    ru: "Максимальное количество предметов в карго которые должно заспавнить.",
    en: "Maximum number of cargo items that should spawn."
  },
  QuantityMinMaxMin: {
    ru: "Минимальное значение количества предмета.",
    en: "Minimum item quantity value."
  },
  QuantityMinMaxMax: {
    ru: "Максимальное значение количества предмета.",
    en: "Maximum item quantity value."
  }
});

Object.assign(window.AIRDROP_TOOLTIPS, {
  AttachmentsMinMaxMin: {
    ru: "Минимальное количество аттачментов которые должно заспавнить. 0|0 - не спавнит ничего, -1 - произойдет один просчет списка предметов.",
    en: "Minimum number of attachments that should spawn. 0|0 spawns nothing; -1 performs one roll of the item list."
  },
  AttachmentsMinMaxMax: {
    ru: "Максимальное количество аттачментов которые должно заспавнить. 0|0 - не спавнит ничего, -1 - произойдет один просчет списка предметов.",
    en: "Maximum number of attachments that should spawn. 0|0 spawns nothing; -1 performs one roll of the item list."
  },
  CargoMinMaxMin: {
    ru: "Минимальное количество предметов в карго которые должно заспавнить. 0|0 - не спавнит ничего, -1 - произойдет один просчет списка предметов.",
    en: "Minimum number of cargo items that should spawn. 0|0 spawns nothing; -1 performs one roll of the item list."
  },
  CargoMinMaxMax: {
    ru: "Максимальное количество предметов в карго которые должно заспавнить. 0|0 - не спавнит ничего, -1 - произойдет один просчет списка предметов.",
    en: "Maximum number of cargo items that should spawn. 0|0 spawns nothing; -1 performs one roll of the item list."
  }
});
