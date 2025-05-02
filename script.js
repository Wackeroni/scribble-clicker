// Game state
let gameState = {
  coins: 0,
  crystals: 0,
  cores: 0,
  coinsPerClick: 1,
  coinsPerSecond: 0,
  lastSave: Date.now(),
  lastTick: Date.now(),
  upgrades: {},
  jobs: {},
  minigames: {},
  crafting: {},
  farming: {
    currentPlant: null,
    plantCycles: 0,
    plantMaxCycles: 0,
    nextWaterTime: 0,
    frozen: false,
    fertilizer: 0,
  },
  fishing: {
    bait: 0,
    fishCaught: 0,
    fishTypes: {},
  },
  stats: {
    totalClicks: 0,
    totalCoinsEarned: 0,
    totalTimeSpent: 0,
    totalCrystalsEarned: 0,
    totalCoresEarned: 0,
  },
  unlocks: {
    upgrades: false,
    jobs: false,
    minigames: false,
    crafting: false,
    farming: false,
    fishing: false,
    crystals: false,
    cores: false,
  },
  cooldowns: {
    wordle: 0,
    professor: 0,
    merchant: 0,
  },
  coinMultiplier: 1,
}

// Upgrades data
const upgradesData = [
  {
    id: "button_upgrade_1",
    name: "Button Upgrade I",
    description: "Doubles the UCoins per click",
    baseCost: 15,
    costMultiplier: 2,
    maxLevel: 5,
    effect: (level) => ({ coinsPerClick: Math.floor(gameState.coinsPerClick * 1.5) }),
    unlockAt: 10,
    tier: 1,
  },
  {
    id: "auto_clicker_1",
    name: "Auto Clicker I",
    description: "Automatically generates 0.5 UCoins per second",
    baseCost: 50,
    costMultiplier: 1.8,
    maxLevel: 10,
    effect: (level) => ({ coinsPerSecond: gameState.coinsPerSecond + 0.5 }),
    unlockAt: 30,
    tier: 1,
  },
  {
    id: "button_upgrade_2",
    name: "Button Upgrade II",
    description: "Increases UCoins per click by 5",
    baseCost: 200,
    costMultiplier: 2.2,
    maxLevel: 5,
    effect: (level) => ({ coinsPerClick: gameState.coinsPerClick + 5 }),
    unlockAt: 150,
    tier: 2,
  },
  {
    id: "auto_clicker_2",
    name: "Auto Clicker II",
    description: "Automatically generates 2 UCoins per second",
    baseCost: 500,
    costMultiplier: 2,
    maxLevel: 5,
    effect: (level) => ({ coinsPerSecond: gameState.coinsPerSecond + 2 }),
    unlockAt: 300,
    tier: 2,
  },
  {
    id: "button_upgrade_3",
    name: "Button Upgrade III",
    description: "Increases UCoins per click by 20",
    baseCost: 2000,
    costMultiplier: 2.5,
    maxLevel: 5,
    effect: (level) => ({ coinsPerClick: gameState.coinsPerClick + 20 }),
    unlockAt: 1500,
    tier: 3,
  },
  {
    id: "auto_clicker_3",
    name: "Auto Clicker III",
    description: "Automatically generates 10 UCoins per second",
    baseCost: 5000,
    costMultiplier: 2.2,
    maxLevel: 5,
    effect: (level) => ({ coinsPerSecond: gameState.coinsPerSecond + 10 }),
    unlockAt: 3000,
    tier: 3,
  },
  {
    id: "button_upgrade_4",
    name: "Button Upgrade IV",
    description: "Increases UCoins per click by 100",
    baseCost: 20000,
    costMultiplier: 3,
    maxLevel: 3,
    effect: (level) => ({ coinsPerClick: gameState.coinsPerClick + 100 }),
    unlockAt: 15000,
    tier: 4,
  },
  {
    id: "auto_clicker_4",
    name: "Auto Clicker IV",
    description: "Automatically generates 50 UCoins per second",
    baseCost: 50000,
    costMultiplier: 2.5,
    maxLevel: 3,
    effect: (level) => ({ coinsPerSecond: gameState.coinsPerSecond + 50 }),
    unlockAt: 30000,
    tier: 4,
  },
  {
    id: "button_upgrade_5",
    name: "Button Upgrade V",
    description: "Increases UCoins per click by 500",
    baseCost: 200000,
    costMultiplier: 3.5,
    maxLevel: 3,
    effect: (level) => ({ coinsPerClick: gameState.coinsPerClick + 500 }),
    unlockAt: 150000,
    tier: 5,
  },
  {
    id: "auto_clicker_5",
    name: "Auto Clicker V",
    description: "Automatically generates 250 UCoins per second",
    baseCost: 500000,
    costMultiplier: 3,
    maxLevel: 3,
    effect: (level) => ({ coinsPerSecond: gameState.coinsPerSecond + 250 }),
    unlockAt: 300000,
    tier: 5,
  },
]

// Rework the job system
// Replace the jobsData array with the new job system
const jobsData = [
  {
    id: "citizen",
    name: "Citizen",
    description: "Work every 40 seconds to earn 1,000 UCoins.",
    baseCost: 100,
    costMultiplier: 2,
    maxLevel: 1,
    effect: () => ({ citizenUnlocked: true }),
    cooldown: 40 * 1000, // 40 seconds
    reward: 1000,
    unlockAt: 500,
    tier: 1,
  },
  {
    id: "researcher",
    name: "Researcher",
    description: "Research every 90 seconds to earn 3,000 UCoins.",
    baseCost: 1000,
    costMultiplier: 2.2,
    maxLevel: 1,
    effect: () => ({ researcherUnlocked: true }),
    cooldown: 90 * 1000, // 90 seconds
    reward: 3000,
    unlockAt: 2000,
    tier: 1,
  },
  {
    id: "gambler",
    name: "Gambler",
    description: "Unlock the slot machine to gamble your UCoins.",
    baseCost: 10000,
    costMultiplier: 2.5,
    maxLevel: 1,
    effect: () => ({ gamblerUnlocked: true }),
    unlockAt: 8000,
    tier: 2,
  },
  {
    id: "professor",
    name: "Professor",
    description: "Solve math problems to earn UCoins.",
    baseCost: 25000,
    costMultiplier: 2.8,
    maxLevel: 1,
    effect: () => ({ professorUnlocked: true }),
    unlockAt: 20000,
    tier: 3,
  },
  {
    id: "farmer",
    name: "Farmer",
    description: "Grow plants to earn UCoins and other resources.",
    baseCost: 50000,
    costMultiplier: 3,
    maxLevel: 1,
    effect: () => ({ farmerUnlocked: true }),
    unlockAt: 40000,
    tier: 3,
  },
  {
    id: "merchant",
    name: "Merchant",
    description: "Sell items for UCoins based on their properties.",
    baseCost: 100000,
    costMultiplier: 3.2,
    maxLevel: 1,
    effect: () => ({ merchantUnlocked: true }),
    unlockAt: 80000,
    tier: 4,
  },
]

// Add job cooldowns to the game state
if (!gameState.jobCooldowns) {
  gameState.jobCooldowns = {
    citizen: 0,
    researcher: 0
  };
}

// Minigames data
const minigamesData = [
  {
    id: "gambler_minigame",
    name: "Gambler Minigame",
    description: "Bet your UCoins for a chance to win more!",
    baseCost: 10000,
    unlockAt: 8000,
    requires: { job: "gambler", level: 1 },
  },
  {
    id: "wordle_minigame",
    name: "Wordle Minigame",
    description: "Guess the 5-letter word in 6 tries to earn UCoins!",
    baseCost: 25000,
    unlockAt: 20000,
    cooldown: 5 * 60 * 1000, // 5 minutes
  },
  {
    id: "professor_minigame",
    name: "Professor Minigame",
    description: "Solve math problems to earn UCoins!",
    baseCost: 30000,
    unlockAt: 25000,
    requires: { job: "professor", level: 1 },
    cooldown: 35 * 60 * 1000, // 35 minutes
  },
  {
    id: "merchant_minigame",
    name: "Merchant Minigame",
    description: "Choose items to sell for UCoins!",
    baseCost: 100000,
    unlockAt: 80000,
    requires: { job: "merchant", level: 1 },
    cooldown: 2 * 60 * 60 * 1000, // 2 hours
  },
]

// Crafting data
const craftingData = [
  {
    id: "fishing_rod",
    name: "Fishing Rod",
    description: "Allows you to fish for resources and UCoins.",
    ingredients: [{ type: "coins", amount: 5000 }],
    effect: () => ({ fishingUnlocked: true }),
    unlockAt: 5000,
  },
  {
    id: "coin_bait",
    name: "Coin Bait",
    description: "Basic bait for fishing. Allows you to catch common fish.",
    ingredients: [{ type: "coins", amount: 100 }],
    effect: () => {
      gameState.fishing.bait += 1
      return {}
    },
    unlockAt: 5000,
    requires: { crafting: "fishing_rod" },
  },
  {
    id: "cool_coin",
    name: "Cool Coin",
    description: "Permanently increases UCoins gain by 10% from all sources.",
    ingredients: [{ type: "coins", amount: 20000 }],
    effect: () => ({ coinMultiplier: 1.1 }),
    unlockAt: 15000,
    maxLevel: 5,
  },
  {
    id: "cool_xp",
    name: "Cool XP",
    description: "Permanently increases XP gain by 10% from all sources.",
    ingredients: [{ type: "coins", amount: 30000 }],
    effect: () => ({ xpMultiplier: 1.1 }),
    unlockAt: 25000,
    maxLevel: 5,
  },
]

// Plants data
const plantsData = [
  {
    id: "dyracore",
    name: "Dyracore",
    description: "Tanky, generalist plant. Bores you to death.",
    maxCycles: 20,
    cooldown: 2 * 60 * 60 * 1000, // 2 hours
    rewards: {
      coins: (cycles) => 100 + cycles * 10,
      xp: (cycles) => 5 + cycles * 0.5,
    },
  },
  {
    id: "kiwee",
    name: "Kiwee",
    description: "Gives extra Fertilizer. 25% chance for one Fertilizer per water.",
    maxCycles: 15,
    cooldown: 2.5 * 60 * 60 * 1000, // 2.5 hours
    rewards: {
      coins: (cycles) => 80 + cycles * 8,
      xp: (cycles) => 4 + cycles * 0.4,
      fertilizer: (cycles) => (Math.random() < 0.25 ? 1 : 0),
    },
  },
  {
    id: "lopart",
    name: "Lopart",
    description: "Gives extra XP. You'll plant this the most.",
    maxCycles: 10,
    cooldown: 1 * 60 * 60 * 1000, // 1 hour
    rewards: {
      coins: (cycles) => 50 + cycles * 5,
      xp: (cycles) => 10 + cycles * 1,
    },
  },
  {
    id: "vocarone",
    name: "Vocarone",
    description: "Gives extra UCoins. Does not give Fertilizer at max Cycles.",
    maxCycles: 5,
    cooldown: 1.5 * 60 * 60 * 1000, // 1.5 hours
    rewards: {
      coins: (cycles) => 200 + cycles * 20,
      xp: (cycles) => 3 + cycles * 0.3,
    },
  },
]

// Fish data
const fishData = [
  {
    id: "common_fish",
    name: "Common Fish",
    description: "A very common fish. Not worth much.",
    rarity: "common",
    value: 50,
    xp: 2,
    chance: 0.6,
  },
  {
    id: "uncommon_fish",
    name: "Uncommon Fish",
    description: "A somewhat uncommon fish. Worth a bit more.",
    rarity: "uncommon",
    value: 150,
    xp: 5,
    chance: 0.3,
  },
  {
    id: "rare_fish",
    name: "Rare Fish",
    description: "A rare fish. Worth quite a bit.",
    rarity: "rare",
    value: 500,
    xp: 15,
    chance: 0.09,
  },
  {
    id: "legendary_fish",
    name: "Legendary Fish",
    description: "A legendary fish! Worth a lot!",
    rarity: "legendary",
    value: 2000,
    xp: 50,
    chance: 0.01,
  },
]

