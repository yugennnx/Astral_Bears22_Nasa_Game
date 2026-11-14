/**
 * English story data for the six-sol Compass Outpost prototype.
 * All numeric effects are game-design assumptions, not NASA measurements.
 * See story-plan.md and docs/story-data-contract.md before integration.
 */

export const MISSION = {
  id: "compass-outpost-six-sols",
  title: "Compass Outpost: Six Sols on Mars",
  language: "en",
  robot: { id: "duti", displayName: "DUTİ" },
  resourceKeys: ["energy", "oxygen", "safety"],
  resourceBounds: { min: 0, max: 10 },
  scienceTarget: 6,
  successRequirements: { energy: 1, oxygen: 1, safety: 4, science: 6 },

  // Shared transition rules. Every scene transition (Scenes 1–5) uses these values.
  // All numbers are game-design values, not NASA measurements.
  recharge: {
    clear: 1, // net battery recharge after a clear stage
    dusty: 0, // net battery recharge after a dusty stage
    panelBonusWhenDusty: 1, // extra recharge on each dusty stage if panels were serviced (1A)
  },
  lifeSupport: {
    oxygenPerStage: -1, // crew oxygen use between stages
    lowPowerEnergyAtMost: 2, // if Energy after the decision is this low...
    lowPowerExtraOxygen: -1, // ...life support runs in low-power mode and loses 1 more Oxygen
  },

  // Mission profiles give each new game a different, explainable starting situation.
  // Pick one at random when a game starts and show its briefing before Scene 1.
  // Every profile is checked by tools/check_story_data.mjs to keep all 17 choices winnable.
  defaultProfileId: "standard",
  profiles: [
    {
      id: "standard",
      title: "Standard Mission",
      briefing: "Dust is expected after Sol 2 and Sol 4. Supplies are full.",
      dustyAfterScenes: [2, 4],
      startResources: { energy: 8, oxygen: 8, safety: 8 },
    },
    {
      id: "dusty-season",
      title: "Dusty Season",
      briefing: "Dust is expected after Sol 2, Sol 3, and Sol 4. Clean panels will matter more!",
      dustyAfterScenes: [2, 3, 4],
      startResources: { energy: 8, oxygen: 8, safety: 8 },
    },
    {
      id: "small-oxygen-supply",
      title: "Small Oxygen Supply",
      briefing: "Clear skies are expected except after Sol 2, but the oxygen tanks are not full.",
      dustyAfterScenes: [2],
      startResources: { energy: 8, oxygen: 7, safety: 8 },
    },
  ],
  profileNote: "Mission profiles and dust forecasts are fictional game settings, not measured Mars weather.",

  // Long-term outcome shown in every ending report (story-plan Rule: greenhouse is not a
  // victory condition, but neglecting food production must have a long-term consequence).
  nextCrewReport: {
    title: "Is the base ready for the next crew?",
    food: {
      full: { status: "ready", text: "Fresh food: ready. The greenhouse is growing well for the next crew." },
      minimum: { status: "limited", text: "Fresh food: limited. The next crew will need to grow more plants." },
      off: { status: "at-risk", text: "Fresh food: at risk. The greenhouse is off, so the next crew must restart it and rely on packaged food for longer." },
    },
    safety: {
      ready: { minSafety: 6, text: "Crew health margin: good." },
      low: { text: "Crew health margin: low. The next crew should avoid risky outdoor work at first." },
    },
  },

  initialState: {
    sol: 1,
    sceneId: "welcome-to-mars",
    profileId: "standard",
    resources: { energy: 8, oxygen: 8, safety: 8 },
    science: 0,
    flags: {
      panelsServiced: false,
      shelterPrepared: false,
      sampleCollected: false,
      greenhouseMode: null,
      earthGuide: false,
      stormResponse: null,
      finalTask: null,
    },
    history: [],
    status: "playing",
  },
  openingCard: {
    title: "Commander, Compass Outpost is counting on you!",
    text: "Keep the base running through six stages and earn at least 6 Science Points. Watch your oxygen and energy, and protect your crew. You may not have enough time or supplies to do everything. You decide what comes first!",
    glossary: "A sol is a day on Mars.",
  },
  messages: {
    start: "Start Mission",
    continue: "Continue",
    tryAgain: "Try Again",
    sources: "NASA Sources",
    insufficientEnergy: "Not enough energy",
    insufficientOxygen: "Not enough oxygen",
    reserveWarning: "This choice will use up your reserve.",
    oxygenTransitionWarning: "Your oxygen will run out before the next stage.",
    forecast: "Before the next stage: Energy {energy}, Oxygen {oxygen}.",
    clearStage: "Clear sky: the battery receives a small net recharge. The crew uses oxygen between stages.",
    dustyStage: "Dust: no net battery recharge. The crew uses oxygen between stages.",
    panelBonus: "Your serviced panels add 1 extra Energy despite the dust.",
    lowPower: "Battery very low! Life support runs in low-power mode, so we lose 1 extra Oxygen.",
    timeSkip: "Game time fast-forwarded",
    disclaimer: "All numerical effects are educational game-design values, not NASA measurements. Safety is an abstract game indicator, not a radiation dose.",
  },
};