// Merchant items data
const merchantItemsData = {
  common: [
    { name: "Flute", baseValue: 50 },
    { name: "Racket", baseValue: 70 },
    { name: "Plastic Ring", baseValue: 30 },
    { name: "Floatie", baseValue: 40 },
    { name: "Dirt", baseValue: 10 },
    { name: "Cooked Fish", baseValue: 75 },
    { name: "Card", baseValue: 25 },
    { name: "Empty Water Bottle", baseValue: 60 },
  ],
  uncommon: [
    { name: "Mirror", baseValue: 100 },
    { name: "Tunic", baseValue: 125 },
    { name: "Baton", baseValue: 130 },
    { name: "Soap", baseValue: 140 },
    { name: "Rug", baseValue: 140 },
    { name: "Battery", baseValue: 150 },
    { name: "Half Filled Water Bottle", baseValue: 100 },
  ],
  rare: [
    { name: "Diamond Necklace", baseValue: 250 },
    { name: "Dagger", baseValue: 200 },
    { name: "Gold Ring", baseValue: 220 },
    { name: "Fishing Rod", baseValue: 175 },
    { name: "Full Water Bottle", baseValue: 200 },
    { name: "Flashlight", baseValue: 160 },
    { name: "Crazed Tank Cat", baseValue: 160 },
  ],
}

// Item properties data
const itemPropertiesData = {
  age: [
    { name: "1-4 Years", value: 150, range: [1, 4] },
    { name: "5-9 Years", value: 75, range: [5, 9] },
    { name: "10-14 Years", value: 25, range: [10, 14] },
    { name: "15-19 Years", value: 25, range: [15, 19] },
    { name: "20 Years", value: 75, range: [20, 20] },
  ],
  fragility: [
    { name: "Indestructible", value: [100, 200] },
    { name: "Sturdy", value: [0, 50] },
    { name: "Fragile", value: [-50, 50] },
    { name: "Quite Fragile", value: [-50, -100] },
    { name: "Very Fragile", value: [-100, -125] },
  ],
  longevity: [
    { name: "1-4 Years", value: -75, range: [1, 4] },
    { name: "5-9 Years", value: -25, range: [5, 9] },
    { name: "10-14 Years", value: 50, range: [10, 14] },
    { name: "15-19 Years", value: 200, range: [15, 19] },
    { name: "20 Years", value: 300, range: [20, 20] },
  ],
  materialQuality: [
    { name: "Perfect", value: [200, 300] },
    { name: "Great", value: [125, 225] },
    { name: "Good", value: [75, 125] },
    { name: "Okay", value: [25, 75] },
    { name: "Could be better", value: [25, 75] },
    { name: "Bad", value: [-75, -100] },
    { name: "Terrible", value: [-100, -150] },
  ],
  use: [
    { name: "Very useful", value: [150, 250] },
    { name: "Good uses", value: [100, 150] },
    { name: "Useable", value: [50, 100] },
    { name: "Rather not use", value: [25, 50] },
    { name: "Would rarely use", value: [25, 75] },
    { name: "Useless", value: [-75, -125] },
  ],
}

// Wordle words list (a small subset for the example)
const wordleWords = [
  "apple",
  "beach",
  "chair",
  "dance",
  "eagle",
  "flame",
  "ghost",
  "house",
  "igloo",
  "juice",
  "knife",
  "lemon",
  "mouse",
  "night",
  "ocean",
  "piano",
  "queen",
  "river",
  "snake",
  "table",
  "uncle",
  "virus",
  "water",
  "xenon",
  "yacht",
  "zebra",
  "bread",
  "cloud",
  "dream",
  "earth",
  "frost",
  "grape",
  "heart",
  "ivory",
  "jelly",
  "kite",
  "light",
  "music",
  "north",
  "olive",
  "peach",
  "quilt",
  "radio",
  "sugar",
  "tiger",
  "umbra",
  "voice",
  "whale",
  "xylophone",
  "youth",
]

// DOM Elements
const coinsElement = document.getElementById("coins")
const cpsElement = document.getElementById("cps")
const cpcElement = document.getElementById("cpc")
const cpsContainer = document.getElementById("cps-container")
const cpcContainer = document.getElementById("cpc-container")
const mainButton = document.getElementById("main-button")
const upgradesContainer = document.getElementById("upgrades-container")
const upgradesList = document.getElementById("upgrades-list")
const jobsContainer = document.getElementById("jobs-container")
const jobsList = document.getElementById("jobs-list")
const minigamesContainer = document.getElementById("minigames-container")
const minigamesList = document.getElementById("minigames-list")
const craftingContainer = document.getElementById("crafting-container")
const craftingList = document.getElementById("crafting-list")
const farmingContainer = document.getElementById("farming-container")
const fishingContainer = document.getElementById("fishing-container")
const saveButton = document.getElementById("save-button")
const resetButton = document.getElementById("reset-button")
const notification = document.getElementById("notification")

// Add DOM elements for new currencies
const crystalsElement = document.getElementById("crystals")
const coresElement = document.getElementById("cores")
const crystalsContainer = document.getElementById("crystals-container")
const coresContainer = document.getElementById("cores-container")

// Gambler minigame elements
const gamblerModal = document.getElementById("gambler-modal")
const gamblerCloseButton = gamblerModal.querySelector(".close-button")
const betAmountInput = document.getElementById("bet-amount")
const gambleButton = document.getElementById("gamble-button")
const gamblerResult = document.getElementById("gambler-result")
const slotMachine = document.getElementById("slot-machine")
const slot1 = document.getElementById("slot1")
const slot2 = document.getElementById("slot2")
const slot3 = document.getElementById("slot3")

// Wordle minigame elements
const wordleModal = document.getElementById("wordle-modal")
const wordleCloseButton = wordleModal.querySelector(".close-button")
const wordleGrid = document.getElementById("wordle-grid")
const wordleResult = document.getElementById("wordle-result")
const wordleCooldown = document.getElementById("wordle-cooldown")
const wordleTimer = document.getElementById("wordle-timer")

// Professor minigame elements
const professorModal = document.getElementById("professor-modal")
const professorCloseButton = professorModal.querySelector(".close-button")
const mathProblem = document.getElementById("math-problem")
const mathAnswer = document.getElementById("math-answer")
const submitAnswer = document.getElementById("submit-answer")
const professorResult = document.getElementById("professor-result")
const professorCooldown = document.getElementById("professor-cooldown")
const professorTimer = document.getElementById("professor-timer")

// Merchant minigame elements
const merchantModal = document.getElementById("merchant-modal")
const merchantCloseButton = merchantModal.querySelector(".close-button")
const merchantItems = document.getElementById("merchant-items")
const merchantResult = document.getElementById("merchant-result")
const merchantCooldown = document.getElementById("merchant-cooldown")
const merchantTimer = document.getElementById("merchant-timer")

// Farming elements
const plantSelection = document.getElementById("plant-selection")
const plantsList = document.getElementById("plants-list")
const currentPlant = document.getElementById("current-plant")
const plantName = document.getElementById("plant-name")
const plantCycles = document.getElementById("plant-cycles")
const plantMaxCycles = document.getElementById("plant-max-cycles")
const plantNextWater = document.getElementById("plant-next-water")
const waterPlantBtn = document.getElementById("water-plant-btn")
const harvestPlantBtn = document.getElementById("harvest-plant-btn")
const freezePlantBtn = document.getElementById("freeze-plant-btn")

// Fishing elements
const baitCount = document.getElementById("bait-count")
const fishCaught = document.getElementById("fish-caught")
const fishBtn = document.getElementById("fish-btn")
const fishingResult = document.getElementById("fishing-result")

// Game variables
let wordleState = {
  targetWord: "",
  currentRow: 0,
  currentCol: 0,
  guesses: [],
  gameOver: false,
  won: false,
}

const professorState = {
  problem: "",
  answer: 0,
  difficulty: 1,
}

const merchantState = {
  items: [],
}

// Initialize game
function initGame() {
  loadGame()
  updateUI()

  // Show CPC initially
  cpcContainer.classList.remove("hidden")

  // Hide CPS initially if no passive income
  if (gameState.coinsPerSecond <= 0) {
    cpsContainer.classList.add("hidden")
  } else {
    cpsContainer.classList.remove("hidden")
  }

  // Hide premium currencies initially if not unlocked
  if (!gameState.unlocks.crystals) {
    crystalsContainer.classList.add("hidden")
  }

  if (!gameState.unlocks.cores) {
    coresContainer.classList.add("hidden")
  }

  // Make sure all UI elements are properly shown based on unlocks
  checkUnlocks()

  // Start game loop
  setInterval(gameLoop, 100) // Run 10 times per second for smoother updates
}

// Game loop
function gameLoop() {
  const now = Date.now()
  const deltaTime = (now - gameState.lastTick) / 1000 // Convert to seconds

  // Add coins from passive income
  if (gameState.coinsPerSecond > 0) {
    addCoins(gameState.coinsPerSecond * deltaTime)
  }

  // Update cooldowns
  updateCooldowns()

  // Update job cooldowns
  updateJobCooldowns();

  // Check for new unlocks
  checkUnlocks()

  // Update UI
  updateUI()

  // Auto-save every minute
  if (now - gameState.lastSave > 60000) {
    saveGame()
    gameState.lastSave = now
  }

  gameState.lastTick = now
  gameState.stats.totalTimeSpent += deltaTime
}

// Add coins to the game state
function addCoins(amount) {
  const multipliedAmount = amount * gameState.coinMultiplier
  gameState.coins += multipliedAmount
  gameState.stats.totalCoinsEarned += multipliedAmount
  updateUI()
}

// Update UI elements
function updateUI() {
  coinsElement.textContent = formatNumber(gameState.coins)

  // Update currency displays
  if (gameState.unlocks.crystals) {
    crystalsContainer.classList.remove("hidden")
    crystalsElement.textContent = formatNumber(gameState.crystals)
  }

  if (gameState.unlocks.cores) {
    coresContainer.classList.remove("hidden")
    coresElement.textContent = formatNumber(gameState.cores)
  }

  if (gameState.coinsPerSecond > 0) {
    cpsContainer.classList.remove("hidden")
    cpsElement.textContent = formatNumber(gameState.coinsPerSecond)
  }

  cpcContainer.classList.remove("hidden")
  cpcElement.textContent = formatNumber(gameState.coinsPerClick)

  // Update button appearance based on upgrades
  updateButtonAppearance()

  // Update upgrades availability
  updateUpgradesAvailability()

  // Update jobs availability
  updateJobsAvailability()

  // Update minigames availability
  updateMinigamesAvailability()

  // Update crafting availability
  updateCraftingAvailability()

  // Update farming UI
  updateFarmingUI()

  // Update fishing UI
  updateFishingUI()
}

// Format large numbers
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + "M"
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  } else {
    return Math.floor(num)
  }
}

// Update button appearance based on upgrades
function updateButtonAppearance() {
  // Remove all tier classes
  mainButton.classList.remove("tier1", "tier2", "tier3", "tier4", "tier5")

  // Determine highest tier of button upgrade purchased
  let highestTier = 0
  for (const upgradeId in gameState.upgrades) {
    const upgrade = upgradesData.find((u) => u.id === upgradeId)
    if (upgrade && upgrade.id.includes("button_upgrade") && gameState.upgrades[upgradeId].level > 0) {
      highestTier = Math.max(highestTier, upgrade.tier)
    }
  }

  // Apply appropriate tier class
  if (highestTier > 0) {
    mainButton.classList.add(`tier${highestTier}`)
  }
}

// Check for new unlocks based on coin count
function checkUnlocks() {
  // Check if upgrades should be unlocked
  if (!gameState.unlocks.upgrades && gameState.coins >= 10) {
    gameState.unlocks.upgrades = true
    upgradesContainer.classList.remove("hidden")
    upgradesContainer.classList.add("visible")
    showNotification("Upgrades unlocked!")
  } else if (gameState.unlocks.upgrades && upgradesContainer.classList.contains("hidden")) {
    // Ensure upgrades are visible if they should be
    upgradesContainer.classList.remove("hidden")
    upgradesContainer.classList.add("visible")
  }

  // Check if jobs should be unlocked
  if (!gameState.unlocks.jobs && gameState.coins >= 500) {
    gameState.unlocks.jobs = true
    jobsContainer.classList.remove("hidden")
    jobsContainer.classList.add("visible")
    showNotification("Jobs unlocked!")
  } else if (gameState.unlocks.jobs && jobsContainer.classList.contains("hidden")) {
    // Ensure jobs are visible if they should be
    jobsContainer.classList.remove("hidden")
    jobsContainer.classList.add("visible")
  }

  // Check if minigames should be unlocked
  if (!gameState.unlocks.minigames && gameState.coins >= 8000) {
    gameState.unlocks.minigames = true
    minigamesContainer.classList.remove("hidden")
    minigamesContainer.classList.add("visible")
    showNotification("Minigames unlocked!")
  } else if (gameState.unlocks.minigames && minigamesContainer.classList.contains("hidden")) {
    // Ensure minigames are visible if they should be
    minigamesContainer.classList.remove("hidden")
    minigamesContainer.classList.add("visible")
  }

  // Check if crafting should be unlocked
  if (!gameState.unlocks.crafting && gameState.coins >= 5000) {
    gameState.unlocks.crafting = true
    craftingContainer.classList.remove("hidden")
    craftingContainer.classList.add("visible")
    showNotification("Crafting unlocked!")
  } else if (gameState.unlocks.crafting && craftingContainer.classList.contains("hidden")) {
    // Ensure crafting is visible if it should be
    craftingContainer.classList.remove("hidden")
    craftingContainer.classList.add("visible")
  }

  // Check if farming should be unlocked
  if (!gameState.unlocks.farming && gameState.jobs.farmer && gameState.jobs.farmer.level > 0) {
    gameState.unlocks.farming = true
    farmingContainer.classList.remove("hidden")
    farmingContainer.classList.add("visible")
    showNotification("Farming unlocked!")
    initFarming()
  } else if (gameState.unlocks.farming && farmingContainer.classList.contains("hidden")) {
    // Ensure farming is visible if it should be
    farmingContainer.classList.remove("hidden")
    farmingContainer.classList.add("visible")
  }

  // Check if fishing should be unlocked
  if (!gameState.unlocks.fishing && gameState.crafting && gameState.crafting.fishing_rod) {
    gameState.unlocks.fishing = true
    fishingContainer.classList.remove("hidden")
    fishingContainer.classList.add("visible")
    showNotification("Fishing unlocked!")
    updateFishingUI()
  } else if (gameState.unlocks.fishing && fishingContainer.classList.contains("hidden")) {
    // Ensure fishing is visible if it should be
    fishingContainer.classList.remove("hidden")
    fishingContainer.classList.add("visible")
  }
}

// Calculate the cost of an upgrade based on its level
function calculateUpgradeCost(upgrade, level) {
  return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, level))
}

// Fix the upgrade level display issue by updating the renderUpgrade function
function renderUpgrade(upgrade) {
  // Skip if already rendered
  if (document.querySelector(`.upgrade-item[data-id="${upgrade.id}"]`)) {
    // Update the existing upgrade instead of skipping
    updateUpgradeDisplay(upgrade);
    return;
  }

  const level = gameState.upgrades[upgrade.id]?.level || 0
  const cost = calculateUpgradeCost(upgrade, level)
  const isAvailable = gameState.coins >= cost && level < upgrade.maxLevel
  const isMaxed = level >= upgrade.maxLevel

  const upgradeElement = document.createElement("div")
  upgradeElement.className = `upgrade-item ${isAvailable ? "available" : isMaxed ? "maxed" : "unavailable"}`
  upgradeElement.dataset.id = upgrade.id

  upgradeElement.innerHTML = `
      <div class="upgrade-name">${upgrade.name} (Lvl ${level}/${upgrade.maxLevel})</div>
      <div class="upgrade-cost">${formatNumber(cost)} UCoins</div>
      <div class="upgrade-description">${upgrade.description}</div>
      <div class="upgrade-status">${isMaxed ? "MAXED" : isAvailable ? "AVAILABLE" : "UNAVAILABLE"}</div>
    `

  upgradeElement.addEventListener("click", () => purchaseUpgrade(upgrade))

  upgradesList.appendChild(upgradeElement)
}

// Add a new function to update existing upgrade displays
function updateUpgradeDisplay(upgrade) {
  const upgradeElement = document.querySelector(`.upgrade-item[data-id="${upgrade.id}"]`);
  if (!upgradeElement) return;
  
  const level = gameState.upgrades[upgrade.id]?.level || 0;
  const cost = calculateUpgradeCost(upgrade, level);
  const isAvailable = gameState.coins >= cost && level < upgrade.maxLevel;
  const isMaxed = level >= upgrade.maxLevel;
  
  upgradeElement.className = `upgrade-item ${isAvailable ? "available" : isMaxed ? "maxed" : "unavailable"}`;
  
  upgradeElement.querySelector(".upgrade-name").textContent = `${upgrade.name} (Lvl ${level}/${upgrade.maxLevel})`;
  upgradeElement.querySelector(".upgrade-cost").textContent = `${formatNumber(cost)} UCoins`;
  upgradeElement.querySelector(".upgrade-status").textContent = isMaxed ? "MAXED" : isAvailable ? "AVAILABLE" : "UNAVAILABLE";
}

// Modify the purchaseUpgrade function to update the display immediately
function purchaseUpgrade(upgrade) {
  const level = gameState.upgrades[upgrade.id]?.level || 0

  if (level >= upgrade.maxLevel) {
    showNotification("Upgrade already at max level!")
    return
  }

  const cost = calculateUpgradeCost(upgrade, level)

  if (gameState.coins < cost) {
    showNotification("Not enough UCoins!")
    return
  }

  // Deduct coins
  gameState.coins -= cost

  // Apply upgrade effect
  if (!gameState.upgrades[upgrade.id]) {
    gameState.upgrades[upgrade.id] = { level: 0 }
  }

  gameState.upgrades[upgrade.id].level++

  // Apply effects
  const effects = upgrade.effect(gameState.upgrades[upgrade.id].level)
  Object.keys(effects).forEach((key) => {
    gameState[key] = effects[key]
  })

  // Update the display immediately
  updateUpgradeDisplay(upgrade);

  // Update UI
  updateUI()
  showNotification(`Purchased ${upgrade.name}!`)

  // Save game
  saveGame()
}

// Render all upgrades
function renderUpgrades() {
  upgradesList.innerHTML = ""
  upgradesData.forEach((upgrade) => {
    if (gameState.coins >= upgrade.unlockAt || gameState.upgrades[upgrade.id]) {
      renderUpgrade(upgrade)
    }
  })
}

// Add function to handle job work
function doJobWork(jobId) {
  const job = jobsData.find(j => j.id === jobId);
  if (!job) return;
  
  const now = Date.now();
  
  // Check if on cooldown
  if (gameState.jobCooldowns[jobId] > now) {
    showNotification(`${job.name} is on cooldown!`);
    return;
  }
  
  // Give reward
  addCoins(job.reward);
  showNotification(`Earned ${formatNumber(job.reward)} UCoins from ${job.name}!`);
  
  // Set cooldown
  gameState.jobCooldowns[jobId] = now + job.cooldown;
  
  // Update UI
  updateJobCooldowns();
  
  // Save game
  saveGame();
}

// Add function to update job cooldowns
function updateJobCooldowns() {
  const now = Date.now();
  
  // Update citizen cooldown
  if (gameState.jobs.citizen?.level > 0) {
    const citizenCooldown = document.getElementById("citizen-cooldown");
    const citizenButton = document.getElementById("citizen-work-button");
    
    if (citizenCooldown && citizenButton) {
      const timeRemaining = Math.max(0, gameState.jobCooldowns.citizen - now);
      
      if (timeRemaining > 0) {
        citizenCooldown.textContent = `Ready in: ${formatTime(timeRemaining / 1000)}`;
        citizenButton.disabled = true;
      } else {
        citizenCooldown.textContent = "Ready!";
        citizenButton.disabled = false;
      }
    }
  }
  
  // Update researcher cooldown
  if (gameState.jobs.researcher?.level > 0) {
    const researcherCooldown = document.getElementById("researcher-cooldown");
    const researcherButton = document.getElementById("researcher-work-button");
    
    if (researcherCooldown && researcherButton) {
      const timeRemaining = Math.max(0, gameState.jobCooldowns.researcher - now);
      
      if (timeRemaining > 0) {
        researcherCooldown.textContent = `Ready in: ${formatTime(timeRemaining / 1000)}`;
        researcherButton.disabled = true;
      } else {
        researcherCooldown.textContent = "Ready!";
        researcherButton.disabled = false;
      }
    }
  }
}

// Add function for the slot machine
function spinSlotMachine() {
  const betAmount = Number.parseInt(document.getElementById("gambler-bet-amount").value);
  
  if (isNaN(betAmount) || betAmount < 10) {
    showNotification("Minimum bet is 10 UCoins!");
    return;
  }
  
  if (betAmount > gameState.coins) {
    showNotification("Not enough UCoins!");
    return;
  }
  
  // Deduct coins
  gameState.coins -= betAmount;
  
  // Show slot machine
  const slotMachine = document.getElementById("slot-machine-mini");
  slotMachine.style.display = "flex";
  
  // Animate slots
  animateMiniSlots().then((result) => {
    // Calculate winnings
    let winnings = 0;
    let multiplier = 0;
    let message = "";
    
    // Check for 3 in a row
    if (result[0] === result[1] && result[1] === result[2]) {
      multiplier = 10;
      message = `JACKPOT! x${multiplier}`;
    }
    // Check for 2 matching
    else if (result[0] === result[1] || result[1] === result[2] || result[0] === result[2]) {
      multiplier = 3;
      message = `Two matching! x${multiplier}`;
    }
    
    // Check for any 7
    if (result.includes("7") && multiplier === 0) {
      multiplier = 1.5;
      message = `Lucky 7! x${multiplier}`;
    }
    
    // Calculate winnings
    winnings = Math.floor(betAmount * multiplier);
    
    // Show result
    const resultElement = document.getElementById("gambler-result-mini");
    
    if (winnings > 0) {
      resultElement.textContent = `${message} You won ${formatNumber(winnings)} UCoins!`;
      resultElement.className = "gambler-result-mini result-win";
      
      // Add winnings
      gameState.coins += winnings;
      
      // Chance for crystal on big win (5%)
      if (multiplier >= 10 && Math.random() < 0.05) {
        gameState.crystals += 1;
        gameState.stats.totalCrystalsEarned += 1;
        gameState.unlocks.crystals = true;
        resultElement.textContent += " +1 Crystal!";
      }
    } else {
      resultElement.textContent = `No match. You lost ${formatNumber(betAmount)} UCoins.`;
      resultElement.className = "gambler-result-mini result-lose";
    }
    
    resultElement.style.display = "block";
    
    // Update UI
    updateUI();
    
    // Save game
    saveGame();
  });
}