export const SCENE_ORDER = [
  "welcome-to-mars",
  "power-shortage",
  "greenhouse-problem",
  "message-from-earth",
  "solar-radiation-alert",
  "final-mission",
];

export const SCENES = {
  "welcome-to-mars": {
    id: "welcome-to-mars",
    sol: 1,
    title: "Welcome to Mars",
    visualKey: "outpost-arrival",
    story: [
      { speakerId: "narrator", text: "Red hills stretch beyond the window of Compass Outpost. Your companion robot, DUTİ, rolls over and offers you a mission badge." },
      { speakerId: "duti", text: "Welcome, Commander! Before we begin our research, we have time for one preparation task. The solar panels outside are dusty. Our shelter supplies also need organizing. Which job should we do first?" },
    ],
    learningGoal: "Preparing for the future uses resources now but can reduce later costs.",
    choices: [
      {
        id: "1A",
        label: "Service the solar panels",
        effects: { energy: -2, oxygen: -1, safety: 0, science: 0 },
        setFlags: { panelsServiced: true },
        futureConsequence: "Gain 1 extra Energy after every dusty stage. The shelter remains unprepared.",
        feedback: [
          { speakerId: "duti", text: "The panels are ready! We used powered tools and oxygen from our suit tanks. We can recharge better later, but we did not organize the shelter today." },
        ],
      },
      {
        id: "1B",
        label: "Prepare the storm shelter",
        effects: { energy: -1, oxygen: 0, safety: 1, science: 0 },
        setFlags: { shelterPrepared: true },
        futureConsequence: "Moving into the shelter in Scene 5A will cost 0 Energy instead of 1. The panels remain unserviced.",
        feedback: [
          { speakerId: "duti", text: "The water packs and protective supplies are in place. If a warning arrives, we can get ready faster. The panels will have to wait." },
        ],
      },
    ],
    transition: {},
    nextSceneId: "power-shortage",
  },

  "power-shortage": {
    id: "power-shortage",
    sol: 2,
    title: "Power Shortage",
    visualKey: "power-budget",
    story: [
      { speakerId: "narrator", text: "A warning lights up DUTİ's screen." },
      { speakerId: "duti", text: "Less solar energy will be left to charge our batteries today. We cannot run every device at once." },
      { speakerId: "narrator", text: "The astronauts want to study some unusual rocks nearby. We could also fill our oxygen tank. There is a smaller research task we can do inside the base, too. Where should we use our energy?" },
    ],
    learningGoal: "Research, life support, and outside work share a limited resource budget.",
    scienceCard: {
      title: "Real NASA data: Mars nights are very cold",
      text: "NASA's Perseverance rover measured the air in Jezero Crater on Sol 290 (December 13, 2021). The warmest reading was about −3 °C and the coldest was about −77 °C. A Mars base needs batteries and heaters when the Sun goes down. Our dust and recharge values are game values.",
      dataNote: "Daily minimum and maximum of MEDA air temperature sensor 1, rounded. The game's dust forecast is fictional, not measured Mars weather.",
      sourceIds: ["meda-pds-bundle"],
    },
    choices: [
      {
        id: "2A",
        label: "Produce more oxygen",
        effects: { energy: -2, oxygen: 3, safety: 0, science: 0 },
        futureConsequence: "Build the oxygen reserve, but skip this scene's research opportunity.",
        feedback: [
          { speakerId: "duti", text: "The oxygen system has filled more of our reserve. We have more breathing supplies, but our research will have to wait." },
        ],
      },
      {
        id: "2B",
        label: "Collect a rock sample outside",
        effects: { energy: -1, oxygen: -2, safety: 0, science: 2 },
        setFlags: { sampleCollected: true },
        futureConsequence: "The final laboratory study will award 4 Science instead of 2.",
        feedback: [
          { speakerId: "duti", text: "The sample is here! We recorded observations outside. On the final day, we can study the rock more closely in the lab. We used some of our suit oxygen." },
        ],
      },
      {
        id: "2C",
        label: "Study the base's indoor measurements",
        effects: { energy: -1, oxygen: 0, safety: 0, science: 1 },
        futureConsequence: "Complete a smaller study without using extra oxygen, but collect no physical sample.",
        feedback: [
          { speakerId: "duti", text: "We found a useful pattern in our indoor measurements. We collected less information than an outside trip would provide, but we saved our oxygen." },
        ],
      },
    ],
    transition: {},
    nextSceneId: "greenhouse-problem",
  },

  "greenhouse-problem": {
    id: "greenhouse-problem",
    sol: 3,
    title: "Greenhouse Problem",
    visualKey: "greenhouse-decision",
    story: [
      { speakerId: "narrator", text: "Green leaves fill the greenhouse shelves. These plants were started before your team arrived, and some are almost ready to harvest." },
      { speakerId: "duti", text: "Growing food uses energy. We can keep a full experiment shelf running, light a smaller group of plants, or shut the greenhouse down. Our packaged food will last through this short mission. But the greenhouse's future depends on today's choice." },
    ],
    learningGoal: "Growing food takes time and energy. Stored food and future food production serve different needs.",
    choices: [
      {
        id: "3A",
        label: "Keep the full experiment shelf running",
        effects: { energy: -2, oxygen: 0, safety: 0, science: 0 },
        setFlags: { greenhouseMode: "full" },
        futureConsequence: "Prepare a harvest and detailed growth records. The final greenhouse study will award 3 Science.",
        feedback: [
          { speakerId: "duti", text: "The plants have the light and care they need. We can study the harvest on our final day. We used more energy today to prepare for that." },
        ],
      },
      {
        id: "3B",
        label: "Keep a smaller group of plants growing",
        effects: { energy: -1, oxygen: 0, safety: 0, science: 0 },
        setFlags: { greenhouseMode: "minimum" },
        futureConsequence: "Prepare a smaller harvest and fewer records. The final greenhouse study will award 2 Science.",
        feedback: [
          { speakerId: "duti", text: "We kept a smaller growing area working. We saved some energy, but we will have a smaller harvest and fewer measurements." },
        ],
      },
      {
        id: "3C",
        label: "Shut down the greenhouse and save energy",
        effects: { energy: 0, oxygen: 0, safety: 0, science: 0 },
        setFlags: { greenhouseMode: "off" },
        futureConsequence: "Lose the harvest study. The final report from existing records will award only 1 Science.",
        feedback: [
          { speakerId: "duti", text: "We saved our energy. We will use packaged food during this mission. We cannot expect a new greenhouse harvest, and a future team will need to restart food production." },
        ],
      },
    ],
    scienceCard: {
      title: "Growing food takes time and energy",
      text: "NASA studies how plants grow in space. Our Mars greenhouse is fictional, and its plants were started before this mission. The crew's packaged food lasts through this short mission.",
      sourceIds: ["space-plants"],
    },
    transition: {
      note: "Greenhouse research points are earned only if studied in Scene 6.",
    },
    nextSceneId: "message-from-earth",
  },

  "message-from-earth": {
    id: "message-from-earth",
    sol: 4,
    title: "Message From Earth",
    visualKey: "earth-message",
    story: [
      { speakerId: "narrator", text: "DUTİ notices two possible settings for the research robot outside. The team on Earth could help us choose the more efficient one." },
      { speakerId: "duti", text: "During this mission, a message takes about 20 minutes to reach Earth. The reply needs time to travel back, too. We can wait for help, use our own checklist, or spend this time making more oxygen." },
    ],
    learningGoal: "Earth's support takes time to arrive. Spending more energy cannot make the signal travel faster.",
    choices: [
      {
        id: "4A",
        label: "Ask Earth and wait for a reply",
        effects: { energy: -1, oxygen: -1, safety: 0, science: 0 },
        setFlagsAfterFeedback: { earthGuide: true },
        futureConsequence: "Once the reply arrives, the robot task in Scene 5B will cost 1 Energy instead of 2.",
        feedback: [
          { speakerId: "duti", text: "Message sent. The reply is still on its way." },
          { speakerId: "duti", caption: "Game time fast-forwarded", text: "The reply is here! The signals needed about 40 minutes for the round trip, and the Earth team needed time to prepare their answer. We can run the robot with less energy now. We used some of our life-support reserves while waiting." },
        ],
      },
      {
        id: "4B",
        label: "Take measurements using our own checklist",
        effects: { energy: -1, oxygen: 0, safety: 0, science: 1 },
        futureConsequence: "Complete a local study without unlocking the robot's energy-saving setting.",
        feedback: [
          { speakerId: "duti", text: "We completed our own measurements without waiting for Earth. We still do not know the robot's more efficient setting." },
        ],
      },
      {
        id: "4C",
        label: "Refill our oxygen reserve first",
        effects: { energy: -2, oxygen: 3, safety: 0, science: 0 },
        futureConsequence: "Improve the oxygen reserve, but skip Earth's guidance and this scene's research.",
        feedback: [
          { speakerId: "duti", text: "Our oxygen reserve is stronger. We did not investigate the robot's settings during this time slot. We have more oxygen for the next decision." },
        ],
      },
    ],
    scienceCard: {
      title: "Messages need time to travel",
      text: "The 20-minute delay is a selected value for this fictional mission. Actual Earth–Mars communication delays vary with the planets' positions.",
      sourceIds: ["mars-communication"],
    },
    transition: {},
    nextSceneId: "solar-radiation-alert",
  },

  "solar-radiation-alert": {
    id: "solar-radiation-alert",
    sol: 5,
    title: "Solar Radiation Alert",
    visualKey: "solar-alert",
    story: [
      { speakerId: "narrator", text: "DUTİ's antenna flashes." },
      { speakerId: "duti", text: "Fast particles from the Sun could make it more dangerous to work outside!" },
      { speakerId: "narrator", text: "Radiation is energy or tiny particles that can harm our bodies. The crew can move into the storm shelter. We could also take measurements using the robot outside. One astronaut wants to finish the last outdoor measurement, but staying outside means taking a bigger risk." },
    ],
    learningGoal: "Protecting people, continuing research, and saving energy involve different costs.",
    choices: [
      {
        id: "5A",
        label: "Move the crew into the storm shelter",
        effects: { energy: -1, oxygen: 0, safety: 0, science: 0 },
        setFlags: { stormResponse: "shelter" },
        futureConsequence: "Protect the crew, but stop the outdoor experiment and earn no Science this scene.",
        feedback: [
          { speakerId: "duti", text: "Our crew is in the shelter. We could not finish the outdoor experiment this time. Protecting people came first." },
        ],
        variants: [
          {
            when: { flag: "shelterPrepared", equals: true },
            overrides: { effects: { energy: 0, oxygen: 0, safety: 0, science: 0 } },
          },
        ],
      },
      {
        id: "5B",
        label: "Keep the crew inside and use the robot",
        effects: { energy: -2, oxygen: 0, safety: 0, science: 1 },
        setFlags: { stormResponse: "robot" },
        futureConsequence: "Continue research while the crew stays sheltered, using the robot's energy supply.",
        feedback: [
          { speakerId: "duti", text: "The robot took measurements while our crew stayed inside. Research continued, but we used some of our energy reserve." },
        ],
        variants: [
          {
            when: { flag: "earthGuide", equals: true },
            overrides: { effects: { energy: -1, oxygen: 0, safety: 0, science: 1 } },
          },
        ],
      },
      {
        id: "5C",
        label: "Try to finish the outdoor measurement",
        effects: { energy: -1, oxygen: -1, safety: -4, science: 2 },
        setFlags: { stormResponse: "outside" },
        warning: "High risk: Safety −4. The final outdoor task will become unavailable.",
        futureConsequence: "Gain extra observations, but lose enough safety margin to close the final crewed outdoor task.",
        feedback: [
          { speakerId: "duti", text: "We recorded extra measurements, but exposed our crew to more risk. We no longer have enough safety margin for another crewed outdoor task on the final day." },
        ],
      },
    ],
    scienceCard: {
      title: "Real NASA event: the May 2024 solar storm (archival data, not live)",
      text: "On May 20, 2024, NASA's DONKI space weather database recorded a very fast cloud of material leaving the Sun (a CME). NASA reported that a huge solar storm from that day reached Mars. The Curiosity rover measured its biggest radiation jump since landing: an astronaut standing next to it would have received about as much radiation as 30 chest X-rays. In this game, Safety points are game values, not radiation doses.",
      dataNote: "DONKI describes the CME near the Sun and does not mention Mars. Matching this record to the Mars event by date and direction is our interpretation. The 8,100 microgray figure comes from NASA's article, not from DONKI.",
      sourceIds: ["donki-cme-2024-05-20", "mars-solar-storm-2024"],
    },
    transition: {
      note: "Local sensors confirm that the solar event has subsided before the final task. Safety is not automatically restored.",
    },
    nextSceneId: "final-mission",
  },

  "final-mission": {
    id: "final-mission",
    sol: 6,
    title: "Final Mission",
    visualKey: "final-task",
    story: [
      { speakerId: "narrator", text: "DUTİ opens the final mission card." },
      { speakerId: "duti", text: "Local measurements show that the solar event has subsided. We can choose our last research task." },
      { speakerId: "narrator", text: "The laboratory, exploration route, and greenhouse are waiting. But there is not enough time for all three. The samples you collected and the plants you cared for have changed what we can do today. How will we finish our mission?" },
    ],
    learningGoal: "Earlier decisions change the final mission's options, costs, and research value.",
    choices: [
      {
        id: "6A",
        label: "Complete the laboratory study",
        effects: { energy: -2, oxygen: 0, safety: 0, science: 2 },
        setFlags: { finalTask: "lab" },
        futureConsequence: "Study recorded images and instrument data to finish a smaller laboratory study.",
        feedback: [
          { speakerId: "duti", text: "We combined our images and measurements. We could not learn as much as we could from a physical sample, but we still completed a useful study." },
        ],
        variants: [
          {
            when: { flag: "sampleCollected", equals: true },
            overrides: {
              effects: { energy: -2, oxygen: 0, safety: 0, science: 4 },
              futureConsequence: "Perform a new detailed analysis of the rock collected earlier.",
              feedback: [
                { speakerId: "duti", text: "The rock we saved earlier helped us discover something new today. We completed the next part of our outdoor research!" },
              ],
            },
          },
        ],
      },
      {
        id: "6B",
        label: "Take measurements along a new exploration route",
        effects: { energy: -2, oxygen: -2, safety: 0, science: 5 },
        requirements: { minSafety: 6 },
        setFlags: { finalTask: "field" },
        futureConsequence: "Complete a broader field study using more energy and suit oxygen.",
        feedback: [
          { speakerId: "duti", text: "The new route's measurements are complete! We compared a wider area. This task used more energy and suit oxygen." },
        ],
      },
      {
        id: "6C",
        label: "Prepare a report from existing records",
        effects: { energy: -1, oxygen: 0, safety: 0, science: 1 },
        setFlags: { finalTask: "report" },
        futureConsequence: "Finish a short report without a new harvest. Food production needs restarting.",
        feedback: [
          { speakerId: "duti", text: "We have no new harvest. We used our existing records to prepare a short report. The next team will need to restart the greenhouse." },
        ],
        variants: [
          {
            when: { flag: "greenhouseMode", equals: "full" },
            overrides: {
              label: "Complete the greenhouse study",
              effects: { energy: -1, oxygen: 0, safety: 0, science: 3 },
              setFlags: { finalTask: "greenhouse" },
              futureConsequence: "Harvest the plants and study the detailed records prepared earlier.",
              feedback: [
                { speakerId: "duti", text: "We harvested the plants we kept growing. Our detailed records helped us learn more about producing food in space." },
              ],
            },
          },
          {
            when: { flag: "greenhouseMode", equals: "minimum" },
            overrides: {
              label: "Complete the greenhouse study",
              effects: { energy: -1, oxygen: 0, safety: 0, science: 2 },
              setFlags: { finalTask: "greenhouse" },
              futureConsequence: "Study the smaller harvest and the limited records prepared earlier.",
              feedback: [
                { speakerId: "duti", text: "We harvested our smaller growing area. We used less energy, but had fewer plants and measurements to study." },
              ],
            },
          },
        ],
      },
    ],
    transition: null,
    nextSceneId: null,
  },
};