// Add function to animate mini slots
function animateMiniSlots() {
  return new Promise((resolve) => {
    const symbols = ["7", "🍒", "💎", "🍀", "⭐"];
    const result = [0, 0, 0];
    
    const slot1 = document.getElementById("slot-mini1");
    const slot2 = document.getElementById("slot-mini2");
    const slot3 = document.getElementById("slot-mini3");
    
    // Reset slots
    slot1.textContent = "?";
    slot2.textContent = "?";
    slot3.textContent = "?";
    
    // Animate first slot
    let count1 = 0;
    const interval1 = setInterval(() => {
      slot1.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      count1++;
      
      if (count1 >= 8) {
        clearInterval(interval1);
        result[0] = slot1.textContent;
        
        // Animate second slot
        let count2 = 0;
        const interval2 = setInterval(() => {
          slot2.textContent = symbols[Math.floor(Math.random() * symbols.length)];
          count2++;
          
          if (count2 >= 12) {
            clearInterval(interval2);
            result[1] = slot2.textContent;
            
            // Animate third slot
            let count3 = 0;
            const interval3 = setInterval(() => {
              slot3.textContent = symbols[Math.floor(Math.random() * symbols.length)];
              count3++;
              
              if (count3 >= 16) {
                clearInterval(interval3);
                result[2] = slot3.textContent;
                resolve(result);
              }
            }, 80);
          }
        }, 80);
      }
    }, 80);
  });
}

// Modify the purchaseJob function
function purchaseJob(job) {
  if (gameState.jobs[job.id]?.level > 0) {
    showNotification("Job already unlocked!");
    return;
  }
  
  if (gameState.coins < job.baseCost) {
    showNotification("Not enough UCoins!");
    return;
  }
  
  // Deduct coins
  gameState.coins -= job.baseCost;
  
  // Unlock job
  if (!gameState.jobs[job.id]) {
    gameState.jobs[job.id] = { level: 0 };
  }
  gameState.jobs[job.id].level = 1;
  
  // Apply effects
  const effects = job.effect();
  
  // Special handling for different job types
  if (job.id === "farmer" && effects.farmerUnlocked) {
    // Unlock farming
    checkUnlocks();
  }
  
  // Re-render the job with interactive elements
  const jobElement = document.querySelector(`.job-item[data-id="${job.id}"]`);
  if (jobElement) {
    jobElement.remove();
  }
  renderJob(job);
  
  // Update UI
  updateUI();
  showNotification(`Unlocked ${job.name}!`);
  
  // Save game
  saveGame();
}

// Update the game loop to include job cooldown updates
function gameLoop() {
  const now = Date.now();
  const deltaTime = (now - gameState.lastTick) / 1000; // Convert to seconds
  
  // Add coins from passive income
  if (gameState.coinsPerSecond > 0) {
    addCoins(gameState.coinsPerSecond * deltaTime);
  }
  
  // Update cooldowns
  updateCooldowns();
  
  // Update job cooldowns
  updateJobCooldowns();
  
  // Check for new unlocks
  checkUnlocks();
  
  // Update UI
  updateUI();
  
  // Auto-save every minute
  if (now - gameState.lastSave > 60000) {
    saveGame();
    gameState.lastSave = now;
  }
  
  gameState.lastTick = now;
  gameState.stats.totalTimeSpent += deltaTime;
}

// Update the minigames system to directly show purchased minigames

// Modify the renderMinigame function to create interactive minigame elements
function renderMinigame(minigame) {
  // Skip if already rendered
  if (document.querySelector(`.minigame-item[data-id="${minigame.id}"]`)) {
    return;
  }
  
  const isUnlocked = gameState.minigames[minigame.id];
  const isAvailable = gameState.coins >= minigame.baseCost && !isUnlocked;
  
  const minigameElement = document.createElement("div");
  minigameElement.className = `minigame-item ${isUnlocked ? "unlocked" : isAvailable ? "available" : "unavailable"}`;
  minigameElement.dataset.id = minigame.id;
  
  if (!isUnlocked) {
    minigameElement.innerHTML = `
      <div class="minigame-name">${minigame.name}</div>
      <div class="minigame-cost">${formatNumber(minigame.baseCost)} UCoins</div>
      <div class="minigame-description">${minigame.description}</div>
      <div class="minigame-status">${isAvailable ? "AVAILABLE" : "UNAVAILABLE"}</div>
    `;
    
    minigameElement.addEventListener("click", () => purchaseMinigame(minigame));
  } else {
    // Create interactive minigame element
    minigameElement.innerHTML = `
      <div class="minigame-name">${minigame.name}</div>
      <div class="minigame-description">${minigame.description}</div>
      <button class="play-minigame-button">Play</button>
      ${minigame.cooldown ? '<div class="minigame-cooldown" id="' + minigame.id + '-cooldown"></div>' : ''}
    `;
    
    minigameElement.querySelector(".play-minigame-button").addEventListener("click", () => {
      playMinigame(minigame.id);
    });
  }
  
  minigamesList.appendChild(minigameElement);
}

// Update upgrades availability
function updateUpgradesAvailability() {
  if (!gameState.unlocks.upgrades) return

  // First, render any new upgrades that should be visible
  upgradesData.forEach((upgrade) => {
    if (gameState.coins >= upgrade.unlockAt || gameState.upgrades[upgrade.id]) {
      renderUpgrade(upgrade)
    }
  })

  // Then update the status of all visible upgrades
  document.querySelectorAll(".upgrade-item").forEach((item) => {
    const upgradeId = item.dataset.id
    const upgrade = upgradesData.find((u) => u.id === upgradeId)
    const level = gameState.upgrades[upgradeId]?.level || 0
    const cost = calculateUpgradeCost(upgrade, level)
    const isAvailable = gameState.coins >= cost && level < upgrade.maxLevel
    const isMaxed = level >= upgrade.maxLevel

    // Update cost display
    item.querySelector(".upgrade-cost").textContent = `${formatNumber(cost)} UCoins`

    // Update status
    if (isMaxed) {
      item.classList.remove("available", "unavailable")
      item.classList.add("maxed")
      item.querySelector(".upgrade-status").textContent = "MAXED"
    } else if (isAvailable) {
      item.classList.remove("unavailable", "maxed")
      item.classList.add("available")
      item.querySelector(".upgrade-status").textContent = "AVAILABLE"
    } else {
      item.classList.remove("available", "maxed")
      item.classList.add("unavailable")
      item.querySelector(".upgrade-status").textContent = "UNAVAILABLE"
    }
  })
}

// Modify the renderJob function to create interactive job elements
function renderJob(job) {
  // Skip if already rendered
  if (document.querySelector(`.job-item[data-id="${job.id}"]`)) {
    return
  }

  const isUnlocked = gameState.jobs[job.id]?.level > 0;
  const isAvailable = gameState.coins >= job.baseCost && !isUnlocked;

  const jobElement = document.createElement("div")
  jobElement.className = `job-item ${isUnlocked ? "unlocked" : isAvailable ? "available" : "unavailable"}`
  jobElement.dataset.id = job.id

  if (!isUnlocked) {
    // Job purchase UI
    jobElement.innerHTML = `
      <div class="job-name">${job.name}</div>
      <div class="job-cost">${formatNumber(job.baseCost)} UCoins</div>
      <div class="job-description">${job.description}</div>
      <div class="job-status">${isAvailable ? "AVAILABLE" : "UNAVAILABLE"}</div>
    `
    jobElement.addEventListener("click", () => purchaseJob(job))
  } else {
    // Job interaction UI based on job type
    switch(job.id) {
      case "citizen":
        jobElement.innerHTML = `
          <div class="job-name">${job.name}</div>
          <div class="job-description">Work to earn ${formatNumber(job.reward)} UCoins</div>
          <button class="job-action-button" id="citizen-work-button">Work</button>
          <div class="job-cooldown" id="citizen-cooldown"></div>
        `
        break;
      case "researcher":
        jobElement.innerHTML = `
          <div class="job-name">${job.name}</div>
          <div class="job-description">Research to earn ${formatNumber(job.reward)} UCoins</div>
          <button class="job-action-button" id="researcher-work-button">Research</button>
          <div class="job-cooldown" id="researcher-cooldown"></div>
        `
        break;
      case "gambler":
        jobElement.innerHTML = `
          <div class="job-name">${job.name}</div>
          <div class="job-description">Try your luck at the slot machine!</div>
          <div class="gambler-controls">
            <input type="number" id="gambler-bet-amount" min="10" placeholder="Bet amount">
            <button class="job-action-button" id="gambler-spin-button">Spin</button>
          </div>
          <div class="slot-machine-mini" id="slot-machine-mini">
            <div class="slot-mini" id="slot-mini1">?</div>
            <div class="slot-mini" id="slot-mini2">?</div>
            <div class="slot-mini" id="slot-mini3">?</div>
          </div>
          <div class="gambler-result-mini" id="gambler-result-mini"></div>
        `
        break;
      case "professor":
        jobElement.innerHTML = `
          <div class="job-name">${job.name}</div>
          <div class="job-description">Solve math problems for UCoins</div>
          <button class="job-action-button" id="professor-button">Open Professor</button>
        `
        break;
      case "farmer":
        jobElement.innerHTML = `
          <div class="job-name">${job.name}</div>
          <div class="job-description">Grow plants for UCoins</div>
          <button class="job-action-button" id="farmer-button">Open Farming</button>
        `
        break;
      case "merchant":
        jobElement.innerHTML = `
          <div class="job-name">${job.name}</div>
          <div class="job-description">Sell items for UCoins</div>
          <button class="job-action-button" id="merchant-button">Open Merchant</button>
        `
        break;
    }
  }

  jobsList.appendChild(jobElement)

  // Add event listeners for job actions if the job is unlocked
  if (isUnlocked) {
    switch(job.id) {
      case "citizen":
        document.getElementById("citizen-work-button").addEventListener("click", () => doJobWork("citizen"));
        break;
      case "researcher":
        document.getElementById("researcher-work-button").addEventListener("click", () => doJobWork("researcher"));
        break;
      case "gambler":
        document.getElementById("gambler-spin-button").addEventListener("click", spinSlotMachine);
        break;
      case "professor":
        document.getElementById("professor-button").addEventListener("click", () => openProfessorMinigame());
        break;
      case "farmer":
        document.getElementById("farmer-button").addEventListener("click", () => {
          // Scroll to farming section
          farmingContainer.scrollIntoView({ behavior: 'smooth' });
        });
        break;
      case "merchant":
        document.getElementById("merchant-button").addEventListener("click", () => openMerchantMinigame());
        break;
    }
  }
}

// Render all jobs
function renderJobs() {
  jobsList.innerHTML = ""
  jobsData.forEach((job) => {
    if (gameState.coins >= job.unlockAt || gameState.jobs[job.id]) {
      renderJob(job)
    }
  })
}

// Update jobs availability
function updateJobsAvailability() {
  if (!gameState.unlocks.jobs) return

  // First, render any new jobs that should be visible
  jobsData.forEach((job) => {
    if (gameState.coins >= job.unlockAt || gameState.jobs[job.id]) {
      renderJob(job)
    }
  })
}

// Render all minigames
function renderMinigames() {
  minigamesList.innerHTML = "";
  minigamesData.forEach((minigame) => {
    if (
      (gameState.coins >= minigame.unlockAt || gameState.minigames[minigame.id]) &&
      (!minigame.requires ||
        (gameState.jobs[minigame.requires.job] &&
          gameState.jobs[minigame.requires.job].level >= minigame.requires.level))
    ) {
      renderMinigame(minigame);
    }
  });
}

// Modify the renderMinigame function to create interactive minigame elements

// Update minigames availability
function updateMinigamesAvailability() {
  if (!gameState.unlocks.minigames) return

  // First, render any new minigames that should be visible
  minigamesData.forEach((minigame) => {
    if (
      (gameState.coins >= minigame.unlockAt || gameState.minigames[minigame.id]) &&
      (!minigame.requires ||
        (gameState.jobs[minigame.requires.job] &&
          gameState.jobs[minigame.requires.job].level >= minigame.requires.level))
    ) {
      renderMinigame(minigame)
    }
  })

  // Then update the status of all visible minigames
  document.querySelectorAll(".minigame-item").forEach((item) => {
    const minigameId = item.dataset.id
    const minigame = minigamesData.find((m) => m.id === minigameId)
    const isUnlocked = gameState.minigames[minigameId]
    const isAvailable = gameState.coins >= minigame.baseCost && !isUnlocked

    // Update status
    if (isUnlocked) {
      item.classList.remove("available", "unavailable")
      item.classList.add("unlocked")
      item.querySelector(".minigame-status").textContent = "UNLOCKED"

      // Check if cooldown is active
      const cooldownActive = gameState.cooldowns[minigameId.split("_")[0]] > Date.now()
      const playButton = item.querySelector(".play-minigame-button")

      if (playButton) {
        if (cooldownActive) {
          playButton.disabled = true
          playButton.textContent = "On Cooldown"
        } else {
          playButton.disabled = false
          playButton.textContent = "Play"
        }
      }
    } else if (isAvailable) {
      item.classList.remove("unavailable", "unlocked")
      item.classList.add("available")
      item.querySelector(".minigame-status").textContent = "AVAILABLE"
    } else {
      item.classList.remove("available", "unlocked")
      item.classList.add("unavailable")
      item.querySelector(".minigame-status").textContent = "UNAVAILABLE"
    }
  })
}

// Render all craftable items
function renderCraftables() {
  craftingList.innerHTML = ""
  craftingData.forEach((craft) => {
    if (
      (gameState.coins >= craft.unlockAt || gameState.crafting[craft.id]) &&
      (!craft.requires || gameState.crafting[craft.requires.crafting])
    ) {
      renderCraftable(craft)
    }
  })
}

// Render a single craftable item
function renderCraftable(craft) {
  // Skip if already rendered
  if (document.querySelector(`.craft-item[data-id="${craft.id}"]`)) {
    return
  }

  // Check if requirements are met
  if (craft.requires) {
    if (craft.requires.unlocks && !gameState.unlocks[craft.requires.unlocks]) {
      return
    }
    if (craft.requires.crafting && !gameState.crafting[craft.requires.crafting]) {
      return
    }
  }

  const level = gameState.crafting[craft.id]?.level || 0
  const maxLevel = craft.maxLevel || 1
  const isMaxed = level >= maxLevel

  // Check if player has enough resources
  let canCraft = true
  let ingredientsText = ""

  craft.ingredients.forEach((ingredient) => {
    if (ingredient.type === "coins") {
      if (gameState.coins < ingredient.amount) {
        canCraft = false
      }
      ingredientsText += `${formatNumber(ingredient.amount)} UCoins, `
    } else if (ingredient.type === "crystal") {
      if (gameState.crystals < ingredient.amount) {
        canCraft = false
      }
      ingredientsText += `${formatNumber(ingredient.amount)} Crystals, `
    } else if (ingredient.type === "core") {
      if (gameState.cores < ingredient.amount) {
        canCraft = false
      }
      ingredientsText += `${formatNumber(ingredient.amount)} Cores, `
    }
  })

  // Remove trailing comma and space
  ingredientsText = ingredientsText.slice(0, -2)

  const craftElement = document.createElement("div")
  craftElement.className = `craft-item ${isMaxed ? "maxed" : canCraft ? "available" : "unavailable"}`
  craftElement.dataset.id = craft.id

  craftElement.innerHTML = `
    <div class="craft-name">${craft.name} ${maxLevel > 1 ? `(Lvl ${level}/${maxLevel})` : ""}</div>
    <div class="craft-cost">Requires: ${ingredientsText}</div>
    <div class="craft-description">${craft.description}</div>
    <div class="craft-status">${isMaxed ? "MAXED" : canCraft ? "AVAILABLE" : "UNAVAILABLE"}</div>
  `

  if (!isMaxed) {
    craftElement.addEventListener("click", () => craftItem(craft))
  }

  craftingList.appendChild(craftElement)
}

// Update crafting availability
function updateCraftingAvailability() {
  if (!gameState.unlocks.crafting) return

  // First, render any new craftables that should be visible
  craftingData.forEach((craft) => {
    if (
      (gameState.coins >= craft.unlockAt || gameState.crafting[craft.id]) &&
      (!craft.requires ||
        ((!craft.requires.crafting || gameState.crafting[craft.requires.crafting]) &&
          (!craft.requires.unlocks || gameState.unlocks[craft.requires.unlocks])))
    ) {
      renderCraftable(craft)
    }
  })

  // Then update the status of all visible craftables
  document.querySelectorAll(".craft-item").forEach((item) => {
    const craftId = item.dataset.id
    const craft = craftingData.find((c) => c.id === craftId)
    const level = gameState.crafting[craftId]?.level || 0
    const maxLevel = craft.maxLevel || 1
    const isMaxed = level >= maxLevel

    // Check if player has enough resources
    let canCraft = true
    let ingredientsText = ""

    craft.ingredients.forEach((ingredient) => {
      if (ingredient.type === "coins") {
        if (gameState.coins < ingredient.amount) {
          canCraft = false
        }
        ingredientsText += `${formatNumber(ingredient.amount)} UCoins, `
      } else if (ingredient.type === "crystal") {
        if (gameState.crystals < ingredient.amount) {
          canCraft = false
        }
        ingredientsText += `${formatNumber(ingredient.amount)} Crystals, `
      } else if (ingredient.type === "core") {
        if (gameState.cores < ingredient.amount) {
          canCraft = false
        }
        ingredientsText += `${formatNumber(ingredient.amount)} Cores,  {
          canCraft = false;
        }
        ingredientsText += \`${formatNumber(ingredient.amount)} Cores, `
      }
    })

    // Remove trailing comma and space
    ingredientsText = ingredientsText.slice(0, -2)

    // Update ingredients display
    item.querySelector(".craft-cost").textContent = `Requires: ${ingredientsText}`

    // Update status
    if (isMaxed) {
      item.classList.remove("available", "unavailable")
      item.classList.add("maxed")
      item.querySelector(".craft-status").textContent = "MAXED"
    } else if (canCraft) {
      item.classList.remove("unavailable", "maxed")
      item.classList.add("available")
      item.querySelector(".craft-status").textContent = "AVAILABLE"
    } else {
      item.classList.remove("available", "maxed")
      item.classList.add("unavailable")
      item.querySelector(".craft-status").textContent = "UNAVAILABLE"
    }
  })
}

// Initialize farming
function initFarming() {
  // Show plant selection
  plantSelection.classList.remove("hidden")

  // Render plants
  plantsList.innerHTML = ""
  plantsData.forEach((plant) => {
    const plantItem = document.createElement("div")
    plantItem.className = "plant-item"
    plantItem.dataset.id = plant.id

    plantItem.innerHTML = `
        <div class="plant-name">${plant.name}</div>
        <div class="plant-description">${plant.description}</div>
        <div class="plant-cycles">Max Cycles: ${plant.maxCycles}</div>
        <div class="plant-cooldown">Cooldown: ${formatTime(plant.cooldown / 1000)}</div>
      `

    plantItem.addEventListener("click", () => selectPlant(plant))

    plantsList.appendChild(plantItem)
  })

  // If player already has a plant, show it
  if (gameState.farming.currentPlant) {
    showCurrentPlant()
  }
}

// Update farming UI
function updateFarmingUI() {
  if (!gameState.unlocks.farming) return

  // If player has a plant, update its info
  if (gameState.farming.currentPlant) {
    plantCycles.textContent = gameState.farming.plantCycles
    plantMaxCycles.textContent = gameState.farming.plantMaxCycles

    // Update next water time
    const timeRemaining = Math.max(0, gameState.farming.nextWaterTime - Date.now())
    plantNextWater.textContent = formatTime(timeRemaining / 1000)

    // Enable/disable water button
    waterPlantBtn.disabled = timeRemaining > 0 || gameState.farming.frozen

    // Enable/disable harvest button
    harvestPlantBtn.disabled = gameState.farming.plantCycles < gameState.farming.plantMaxCycles

    // Update freeze button text
    freezePlantBtn.textContent = gameState.farming.frozen ? "Unfreeze Plant" : "Freeze Plant"
  }
}

// Update fishing UI
function updateFishingUI() {
  if (!gameState.unlocks.fishing) return

  baitCount.textContent = gameState.fishing.bait
  fishCaught.textContent = gameState.fishing.fishCaught

  // Enable/disable fish button
  fishBtn.disabled = gameState.fishing.bait <= 0
  fishBtn.textContent = gameState.fishing.bait > 0 ? "Fish" : "Fish (Need Bait)"
}

// Purchase an upgrade
function purchaseUpgrade(upgrade) {
  const level = gameState.upgrades[upgrade.id]?.level || 0

  if (level >= upgrade.maxLevel) {
    showNotification("Upgrade already at max level!")
    return
  }

  const cost = calculateUpgradeCost(upgrade, level)

  if (gameState.coins < cost) {
    showNotification("Not enough UCoins!")
    return
  }

  // Deduct coins
  gameState.coins -= cost

  // Apply upgrade effect
  if (!gameState.upgrades[upgrade.id]) {
    gameState.upgrades[upgrade.id] = { level: 0 }
  }

  gameState.upgrades[upgrade.id].level++

  // Apply effects
  const effects = upgrade.effect(gameState.upgrades[upgrade.id].level)
  Object.keys(effects).forEach((key) => {
    gameState[key] = effects[key]
  })

  // Update UI
  updateUI()
  showNotification(`Purchased ${upgrade.name}!`)

  // Save game
  saveGame()
}

// Purchase a job
function purchaseJob(job) {
  if (gameState.jobs[job.id]?.level > 0) {
    showNotification("Job already unlocked!");
    return;
  }
  
  if (gameState.coins < job.baseCost) {
    showNotification("Not enough UCoins!");
    return;
  }
  
  // Deduct coins
  gameState.coins -= job.baseCost;
  
  // Unlock job
  if (!gameState.jobs[job.id]) {
    gameState.jobs[job.id] = { level: 0 };
  }
  gameState.jobs[job.id].level = 1;
  
  // Apply effects
  const effects = job.effect();
  
  // Special handling for different job types
  if (job.id === "farmer" && effects.farmerUnlocked) {
    // Unlock farming
    checkUnlocks();
  }
  
  // Re-render the job with interactive elements
  const jobElement = document.querySelector(`.job-item[data-id="${job.id}"]`);
  if (jobElement) {
    jobElement.remove();
  }
  renderJob(job);
  
  // Update UI
  updateUI();
  showNotification(`Unlocked ${job.name}!`);
  
  // Save game
  saveGame();
}

// Purchase a minigame
function purchaseMinigame(minigame) {
  if (gameState.minigames[minigame.id]) {
    showNotification("Minigame already unlocked!")
    return
  }

  if (gameState.coins < minigame.baseCost) {
    showNotification("Not enough UCoins!")
    return
  }

  // Deduct coins
  gameState.coins -= minigame.baseCost

  // Unlock minigame
  gameState.minigames[minigame.id] = true

  // Update UI
  updateMinigamesAvailability()
  showNotification(`Unlocked ${minigame.name}!`)

  // Save game
  saveGame()
}