export const ENDINGS = {
  success: {
    title: "Mission complete, Commander!",
    text: "You kept the base running and reached our research goal. Your earlier choices helped make today's success possible!",
  },
  partial: {
    title: "We kept the base running, but part of our mission goal is unfinished.",
    text: "Review your Science total and safety margin. Which research task could you prepare for earlier next time?",
  },
  failed: {
    title: "We had to stop the mission.",
    text: "Review your choices and try a new plan.",
    reasons: {
      energy: "Our energy reserve ran out.",
      oxygen: "Our oxygen reserve ran out.",
      safety: "Our safety margin ran out.",
      noChoices: "Mission stopped: not enough resources to continue.",
    },
  },
};

export const NASA_SOURCES = {
  "mars-communication": {
    title: "Speaking Percy's Language: How to Talk so Perseverance Will Listen",
    url: "https://science.nasa.gov/blog/speaking-percys-language-how-to-talk-so-perseverance-will-listen/",
    kind: "reference",
  },
  "donki-cme-2024-05-20": {
    title: "NASA DONKI record 2024-05-20T05:36:00-CME-001",
    url: "https://ccmc.gsfc.nasa.gov/DONKI/view/CME/31034/-1",
    kind: "archival-record",
    observationPeriod: "May 20, 2024",
    localData: "data/nasa_events.json",
  },
  "mars-solar-storm-2024": {
    title: "NASA Watches Mars Light Up During Epic Solar Storm",
    url: "https://www.nasa.gov/missions/mars-science-laboratory/curiosity-rover/nasa-watches-mars-light-up-during-epic-solar-storm/",
    kind: "archival-reference",
    observationPeriod: "May 2024 (published June 10, 2024)",
  },
  "meda-pds-bundle": {
    title: "Mars 2020 Perseverance MEDA data (NASA Planetary Data System)",
    url: "https://pds.nasa.gov/ds-view/pds/viewBundle.jsp?identifier=urn:nasa:pds:mars2020_meda",
    kind: "archival-dataset",
    observationPeriod: "Sol 290 (December 13, 2021)",
    localData: "data/meda_jezero.json",
  },
  "space-plants": {
    title: "Growing Plants in Space",
    url: "https://www.nasa.gov/exploration-research-and-technology/growing-plants-in-space/",
    kind: "reference",
  },
};