// Craft an item
function craftItem(craft) {
  const level = gameState.crafting[craft.id]?.level || 0
  const maxLevel = craft.maxLevel || 1

  if (level >= maxLevel) {
    showNotification("Item already at max level!")
    return
  }

  // Check if player has enough resources
  let canCraft = true

  craft.ingredients.forEach((ingredient) => {
    if (ingredient.type === "coins" && gameState.coins < ingredient.amount) {
      canCraft = false
    } else if (ingredient.type === "crystal" && gameState.crystals < ingredient.amount) {
      canCraft = false
    } else if (ingredient.type === "core" && gameState.cores < ingredient.amount) {
      canCraft = false
    }
  })

  if (!canCraft) {
    showNotification("Not enough resources!")
    return
  }

  // Deduct resources
  craft.ingredients.forEach((ingredient) => {
    if (ingredient.type === "coins") {
      gameState.coins -= ingredient.amount
    } else if (ingredient.type === "crystal") {
      gameState.crystals -= ingredient.amount
    } else if (ingredient.type === "core") {
      gameState.cores -= ingredient.amount
    }
  })

  // Add crafted item
  if (!gameState.crafting[craft.id]) {
    gameState.crafting[craft.id] = { level: 0 }
  }

  gameState.crafting[craft.id].level++

  // Apply effects
  const effects = craft.effect()

  // Apply specific effects
  if (effects.coinMultiplier) {
    gameState.coinMultiplier = effects.coinMultiplier
  }

  // Special handling for different crafted items
  if (craft.id === "fishing_rod" && effects.fishingUnlocked) {
    // Unlock fishing
    checkUnlocks()
  } else if (craft.id === "coin_bait") {
    // Update fishing UI
    updateFishingUI()
  }

  // Update UI
  updateUI()
  showNotification(`Crafted ${craft.name}!`)

  // Save game
  saveGame()
}

// Select a plant for farming
function selectPlant(plant) {
  // If player already has a plant, ask for confirmation
  if (gameState.farming.currentPlant) {
    if (!confirm("Are you sure you want to abandon your current plant? You will lose all progress!")) {
      return
    }
  }

  // Set current plant
  gameState.farming.currentPlant = plant.id
  gameState.farming.plantCycles = 0
  gameState.farming.plantMaxCycles = plant.maxCycles
  gameState.farming.nextWaterTime = Date.now() + plant.cooldown
  gameState.farming.frozen = false

  // Show current plant
  showCurrentPlant()

  // Update UI
  updateFarmingUI()
  showNotification(`Started growing ${plant.name}!`)

  // Save game
  saveGame()
}

// Show current plant
function showCurrentPlant() {
  plantSelection.classList.add("hidden")
  currentPlant.classList.remove("hidden")

  const plant = plantsData.find((p) => p.id === gameState.farming.currentPlant)
  plantName.textContent = plant.name
}

// Water the plant
function waterPlant() {
  const plant = plantsData.find((p) => p.id === gameState.farming.currentPlant)

  // Increase cycles
  gameState.farming.plantCycles++

  // Set next water time
  gameState.farming.nextWaterTime = Date.now() + plant.cooldown

  // Check for critical (20% chance)
  const isCritical = Math.random() < 0.2

  if (isCritical) {
    showNotification("Critical watering! +50% rewards!")
  }

  // Update UI
  updateFarmingUI()
  showNotification(`Watered ${plant.name}!`)

  // Save game
  saveGame()
}

// Harvest the plant
function harvestPlant() {
  const plant = plantsData.find((p) => p.id === gameState.farming.currentPlant)

  // Calculate rewards
  const coinsReward = plant.rewards.coins(gameState.farming.plantCycles)
  const xpReward = plant.rewards.xp(gameState.farming.plantCycles)

  // Add rewards
  addCoins(coinsReward)

  // Check for fertilizer
  if (plant.rewards.fertilizer && gameState.farming.plantCycles >= gameState.farming.plantMaxCycles) {
    const fertilizerReward = plant.rewards.fertilizer(gameState.farming.plantCycles)
    gameState.farming.fertilizer += fertilizerReward

    if (fertilizerReward > 0) {
      showNotification(`Got ${fertilizerReward} Fertilizer!`)
    }
  }

  // Reset plant
  gameState.farming.currentPlant = null
  gameState.farming.plantCycles = 0
  gameState.farming.plantMaxCycles = 0
  gameState.farming.nextWaterTime = 0
  gameState.farming.frozen = false

  // Show plant selection
  currentPlant.classList.add("hidden")
  plantSelection.classList.remove("hidden")

  // Update UI
  updateFarmingUI()
  showNotification(`Harvested ${plant.name}! +${formatNumber(coinsReward)} UCoins, +${xpReward} XP`)

  // Save game
  saveGame()
}

// Freeze/unfreeze the plant
function toggleFreezePlant() {
  gameState.farming.frozen = !gameState.farming.frozen

  // Update UI
  updateFarmingUI()
  showNotification(gameState.farming.frozen ? "Plant frozen!" : "Plant unfrozen!")

  // Save game
  saveGame()
}

// Go fishing
function goFishing() {
  if (gameState.fishing.bait <= 0) {
    showNotification("You need bait to fish!")
    return
  }

  // Use bait
  gameState.fishing.bait--

  // Determine which fish is caught
  const fishCaught = catchFish()

  // Add rewards
  addCoins(fishCaught.value)
  gameState.fishing.fishCaught++

  if (!gameState.fishing.fishTypes[fishCaught.id]) {
    gameState.fishing.fishTypes[fishCaught.id] = 0
  }

  gameState.fishing.fishTypes[fishCaught.id]++

  // Show result
  fishingResult.classList.remove("hidden")
  fishingResult.innerHTML = `
      <div>You caught a ${fishCaught.name}!</div>
      <div>+${fishCaught.value} UCoins</div>
    `

  // Update UI
  updateFishingUI()
  showNotification(`Caught a ${fishCaught.name}!`)

  // Save game
  saveGame()
}

// Add function to award premium currencies
function awardPremiumCurrency() {
  // Small chance to get crystals (1%)
  if (Math.random() < 0.01) {
    gameState.crystals += 1
    gameState.stats.totalCrystalsEarned += 1
    gameState.unlocks.crystals = true
    showNotification("You found a Crystal!")
  }

  // Very small chance to get cores (0.1%)
  if (Math.random() < 0.001) {
    gameState.cores += 1
    gameState.stats.totalCoresEarned += 1
    gameState.unlocks.cores = true
    showNotification("You found a Core!")
  }
}

// Catch a fish based on probabilities
function catchFish() {
  const rand = Math.random()
  let fish

  if (rand < fishData[3].chance) {
    fish = fishData[3] // Legendary

    // Chance for crystal on legendary fish (20%)
    if (Math.random() < 0.2) {
      gameState.crystals += 1
      gameState.stats.totalCrystalsEarned += 1
      gameState.unlocks.crystals = true
      showNotification("You found a Crystal in the legendary fish!")
    }

    // Small chance for core on legendary fish (5%)
    if (Math.random() < 0.05) {
      gameState.cores += 1
      gameState.stats.totalCoresEarned += 1
      gameState.unlocks.cores = true
      showNotification("You found a Core in the legendary fish!")
    }
  } else if (rand < fishData[2].chance + fishData[3].chance) {
    fish = fishData[2] // Rare

    // Small chance for crystal on rare fish (5%)
    if (Math.random() < 0.05) {
      gameState.crystals += 1
      gameState.stats.totalCrystalsEarned += 1
      gameState.unlocks.crystals = true
      showNotification("You found a Crystal in the rare fish!")
    }
  } else if (rand < fishData[1].chance + fishData[2].chance + fishData[3].chance) {
    fish = fishData[1] // Uncommon
  } else {
    fish = fishData[0] // Common
  }

  return fish
}

// Play a minigame
function playMinigame(minigameId) {
  switch (minigameId) {
    case "gambler_minigame":
      openGamblerMinigame()
      break
    case "wordle_minigame":
      openWordleMinigame()
      break
    case "professor_minigame":
      openProfessorMinigame()
      break
    case "merchant_minigame":
      openMerchantMinigame()
      break
  }
}

// Update cooldowns
function updateCooldowns() {
  // Check if wordle is on cooldown
  if (gameState.cooldowns.wordle > 0) {
    const timeRemaining = Math.max(0, gameState.cooldowns.wordle - Date.now())

    if (timeRemaining > 0) {
      wordleCooldown.classList.remove("hidden")
      wordleTimer.textContent = formatTime(timeRemaining / 1000)
    } else {
      wordleCooldown.classList.add("hidden")
      gameState.cooldowns.wordle = 0
    }
  }

  // Check if professor is on cooldown
  if (gameState.cooldowns.professor > 0) {
    const timeRemaining = Math.max(0, gameState.cooldowns.professor - Date.now())

    if (timeRemaining > 0) {
      professorCooldown.classList.remove("hidden")
      professorTimer.textContent = formatTime(timeRemaining / 1000)
    } else {
      professorCooldown.classList.add("hidden")
      gameState.cooldowns.professor = 0
    }
  }

  // Check if merchant is on cooldown
  if (gameState.cooldowns.merchant > 0) {
    const timeRemaining = Math.max(0, gameState.cooldowns.merchant - Date.now())

    if (timeRemaining > 0) {
      merchantCooldown.classList.remove("hidden")
      merchantTimer.textContent = formatTime(timeRemaining / 1000)
    } else {
      merchantCooldown.classList.add("hidden")
      gameState.cooldowns.merchant = 0
    }
  }
}

// Format time in MM:SS format
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

// Gambler minigame functions
function openGamblerMinigame() {
  gamblerModal.classList.remove("hidden")
  betAmountInput.value = Math.min(100, Math.floor(gameState.coins / 2))
  gamblerResult.classList.add("hidden")
  slotMachine.classList.add("hidden")
}

function closeGamblerMinigame() {
  gamblerModal.classList.add("hidden")
}

function playGamblerMinigame() {
  const betAmount = Number.parseInt(betAmountInput.value)

  if (isNaN(betAmount) || betAmount < 10) {
    showNotification("Minimum bet is 10 UCoins!")
    return
  }

  if (betAmount > gameState.coins) {
    showNotification("Not enough UCoins!")
    return
  }

  // Deduct bet amount
  gameState.coins -= betAmount

  // Show slot machine
  slotMachine.classList.remove("hidden")

  // Animate slots
  animateSlots().then((result) => {
    // Calculate winnings
    let winnings = 0
    let message = ""

    if (result[0] === result[1] && result[1] === result[2]) {
      // All three match - big win
      winnings = betAmount * 5
      message = `JACKPOT! You won ${formatNumber(winnings)} UCoins!`

      // Chance for crystal on jackpot (10%)
      if (Math.random() < 0.1) {
        gameState.crystals += 1
        gameState.stats.totalCrystalsEarned += 1
        gameState.unlocks.crystals = true
        message += " +1 Crystal!"
      }
    } else if (result[0] === result[1] || result[1] === result[2] || result[0] === result[2]) {
      // Two match - small win
      winnings = Math.floor(betAmount * 1.5)
      message = `You won ${formatNumber(winnings)} UCoins!`
    } else {
      // No match - lose
      message = `You lost ${formatNumber(betAmount)} UCoins!`
    }

    // Add winnings
    if (winnings > 0) {
      gameState.coins += winnings
      gamblerResult.className = "gambler-result result-win"
    } else {
      gamblerResult.className = "gambler-result result-lose"
    }

    // Show result
    gamblerResult.textContent = message
    gamblerResult.classList.remove("hidden")

    // Update UI
    updateUI()

    // Save game
    saveGame()
  })
}

function animateSlots() {
  return new Promise((resolve) => {
    const symbols = ["7", "🍒", "💎", "🍀", "⭐"]
    const result = [0, 0, 0]

    // Reset slots
    slot1.textContent = "?"
    slot2.textContent = "?"
    slot3.textContent = "?"

    // Animate first slot
    let count1 = 0
    const interval1 = setInterval(() => {
      slot1.textContent = symbols[Math.floor(Math.random() * symbols.length)]
      count1++

      if (count1 >= 10) {
        clearInterval(interval1)
        result[0] = slot1.textContent

        // Animate second slot
        let count2 = 0
        const interval2 = setInterval(() => {
          slot2.textContent = symbols[Math.floor(Math.random() * symbols.length)]
          count2++

          if (count2 >= 15) {
            clearInterval(interval2)
            result[1] = slot2.textContent

            // Animate third slot
            let count3 = 0
            const interval3 = setInterval(() => {
              slot3.textContent = symbols[Math.floor(Math.random() * symbols.length)]
              count3++

              if (count3 >= 20) {
                clearInterval(interval3)
                result[2] = slot3.textContent
                resolve(result)
              }
            }, 100)
          }
        }, 100)
      }
    }, 100)
  })
}

// Wordle minigame functions
function openWordleMinigame() {
  // Check if on cooldown
  if (gameState.cooldowns.wordle > Date.now()) {
    showNotification("Wordle is on cooldown!")
    return
  }

  wordleModal.classList.remove("hidden")
  wordleResult.classList.add("hidden")
  wordleCooldown.classList.add("hidden")

  // Initialize wordle game
  initWordleGame()
}

function closeWordleMinigame() {
  wordleModal.classList.add("hidden")
}

function initWordleGame() {
  // Reset wordle state
  wordleState = {
    targetWord: wordleWords[Math.floor(Math.random() * wordleWords.length)],
    currentRow: 0,
    currentCol: 0,
    guesses: [],
    gameOver: false,
    won: false,
  }

  // Create grid
  wordleGrid.innerHTML = ""
  for (let i = 0; i < 6; i++) {
    const row = document.createElement("div")
    row.className = "wordle-row"

    for (let j = 0; j < 5; j++) {
      const cell = document.createElement("div")
      cell.className = "wordle-cell"
      row.appendChild(cell)
    }

    wordleGrid.appendChild(row)
  }

  // Add keyboard event listeners
  document.addEventListener("keydown", handleWordleKeydown)

  // Add click event listeners to keyboard buttons
  document.querySelectorAll(".key").forEach((key) => {
    key.addEventListener("click", () => {
      const keyValue = key.dataset.key
      handleWordleKey(keyValue)
    })
  })
}

function handleWordleKeydown(e) {
  if (wordleState.gameOver) return

  if (e.key === "Enter") {
    submitWordleGuess()
  } else if (e.key === "Backspace") {
    deleteWordleLetter()
  } else if (/^[a-zA-Z]$/.test(e.key)) {
    addWordleLetter(e.key.toLowerCase())
  }
}

function handleWordleKey(key) {
  if (wordleState.gameOver) return

  if (key === "enter") {
    submitWordleGuess()
  } else if (key === "backspace") {
    deleteWordleLetter()
  } else if (/^[a-z]$/.test(key)) {
    addWordleLetter(key)
  }
}

function addWordleLetter(letter) {
  if (wordleState.currentCol < 5) {
    const cell = wordleGrid.children[wordleState.currentRow].children[wordleState.currentCol]
    cell.textContent = letter
    wordleState.currentCol++
  }
}

function deleteWordleLetter() {
  if (wordleState.currentCol > 0) {
    wordleState.currentCol--
    const cell = wordleGrid.children[wordleState.currentRow].children[wordleState.currentCol]
    cell.textContent = ""
  }
}

function submitWordleGuess() {
  if (wordleState.currentCol !== 5) return

  // Get current guess
  const row = wordleGrid.children[wordleState.currentRow]
  let guess = ""

  for (let i = 0; i < 5; i++) {
    guess += row.children[i].textContent
  }

  // Check if guess is valid (in our word list)
  if (!wordleWords.includes(guess)) {
    showNotification("Not in word list!")
    return
  }

  // Add guess to guesses array
  wordleState.guesses.push(guess)

  // Check letters
  const targetWord = wordleState.targetWord
  const result = []

  for (let i = 0; i < 5; i++) {
    if (guess[i] === targetWord[i]) {
      result.push("correct")
    } else if (targetWord.includes(guess[i])) {
      result.push("present")
    } else {
      result.push("absent")
    }
  }

  // Update cell colors
  for (let i = 0; i < 5; i++) {
    const cell = row.children[i]
    cell.classList.add(result[i])
  }

  // Update keyboard colors
  for (let i = 0; i < 5; i++) {
    const key = document.querySelector(`.key[data-key="${guess[i]}"]`)

    if (key) {
      if (result[i] === "correct") {
        key.classList.remove("present", "absent")
        key.classList.add("correct")
      } else if (result[i] === "present" && !key.classList.contains("correct")) {
        key.classList.remove("absent")
        key.classList.add("present")
      } else if (result[i] === "absent" && !key.classList.contains("correct") && !key.classList.contains("present")) {
        key.classList.add("absent")
      }
    }
  }

  // Check if game is won
  if (guess === targetWord) {
    wordleState.gameOver = true
    wordleState.won = true

    // Show result
    wordleResult.classList.remove("hidden")
    wordleResult.className = "wordle-result result-win"

    // Add reward and chance for crystal (5%)
    let resultText = "You won! +500 UCoins"
    addCoins(500)

    if (Math.random() < 0.05) {
      gameState.crystals += 1
      gameState.stats.totalCrystalsEarned += 1
      gameState.unlocks.crystals = true
      resultText += " +1 Crystal!"
    }

    wordleResult.textContent = resultText

    // Set cooldown
    const cooldown = minigamesData.find((m) => m.id === "wordle_minigame").cooldown
    gameState.cooldowns.wordle = Date.now() + cooldown

    // Save game
    saveGame()
  } else {
    // Move to next row
    wordleState.currentRow++
    wordleState.currentCol = 0

    // Check if game is over
    if (wordleState.currentRow >= 6) {
      wordleState.gameOver = true

      // Show result
      wordleResult.classList.remove("hidden")
      wordleResult.className = "wordle-result result-lose"
      wordleResult.textContent = `Game over! The word was ${targetWord}. +100 UCoins`

      // Add smaller reward
      addCoins(100)

      // Set cooldown
      const cooldown = minigamesData.find((m) => m.id === "wordle_minigame").cooldown
      gameState.cooldowns.wordle = Date.now() + cooldown

      // Save game
      saveGame()
    }
  }
}

// Professor minigame functions
function openProfessorMinigame() {
  // Check if on cooldown
  if (gameState.cooldowns.professor > Date.now()) {
    showNotification("Professor is on cooldown!")
    return
  }

  professorModal.classList.remove("hidden")
  professorResult.classList.add("hidden")
  professorCooldown.classList.add("hidden")

  // Initialize professor game
  initProfessorGame()
}

function closeProfessorMinigame() {
  professorModal.classList.add("hidden")
}

function initProfessorGame() {
  // Set difficulty based on professor level
  const professorLevel = gameState.jobs.professor?.level || 1
  professorState.difficulty = professorLevel

  // Generate math problem
  generateMathProblem()

  // Clear answer input
  mathAnswer.value = ""

  // Focus on answer input
  mathAnswer.focus()
}

function generateMathProblem() {
  const difficulty = professorState.difficulty
  let problem = ""
  let answer = 0

  // Generate problem based on difficulty
  switch (difficulty) {
    case 1:
      // Simple addition/subtraction
      const num1 = Math.floor(Math.random() * 50) + 1
      const num2 = Math.floor(Math.random() * 50) + 1
      const operation = Math.random() < 0.5 ? "+" : "-"

      problem = `${num1} ${operation} ${num2}`
      answer = operation === "+" ? num1 + num2 : num1 - num2
      break
    case 2:
      // Multiplication/division
      const num3 = Math.floor(Math.random() * 12) + 1
      const num4 = Math.floor(Math.random() * 12) + 1
      const operation2 = Math.random() < 0.7 ? "×" : "÷"

      if (operation2 === "×") {
        problem = `${num3} × ${num4}`
        answer = num3 * num4
      } else {
        // Ensure clean division
        const product = num3 * num4
        problem = `${product} ÷ ${num3}`
        answer = num4
      }
      break
    case 3:
      // Two operations
      const num5 = Math.floor(Math.random() * 20) + 1
      const num6 = Math.floor(Math.random() * 20) + 1
      const num7 = Math.floor(Math.random() * 20) + 1
      const operation3 = Math.random() < 0.5 ? "+" : "-"
      const operation4 = Math.random() < 0.5 ? "+" : "-"

      problem = `${num5} ${operation3} ${num6} ${operation4} ${num7}`

      if (operation3 === "+" && operation4 === "+") {
        answer = num5 + num6 + num7
      } else if (operation3 === "+" && operation4 === "-") {
        answer = num5 + num6 - num7
      } else if (operation3 === "-" && operation4 === "+") {
        answer = num5 - num6 + num7
      } else {
        answer = num5 - num6 - num7
      }
      break
    case 4:
      // Mixed operations
      const num8 = Math.floor(Math.random() * 12) + 1
      const num9 = Math.floor(Math.random() * 12) + 1
      const num10 = Math.floor(Math.random() * 12) + 1

      problem = `${num8} × ${num9} + ${num10}`
      answer = num8 * num9 + num10
      break
    case 5:
      // Complex problem
      const num11 = Math.floor(Math.random() * 20) + 1
      const num12 = Math.floor(Math.random() * 10) + 1
      const num13 = Math.floor(Math.random() * 5) + 1

      problem = `(${num11} + ${num12}) × ${num13}`
      answer = (num11 + num12) * num13
      break
  }

  // Set problem and answer
  mathProblem.textContent = problem
  professorState.problem = problem
  professorState.answer = answer
}

function submitMathAnswer() {
  const userAnswer = Number.parseInt(mathAnswer.value)

  if (isNaN(userAnswer)) {
    showNotification("Please enter a valid number!")
    return
  }

  // Check answer
  const isCorrect = userAnswer === professorState.answer

  // Show result
  professorResult.classList.remove("hidden")

  if (isCorrect) {
    // Calculate reward based on difficulty
    const baseReward = 100
    const reward = baseReward * professorState.difficulty

    let resultText = `Correct! +${reward} UCoins`

    // Chance for crystal based on difficulty (1% per difficulty level)
    if (Math.random() < 0.01 * professorState.difficulty) {
      gameState.crystals += 1
      gameState.stats.totalCrystalsEarned += 1
      gameState.unlocks.crystals = true
      resultText += " +1 Crystal!"
    }

    // Very small chance for core on highest difficulty (1%)
    if (professorState.difficulty >= 5 && Math.random() < 0.01) {
      gameState.cores += 1
      gameState.stats.totalCoresEarned += 1
      gameState.unlocks.cores = true
      resultText += " +1 Core!"
    }

    professorResult.className = "professor-result result-win"
    professorResult.textContent = resultText

    // Add reward
    addCoins(reward)
  } else {
    professorResult.className = "professor-result result-lose"
    professorResult.textContent = `Incorrect! The answer was ${professorState.answer}. +10 UCoins`

    // Add small consolation reward
    addCoins(10)
  }

  // Set cooldown
  const cooldown = minigamesData.find((m) => m.id === "professor_minigame").cooldown
  gameState.cooldowns.professor = Date.now() + cooldown

  // Save game
  saveGame()
}

// Merchant minigame functions
function openMerchantMinigame() {
  // Check if on cooldown
  if (gameState.cooldowns.merchant > Date.now()) {
    showNotification("Merchant is on cooldown!")
    return
  }

  merchantModal.classList.remove("hidden")
  merchantResult.classList.add("hidden")
  merchantCooldown.classList.add("hidden")

  // Initialize merchant game
  initMerchantGame()
}

function closeMerchantMinigame() {
  merchantModal.classList.add("hidden")
}

function initMerchantGame() {
  // Generate items
  generateMerchantItems()
}

function generateMerchantItems() {
  // Clear previous items
  merchantItems.innerHTML = ""
  merchantState.items = []

  // Generate 3 random items
  for (let i = 0; i < 3; i++) {
    // Determine rarity based on merchant level
    const merchantLevel = gameState.jobs.merchant?.level || 1
    let rarity

    if (merchantLevel >= 5) {
      // Higher chance for rare items
      const rand = Math.random()
      rarity = rand < 0.4 ? "rare" : rand < 0.7 ? "uncommon" : "common"
    } else if (merchantLevel >= 3) {
      // Medium chance for rare items
      const rand = Math.random()
      rarity = rand < 0.2 ? "rare" : rand < 0.5 ? "uncommon" : "common"
    } else {
      // Low chance for rare items
      const rand = Math.random()
      rarity = rand < 0.1 ? "rare" : rand < 0.3 ? "uncommon" : "common"
    }

    // Get random item from rarity category
    const itemsInCategory = merchantItemsData[rarity]
    const baseItem = itemsInCategory[Math.floor(Math.random() * itemsInCategory.length)]

    // Generate properties
    const age = generateItemProperty("age")
    const fragility = generateItemProperty("fragility")
    const longevity = generateItemProperty("longevity")
    const materialQuality = generateItemProperty("materialQuality")
    const use = generateItemProperty("use")

    // Calculate value
    const baseValue = baseItem.baseValue
    const ageValue = age.value
    const fragilityValue =
      typeof fragility.value === "number"
        ? fragility.value
        : Math.floor(Math.random() * (fragility.value[1] - fragility.value[0] + 1)) + fragility.value[0]
    const longevityValue = longevity.value
    const materialQualityValue =
      typeof materialQuality.value === "number"
        ? materialQuality.value
        : Math.floor(Math.random() * (materialQuality.value[1] - materialQuality.value[0] + 1)) +
          materialQuality.value[0]
    const useValue =
      typeof use.value === "number"
        ? use.value
        : Math.floor(Math.random() * (use.value[1] - use.value[0] + 1)) + use.value[0]

    const totalValue = Math.max(
      0,
      baseValue + ageValue + fragilityValue + longevityValue + materialQualityValue + useValue,
    )

    // Create item object
    const item = {
      name: baseItem.name,
      rarity: rarity,
      baseValue: baseItem.baseValue,
      age: age.name,
      fragility: fragility.name,
      longevity: longevity.name,
      materialQuality: materialQuality.name,
      use: use.name,
      totalValue: totalValue,
    }

    merchantState.items.push(item)

    // Create item element
    const itemElement = document.createElement("div")
    itemElement.className = "merchant-item"
    itemElement.dataset.index = i

    itemElement.innerHTML = `
        <div class="merchant-item-name">${item.name} (${item.rarity})</div>
        <div class="merchant-item-property">Age: ${item.age}</div>
        <div class="merchant-item-property">Fragility: ${item.fragility}</div>
        <div class="merchant-item-property">Longevity: ${item.longevity}</div>
        <div class="merchant-item-property">Material Quality: ${item.materialQuality}</div>
        <div class="merchant-item-property">Use: ${item.use}</div>
      `

    itemElement.addEventListener("click", () => selectMerchantItem(i))

    merchantItems.appendChild(itemElement)
  }
}

function generateItemProperty(propertyType) {
  const properties = itemPropertiesData[propertyType]
  const property = properties[Math.floor(Math.random() * properties.length)]

  // If property has a range, generate a random value within that range
  if (property.range) {
    const min = property.range[0]
    const max = property.range[1]
    const randomValue = Math.floor(Math.random() * (max - min + 1)) + min
    return { name: `${randomValue} Years`, value: property.value }
  }

  return property
}

function selectMerchantItem(index) {
  const item = merchantState.items[index]

  // Calculate chance for crystal based on item value
  const crystalChance = item.totalValue > 500 ? 0.08 : 0.03
  const coreChance = item.totalValue > 1000 ? 0.01 : 0

  let resultText = `You sold ${item.name} for ${item.totalValue} UCoins!`

  // Check for crystal
  if (Math.random() < crystalChance) {
    gameState.crystals += 1
    gameState.stats.totalCrystalsEarned += 1
    gameState.unlocks.crystals = true
    resultText += " +1 Crystal!"
  }

  // Check for core
  if (Math.random() < coreChance) {
    gameState.cores += 1
    gameState.stats.totalCoresEarned += 1
    gameState.unlocks.cores = true
    resultText += " +1 Core!"
  }

  // Show result
  merchantResult.classList.remove("hidden")
  merchantResult.innerHTML = `
    <div>${resultText}</div>
    <div>Base Value: ${item.baseValue}</div>
    <div>Properties: Age, Fragility, Longevity, Material Quality, Use</div>
  `

  // Add reward
  addCoins(item.totalValue)

  // Disable item selection
  document.querySelectorAll(".merchant-item").forEach((itemElement) => {
    itemElement.style.pointerEvents = "none"
    itemElement.style.opacity = "0.5"
  })

  // Set cooldown
  const cooldown = minigamesData.find((m) => m.id === "merchant_minigame").cooldown
  gameState.cooldowns.merchant = Date.now() + cooldown

  // Save game
  saveGame()
}

// Show notification
function showNotification(message) {
  notification.textContent = message
  notification.classList.remove("hidden")

  setTimeout(() => {
    notification.classList.add("hidden")
  }, 3000)
}

// Save game to local storage
function saveGame() {
  localStorage.setItem("ucoinsClicker", JSON.stringify(gameState))
  showNotification("Game saved!")
}

// Ensure game state is properly loaded and saved
function loadGame() {
  const savedGame = localStorage.getItem("ucoinsClicker")

  if (savedGame) {
    try {
      const parsedGame = JSON.parse(savedGame)

      // Merge saved game with default game state to ensure all properties exist
      gameState = {
        ...gameState,
        ...parsedGame,
        // Ensure these objects are properly merged
        stats: { ...gameState.stats, ...parsedGame.stats },
        unlocks: { ...gameState.unlocks, ...parsedGame.unlocks },
        cooldowns: { ...gameState.cooldowns, ...parsedGame.cooldowns },
        farming: { ...gameState.farming, ...parsedGame.farming },
        fishing: { ...gameState.fishing, ...parsedGame.fishing },
        jobCooldowns: { ...gameState.jobCooldowns, ...parsedGame.jobCooldowns },
      }

      // Ensure lastTick is updated to prevent huge coin jumps
      gameState.lastTick = Date.now()

      // Make sure all UI elements are properly shown based on unlocks
      checkUnlocks()

      showNotification("Game loaded!")
    } catch (error) {
      console.error("Error loading game:", error)
    }
  }
}

// Reset game
function resetGame() {
  if (confirm("Are you sure you want to reset your game? All progress will be lost!")) {
    localStorage.removeItem("ucoinsClicker")
    location.reload()
  }
}

// Create coin particles when clicking the main button
function createCoinParticles(x, y) {
  for (let i = 0; i < 8; i++) {
    const particle = document.createElement("div")
    particle.className = "coin-particle"

    // Random size between 5 and 15 pixels
    const size = Math.floor(Math.random() * 10) + 5
    particle.style.width = `${size}px`
    particle.style.height = `${size}px`

    // Random direction
    const angle = Math.random() * Math.PI * 2
    const distance = Math.random() * 100 + 50
    const xOffset = Math.cos(angle) * distance
    const yOffset = Math.sin(angle) * distance

    // Set custom properties for the animation
    particle.style.setProperty("--x", `${xOffset}px`)
    particle.style.setProperty("--y", `${yOffset}px`)

    // Position at click location
    particle.style.left = `${x - size / 2}px`
    particle.style.top = `${y - size / 2}px`

    // Add to DOM
    document.body.appendChild(particle)

    // Remove after animation completes
    setTimeout(() => {
      particle.remove()
    }, 1000)
  }
}

// Add premium crafting data to the existing crafting data
const premiumCraftingData = [
  {
    id: "crystal_multiplier",
    name: "Crystal Multiplier",
    description: "Permanently increases UCoins gain by 25% from all sources.",
    ingredients: [{ type: "crystal", amount: 5 }],
    effect: () => ({ coinMultiplier: gameState.coinMultiplier * 1.25 }),
    unlockAt: 0,
    requires: { unlocks: "crystals" },
    maxLevel: 3,
  },
  {
    id: "core_multiplier",
    name: "Core Multiplier",
    description: "Permanently doubles UCoins gain from all sources.",
    ingredients: [{ type: "core", amount: 1 }],
    effect: () => ({ coinMultiplier: gameState.coinMultiplier * 2 }),
    unlockAt: 0,
    requires: { unlocks: "cores" },
    maxLevel: 2,
  },
]

// Add premium crafting data to the existing crafting data
craftingData.push(...premiumCraftingData)

// Modify the main button click event to potentially award premium currency
const originalButtonClickHandler = mainButton.onclick
mainButton.onclick = (e) => {
  // Add coins
  addCoins(gameState.coinsPerClick)

  // Track stats
  gameState.stats.totalClicks++

  // Create particles
  const rect = mainButton.getBoundingClientRect()
  const x = rect.left + rect.width / 2
  const y = rect.top + rect.height / 2
  createCoinParticles(x, y)

  // Add click animation
  mainButton.classList.add("clicked")
  setTimeout(() => {
    mainButton.classList.remove("clicked")
  }, 100)

  // Chance to get premium currency
  awardPremiumCurrency()
}

// Event listeners
mainButton.addEventListener("click", (e) => {
  // Add coins
  addCoins(gameState.coinsPerClick)

  // Track stats
  gameState.stats.totalClicks++

  // Create particles
  const rect = mainButton.getBoundingClientRect()
  const x = rect.left + rect.width / 2
  const y = rect.top + rect.height / 2
  createCoinParticles(x, y)

  // Add click animation
  mainButton.classList.add("clicked")
  setTimeout(() => {
    mainButton.classList.remove("clicked")
  }, 100)
})

saveButton.addEventListener("click", saveGame)
resetButton.addEventListener("click", resetGame)

// Gambler minigame event listeners
gamblerCloseButton.addEventListener("click", closeGamblerMinigame)
gambleButton.addEventListener("click", playGamblerMinigame)

// Wordle minigame event listeners
wordleCloseButton.addEventListener("click", closeWordleMinigame)

// Professor minigame event listeners
professorCloseButton.addEventListener("click", closeProfessorMinigame)
submitAnswer.addEventListener("click", submitMathAnswer)
mathAnswer.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    submitMathAnswer()
  }
})

// Merchant minigame event listeners
merchantCloseButton.addEventListener("click", closeMerchantMinigame)

// Farming event listeners
waterPlantBtn.addEventListener("click", waterPlant)
harvestPlantBtn.addEventListener("click", harvestPlant)
freezePlantBtn.addEventListener("click", toggleFreezePlant)

// Fishing event listeners
fishBtn.addEventListener("click", goFishing)

// Initialize game when page loads
window.addEventListener("load", initGame)
