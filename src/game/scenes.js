/**
 * English story data for the ten-sol Compass Outpost game (Sols 7–10 and the special endings
 * follow the team's design in data/ten-sol-story-design.json and docs/design/ten-sol-story-plan.md).
 * All numeric effects are game-design assumptions, not NASA measurements.
 * See docs/design/story-plan.md and docs/design/story-data-contract.md before integration.
 * AI-assisted generation/revision: OpenAI ChatGPT/Codex and Anthropic Claude (the ten-sol story and
 * endings were generated with OpenAI ChatGPT/Codex; Claude integrated them into this module).
 * File-level provenance and team attestations: AI_USAGE.md and ai-usage.json.
 */

export const AI_DISCLOSURE = {
  aiAssistanceUsed: true,
  providers: ["OpenAI", "Anthropic"],
  tools: ["ChatGPT", "Codex", "Claude"],
  description: "Story text, code, summaries, and documentation include AI-assisted contributions. NASA observations are attributed separately from fictional game values.",
  detailsDocument: "AI_USAGE.md",
  metadataDocument: "ai-usage.json",
  reviewStatus: "The team attests that it originated the underlying idea; final human review and submission remain the team's responsibility.",
};

export const MISSION = {
  id: "compass-outpost-ten-sols",
  title: "Compass Outpost: Ten Sols of Questions",
  language: "en",
  aiDisclosure: AI_DISCLOSURE,
  creditsCard: {
    title: "Project credits and tools",
    text: "Story and code include AI-assisted contributions from OpenAI ChatGPT/Codex and Anthropic Claude. NASA observations have separate source credits. This project is not endorsed by NASA.",
    detailsDocument: "AI_USAGE.md",
  },
  robot: { id: "duti", displayName: "DUTİ" },
  resourceKeys: ["energy", "oxygen", "safety"],
  resourceBounds: { min: 0, max: 10 },
  scienceTarget: 10,
  successRequirements: { energy: 1, oxygen: 1, safety: 4, science: 10 },

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
      briefing: "Dust is expected after Sol 2, Sol 4 and Sol 8. Supplies are full.",
      dustyAfterScenes: [2, 4, 8],
      startResources: { energy: 8, oxygen: 8, safety: 8 },
    },
    {
      id: "dusty-season",
      title: "Dusty Season",
      briefing: "Dust is expected after Sols 2, 3, 4, 7 and 8. Clean panels will matter more!",
      dustyAfterScenes: [2, 3, 4, 7, 8],
      startResources: { energy: 8, oxygen: 8, safety: 8 },
    },
    {
      id: "small-oxygen-supply",
      title: "Small Oxygen Supply",
      briefing: "Clear skies are expected except after Sol 2 and Sol 8, but the oxygen tanks are not full.",
      dustyAfterScenes: [2, 8],
      startResources: { energy: 8, oxygen: 7, safety: 8 },
    },
  ],
  profileNote: "Mission profiles and dust forecasts are fictional game settings, not measured Mars weather.",

  // Sol 6 is the first research review, not the end. If the mission survives that decision,
  // a sealed reserve compartment opens once (game-design values, not a delivery from Earth).
  checkpoint: {
    afterSol: 6,
    onceFlag: "checkpointSuppliesReleased",
    effects: { energy: 2, oxygen: 4, safety: 0, science: 0 },
    feedback: [
      { speakerId: "narrator", text: "The scheduled compartment opens. The crew connects the stored oxygen supply and charged battery pack. DUTİ checks each new reserve reading." },
      { speakerId: "duti", text: "That completes our first chapter. And that little chime? It has returned. Three notes, a pause, then three notes again. Tomorrow, let us find out what is making it." },
    ],
  },

  // Long-term outcome shown in every ending report (story-plan Rule: greenhouse is not a
  // victory condition, but neglecting food production must have a long-term consequence).
  nextCrewReport: {
    title: "Is the base ready for the next crew?",
    food: {
      full: { status: "ready", text: "Fresh food: ready. The greenhouse is growing well for the next crew." },
      minimum: { status: "limited", text: "Fresh food: limited. The next crew will need to grow more plants." },
      off: { status: "at-risk", text: "Fresh food: at risk. The greenhouse is off, so the next crew must restart it and rely on packaged food for longer." },
    },
    livingTray: { text: "Living plant tray: protected, with its care notes, for the next crew." },
    safety: {
      ready: { minSafety: 6, text: "Current crew safety margin: good." },
      low: { text: "Current crew safety margin: low. Review protection procedures before further outdoor work." },
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
      signalMethod: null,
      capsuleMode: null,
      broadcastMode: null,
      finalAction: null,
      checkpointSuppliesReleased: false,
    },
    history: [],
    status: "playing",
  },
  openingCard: {
    title: "Commander, Compass Outpost is counting on you!",
    text: "Keep the base running for ten sols and earn at least 10 Science Points. Watch your oxygen and energy, and protect your crew. You may not have enough time or supplies to do everything. You decide what comes first!",
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
  "the-three-note-mystery",
  "the-drawer-marked-tomorrow",
  "two-stories-one-signal",
  "a-light-for-who-comes-next",
];

export const SCENES = {
  "welcome-to-mars": {
    id: "welcome-to-mars",
    sol: 1,
    title: "Welcome to Mars",
    visualKey: "outpost-arrival",
    story: [
      { speakerId: "narrator", text: "Red hills fill the window of Compass Outpost. Two astronauts wave from the airlock. Beside them, a small robot holds a badge almost as wide as its face." },
      { speakerId: "duti", text: "Welcome, Commander! I am DUTİ. Ten sols, one outpost, and a whole notebook of questions. Our first research review is on Sol 6. After that, we prepare our discoveries for the next crew." },
      { speakerId: "narrator", text: "DUTİ draws an empty dot in its notebook. Outside, dusty panels need attention. Inside, the storm shelter still needs supplies." },
      { speakerId: "duti", text: "What should we prepare first? Small choices can leave very long trails." },
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
        futureConsequence: "Moving into the shelter on Sol 5 will cost 0 Energy instead of 1. The panels remain unserviced.",
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
      { speakerId: "narrator", text: "A battery light blinks. Beyond the window, a striped rock catches the morning light. DUTİ turns off one screen to keep the important systems running." },
      { speakerId: "duti", text: "We cannot power every job at once. We can make oxygen, collect that rock, or study the measurements we already have indoors." },
      { speakerId: "narrator", text: "The rock is interesting, but the oxygen tank matters too. DUTİ leaves a blank space in the notebook: What could we learn if we saved something for later?" },
    ],
    learningGoal: "Research, life support, and outside work share a limited resource budget.",
    scienceCard: {
      title: "Real NASA data: Mars nights are very cold",
      text: "NASA's Perseverance rover measured the air in Jezero Crater on Sol 290 (December 13, 2021). The warmest reading was about −3 °C and the coldest was about −77 °C. A Mars base needs batteries and heaters when the Sun goes down. Our dust and recharge values are game values.",
      dataNote: "Recorded sample minimum/maximum of calibrated MEDA air temperature sensor 1 for the selected sol, rounded. The summary uses a simple plausibility filter; additional instrument quality flags are not applied. It is not a global climate or dust measurement. The game's dust forecast is fictional.",
      sourceIds: ["meda-pds-bundle"],
    },
    choices: [
      {
        id: "2A",
        label: "Produce more oxygen",
        effects: { energy: -2, oxygen: 3, safety: 0, science: 0 },
        futureConsequence: "Build the oxygen reserve, but skip today's research.",
        feedback: [
          { speakerId: "duti", text: "The oxygen system has filled more of our reserve. We have more breathing supplies, but our research will have to wait." },
        ],
      },
      {
        id: "2B",
        label: "Collect a rock sample outside",
        effects: { energy: -1, oxygen: -2, safety: 0, science: 2 },
        setFlags: { sampleCollected: true },
        futureConsequence: "The Sol 6 laboratory study will award 4 Science instead of 2.",
        feedback: [
          { speakerId: "duti", text: "The sample is here! We recorded observations outside. At the Sol 6 research review, we can study the rock more closely in the lab. We used some of our suit oxygen." },
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
      { speakerId: "narrator", text: "A leaf taps the greenhouse window. These plants were growing before your team arrived. One tray is almost ready to harvest; another still has much to do." },
      { speakerId: "duti", text: "The lights use energy. We can care for all the experiment plants, keep a smaller group, or switch the greenhouse off and use our packaged food." },
      { speakerId: "narrator", text: "On a shelf sits an empty seed box labeled NEXT CREW. Nothing goes inside it yet." },
      { speakerId: "duti", text: "A future is a little like a garden. Somebody has to begin looking after it before it arrives." },
    ],
    learningGoal: "Growing food takes time and energy. Stored food and future food production serve different needs.",
    choices: [
      {
        id: "3A",
        label: "Keep the full experiment shelf running",
        effects: { energy: -2, oxygen: 0, safety: 0, science: 0 },
        setFlags: { greenhouseMode: "full" },
        futureConsequence: "Prepare a harvest and detailed growth records. The Sol 6 greenhouse study will award 3 Science.",
        feedback: [
          { speakerId: "duti", text: "The plants have the light and care they need. We can study the harvest at the Sol 6 research review. We used more energy today to prepare for that." },
        ],
      },
      {
        id: "3B",
        label: "Keep a smaller group of plants growing",
        effects: { energy: -1, oxygen: 0, safety: 0, science: 0 },
        setFlags: { greenhouseMode: "minimum" },
        futureConsequence: "Prepare a smaller harvest and fewer records. The Sol 6 greenhouse study will award 2 Science.",
        feedback: [
          { speakerId: "duti", text: "We kept a smaller growing area working. We saved some energy, but we will have a smaller harvest and fewer measurements." },
        ],
      },
      {
        id: "3C",
        label: "Shut down the greenhouse and save energy",
        effects: { energy: 0, oxygen: 0, safety: 0, science: 0 },
        setFlags: { greenhouseMode: "off" },
        futureConsequence: "Lose the harvest study. The Sol 6 report from existing records will award only 1 Science.",
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
      note: "Greenhouse research points are earned only if studied on Sol 6.",
    },
    nextSceneId: "message-from-earth",
  },

  "message-from-earth": {
    id: "message-from-earth",
    sol: 4,
    title: "Message From Earth",
    visualKey: "earth-message",
    story: [
      { speakerId: "narrator", text: "An Earth message window opens beside the rover controls. DUTİ has found two possible settings, but does not know which uses less energy." },
      { speakerId: "duti", text: "For our fictional mission today, a signal takes about twenty minutes each way. We can ask Earth and wait, use our checklist, or refill oxygen while we have the chance." },
      { speakerId: "narrator", text: "Beside the message window, an old equipment list shows a tiny lantern symbol. DUTİ saves the page without knowing why it feels familiar." },
      { speakerId: "duti", text: "A reply can help us think. It cannot skip the journey between the planets." },
    ],
    learningGoal: "Earth's support takes time to arrive. Spending more energy cannot make the signal travel faster.",
    choices: [
      {
        id: "4A",
        label: "Ask Earth and wait for a reply",
        effects: { energy: -1, oxygen: -1, safety: 0, science: 0 },
        setFlagsAfterFeedback: { earthGuide: true },
        futureConsequence: "Once the reply arrives, the robot task on Sol 5 will cost 1 Energy instead of 2.",
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
        futureConsequence: "Improve the oxygen reserve, but skip Earth's guidance and today's research.",
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
      { speakerId: "narrator", text: "The outdoor-work light changes to a warning symbol. DUTİ opens the shelter map. The crew can stay inside while the robot takes measurements, or pause research and move into the shelter." },
      { speakerId: "duti", text: "Our sensors warn of increased solar-particle risk. Protecting people comes first. An astronaut could try to finish outside, but that would use oxygen and greatly reduce our safety margin." },
      { speakerId: "narrator", text: "A faint three-note chime appears in a saved equipment log. There is no urgent message attached. DUTİ marks it: investigate later, when the crew is safe." },
    ],
    learningGoal: "Protecting people, continuing research, and saving energy involve different costs.",
    choices: [
      {
        id: "5A",
        label: "Move the crew into the storm shelter",
        effects: { energy: -1, oxygen: 0, safety: 0, science: 0 },
        setFlags: { stormResponse: "shelter" },
        futureConsequence: "Protect the crew, but stop the outdoor experiment and earn no Science today.",
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
        warning: "High risk: Safety −4. The Sol 6 outdoor task will become unavailable.",
        futureConsequence: "Gain extra observations, but lose enough safety margin to close the Sol 6 crewed outdoor task.",
        feedback: [
          { speakerId: "duti", text: "We recorded extra measurements, but exposed our crew to more risk. We no longer have enough safety margin for another crewed outdoor task on Sol 6." },
        ],
      },
    ],
    scienceCard: {
      title: "Real NASA event: the May 2024 solar storm (archival data, not live)",
      text: "NASA's DONKI database recorded a fast cloud leaving the Sun on May 20, 2024. Separately, NASA reported a large radiation event at Mars that day. These records help us explore why astronauts need protection. Our Safety points are fictional game values.",
      dataNote: "DONKI record 2024-05-20T05:36:00-CME-001 describes a near-Sun CME; its listed impact forecasts do not identify Mars. This project has not established an event-level match to the Mars article. The article reports 8,100 micrograys for a hypothetical astronaut beside Curiosity, independently of the DONKI record. No dose-to-Safety conversion is made.",
      sourceIds: ["donki-cme-2024-05-20", "mars-solar-storm-2024"],
    },
    transition: {
      note: "Local sensors confirm that the solar event has subsided before the research review. Safety is not automatically restored.",
    },
    nextSceneId: "final-mission",
  },

  "final-mission": {
    id: "final-mission",
    sol: 6,
    title: "The First Research Review",
    visualKey: "final-task",
    story: [
      { speakerId: "narrator", text: "Local sensors show that the fictional solar event has subsided. DUTİ places three research cards on the desk: laboratory, exploration route, and greenhouse." },
      { speakerId: "duti", text: "First research review! The rock you saved, the plants you cared for, and the supplies you kept have changed what we can do. We have time for one study today." },
      { speakerId: "narrator", text: "A sealed reserve compartment is scheduled to open after the review. Its oxygen supplies and charged battery pack were stored here before your arrival." },
      { speakerId: "duti", text: "Which study shall we complete? Then we can prepare our discoveries for the next crew. There are still four sols of questions ahead." },
    ],
    learningGoal: "Earlier decisions change the research review's options, costs, and research value.",
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
    transition: {},
    nextSceneId: "the-three-note-mystery",
  },

  "the-three-note-mystery": {
    id: "the-three-note-mystery",
    sol: 7,
    title: "The Three-Note Mystery",
    visualKey: "signal-desk",
    story: [
      { speakerId: "narrator", text: "Beep. Beep-beep. The desk speaker goes quiet. Then the same three notes return. DUTİ rolls closer, holding a spoon as if it were a listening horn." },
      { speakerId: "duti", text: "I tried asking it a question. It kept beeping. That is not a very useful answer." },
      { speakerId: "narrator", text: "On the screen, the pattern sits beside your old notes. It might come from nearby equipment. It might become clearer if you compare it with your measurements. A rover could look for its source without sending anyone outside." },
      { speakerId: "duti", text: "We have a question, not an answer. Shall we study the pattern, follow the signal, or check the old equipment logs while we refill oxygen?" },
    ],
    learningGoal: "Compare possible explanations before calling a repeating pattern a discovery.",
    choices: [
      {
        id: "7A",
        label: "Compare the three-note pattern",
        effects: { energy: -1, oxygen: 0, safety: 0, science: 1 },
        setFlags: { signalMethod: "pattern" },
        futureConsequence: "Keep a careful pattern record for the evidence comparison on Sol 9; an earlier rock study may make that comparison special.",
        feedback: [
          { speakerId: "duti", text: "I saved the pattern beside our measurements. Matching shapes can be a clue, but they do not explain themselves." },
        ],
      },
      {
        id: "7B",
        label: "Follow the signal with the rover",
        effects: { energy: -2, oxygen: 0, safety: 0, science: 2 },
        setFlags: { signalMethod: "relay" },
        futureConsequence: "Locate an old survey relay without sending an astronaut outside. Earlier Earth guidance reduces this task to 1 Energy.",
        feedback: [
          { speakerId: "duti", text: "The rover found an old survey relay behind a ridge. A lantern symbol is painted on its case. This is equipment, not a visitor!" },
        ],
        variants: [
          {
            when: { flag: "earthGuide", equals: true },
            overrides: { effects: { energy: -1, oxygen: 0, safety: 0, science: 2 } },
          },
        ],
      },
      {
        id: "7C",
        label: "Read the equipment logs and refill oxygen",
        effects: { energy: -1, oxygen: 2, safety: 0, science: 0 },
        setFlags: { signalMethod: "logs" },
        futureConsequence: "Build the oxygen reserve and find the relay inventory entry, but miss today's new signal measurements.",
        feedback: [
          { speakerId: "duti", text: "The logs list a survey relay with a three-note test signal. We have a possible explanation and more oxygen. We have not measured where it is." },
        ],
      },
    ],
    transition: {},
    nextSceneId: "the-drawer-marked-tomorrow",
  },

  "the-drawer-marked-tomorrow": {
    id: "the-drawer-marked-tomorrow",
    sol: 8,
    title: "The Drawer Marked Tomorrow",
    visualKey: "tomorrow-drawer",
    story: [
      { speakerId: "narrator", text: "A routine store-room check reveals a drawer labeled TOMORROW. DUTİ cannot resist reading the smaller print: For whoever asks the next good question." },
      { speakerId: "duti", text: "Inside: an insulated plant tray, a spare recorder part, and a survey cassette. We can finish one careful job with our work time today." },
      { speakerId: "narrator", text: "If you kept plants growing, a living tray can be protected for the next crew. The recorder part could restore DUTİ's missing notebook pictures. The cassette could explain who left the relay outside." },
      { speakerId: "duti", text: "Three ways to save something. Which kind of tomorrow should we prepare?" },
    ],
    learningGoal: "Stored materials and records can carry earlier work forward, but preparation has opportunity costs.",
    choices: [
      {
        id: "8A",
        label: "Protect a living plant tray",
        effects: { energy: -2, oxygen: 0, safety: 0, science: 1 },
        requiresAnyChoice: ["3A","3B"],
        unavailableReason: "The greenhouse was shut down on Sol 3. No living experiment tray remains to protect.",
        setFlags: { capsuleMode: "garden" },
        futureConsequence: "Preserve plants already growing before arrival and their care notes. This can support a living-garden ending after the Sol 6 greenhouse study.",
        feedback: [
          { speakerId: "duti", text: "The living tray is protected, and its care instructions are ready. These are plants we kept growing, not seeds that grew overnight." },
        ],
      },
      {
        id: "8B",
        label: "Restore DUTİ's notebook pictures",
        effects: { energy: -1, oxygen: 0, safety: 0, science: 1 },
        setFlags: { capsuleMode: "memory" },
        futureConsequence: "Recover DUTİ's saved pictures of earlier preparations. Spare supplies organized in 1B reduce this cost to 0 Energy.",
        feedback: [
          { speakerId: "duti", text: "My pictures are back! A packed shelter. A crew working together. I had saved the ordinary moments, too." },
        ],
        variants: [
          {
            when: { flag: "shelterPrepared", equals: true },
            overrides: { effects: { energy: 0, oxygen: 0, safety: 0, science: 1 } },
          },
        ],
      },
      {
        id: "8C",
        label: "Open the survey cassette",
        effects: { energy: -1, oxygen: 0, safety: 0, science: 2 },
        setFlags: { capsuleMode: "archive" },
        futureConsequence: "Recover a fictional older crew's relay-test log. Combine it with a located relay to investigate a network of instruments.",
        feedback: [
          { speakerId: "duti", text: "The cassette says the three notes are a test call from an old survey network. There may be more stations than the one in our equipment list." },
        ],
      },
    ],
    transition: {},
    nextSceneId: "two-stories-one-signal",
  },

  "two-stories-one-signal": {
    id: "two-stories-one-signal",
    sol: 9,
    title: "Two Stories, One Signal",
    visualKey: "evidence-table",
    story: [
      { speakerId: "narrator", text: "A routine receiver check identifies the three-note call as an equipment test, even if you did not locate its source. Your notes cover the table. DUTİ lays two cards beside them: WHAT WE OBSERVED and WHAT WE STILL WONDER." },
      { speakerId: "duti", text: "The three notes are from survey equipment. That part is no longer a mystery. But what should our next message help somebody discover?" },
      { speakerId: "narrator", text: "You could compare the records to build an evidence report. You could record the crew's story alongside your measurements. Or you could use the work slot to maintain life support while a simple computer check finishes." },
      { speakerId: "duti", text: "A good ending does not need every answer. It needs us to be honest about the answers we have." },
    ],
    learningGoal: "Separate observations from explanations, and label what remains uncertain.",
    choices: [
      {
        id: "9A",
        label: "Compare the evidence and mark open questions",
        effects: { energy: -1, oxygen: 0, safety: 0, science: 2 },
        setFlags: { broadcastMode: "evidence" },
        futureConsequence: "Connect the rock/pattern investigation or the relay/cassette investigation. Do not add a discovery that the actual history does not support.",
        feedback: [
          { speakerId: "duti", text: "Our report separates measurements from guesses. If two things look alike, we say they look alike; we do not claim that proves what caused them." },
        ],
      },
      {
        id: "9B",
        label: "Record the crew's story",
        effects: { energy: -1, oxygen: 0, safety: 0, science: 1 },
        setFlags: { broadcastMode: "crew" },
        futureConsequence: "Save voices and captions about the choices actually made. Restored DUTİ pictures can turn this into a special farewell.",
        feedback: [
          { speakerId: "duti", text: "We recorded what happened here, including the jobs that earned no Science Points. I put my smallest beep at the end." },
        ],
      },
      {
        id: "9C",
        label: "Maintain life support during the record check",
        effects: { energy: -2, oxygen: 3, safety: 0, science: 0 },
        setFlags: { broadcastMode: "systems" },
        futureConsequence: "Build oxygen reserves before the last sol. Keep existing records, but skip today's detailed comparison and crew recording.",
        feedback: [
          { speakerId: "duti", text: "Our oxygen reserve is stronger. The computer checked the files for readable data, but it did not do the deeper comparison or record our crew story." },
        ],
      },
    ],
    transition: {},
    nextSceneId: "a-light-for-who-comes-next",
  },

  "a-light-for-who-comes-next": {
    id: "a-light-for-who-comes-next",
    sol: 10,
    title: "A Light for Who Comes Next",
    visualKey: "outpost-last-evening",
    story: [
      { speakerId: "narrator", text: "The last planned sol arrives. Compass Outpost is quiet, but not empty: your notes are on the table, your work is in the rooms, and DUTİ has saved a place for the mission's final page." },
      { speakerId: "duti", text: "Ten sols ago, we had a blank notebook. Look at it now." },
      { speakerId: "narrator", text: "One work slot remains. You can send a focused evidence packet to Earth, prepare a handover capsule for the next crew, or leave a welcome message in the outpost. What appears on the final page will depend on the trail you followed." },
      { speakerId: "duti", text: "We do not have to leave every kind of treasure. We can leave the one we took the time to make." },
    ],
    learningGoal: "Communicate discoveries and uncertainty, and recognize that a mission can leave different kinds of useful legacy.",
    choices: [
      {
        id: "10A",
        label: "Send our evidence packet to Earth",
        effects: { energy: -1, oxygen: 0, safety: 0, science: 1 },
        setFlags: { finalAction: "transmit" },
        futureConsequence: "Can reveal the rock-pattern or relay-network ending when the matching earlier investigation is complete. Acknowledge transmission locally; no instant Earth reply.",
        feedback: [
          { speakerId: "duti", text: "Packet sent. Earth will receive it after the signal travel time. Let us look at the story our choices made." },
        ],
      },
      {
        id: "10B",
        label: "Prepare the next crew's handover capsule",
        effects: { energy: -1, oxygen: 0, safety: 0, science: 1 },
        setFlags: { finalAction: "capsule" },
        futureConsequence: "With the greenhouse study and a protected living tray, leave a garden handover. Otherwise leave only the actual records and materials collected.",
        feedback: [
          { speakerId: "duti", text: "The handover capsule is labeled with exactly what we saved. No imaginary harvests. No missing instructions. A real beginning for the next crew." },
        ],
      },
      {
        id: "10C",
        label: "Leave a welcome message in the outpost",
        effects: { energy: 0, oxygen: 0, safety: 0, science: 0 },
        setFlags: { finalAction: "welcome" },
        futureConsequence: "A no-extra-cost final action. Restored pictures and a crew recording can reveal DUTİ's special memory-map farewell.",
        feedback: [
          { speakerId: "duti", text: "Welcome, next Commander. We left our questions where you can find them. DUTİ adds one final dot to the notebook." },
        ],
      },
    ],
    transition: null,
    nextSceneId: null,
  },
};

export const ENDINGS = {
  success: {
    title: "A Notebook Full of Questions",
    text: "Ten sols complete. You protected the crew and reached the research target. Your notebook holds the discoveries you actually made, and open questions for the next crew. DUTİ closes the cover, then leaves a pencil tucked inside.",
    replayHint: "Would a different trail of choices leave a different last page?",
  },
  partial: {
    title: "One More Question",
    text: "You reached the last page, but part of the research or safety goal remains unfinished. Your completed work still matters. DUTİ marks one place to prepare differently next time.",
    replayHint: "Which earlier preparation might give your next mission more room to explore?",
  },
  failed: {
    title: "A Safe Pause",
    text: "DUTİ helps the team stop work and begin the base's emergency procedures. Our research mission is paused.",
    replayHint: "We can try another plan. Which reserve needed help earlier?",
    reasons: {
      energy: "Our energy reserve ran out.",
      oxygen: "Our oxygen reserve ran out.",
      safety: "Our safety margin ran out.",
      noChoices: "Mission stopped: not enough resources to continue.",
    },
  },
};

/**
 * Special endings (team design, generated with OpenAI ChatGPT/Codex; the fifth, fictional
 * "Visitors" ending follows docs/design/ten-sol-story-plan.md). Shown only after a
 * successful Sol 10 when this run's history matches. They grant no resources or Science.
 * Story-world inventions only: no real NASA discovery is claimed (see scienceBoundary).
 */
export const SPECIAL_ENDINGS = [
  {
    id: "the-stone-that-kept-time",
    title: "The Stone That Kept Time",
    priority: 1,
    allChoices: [
      "2B",
      "6A",
      "7A",
      "9A",
      "10A"
    ],
    anyChoiceGroups: [],
    story: [
      {
        speakerId: "narrator",
        text: "Your close-up rock images fill the screen. Beside them sit the measurements you carefully compared. The repeating signal did not come from the stone: it came from equipment. But following the pattern made you look at the stone in a new way."
      },
      {
        speakerId: "duti",
        text: "These stripes may record different chapters in how the rock formed. We have a question worth testing, and a sample ready for another scientist to study."
      },
      {
        speakerId: "narrator",
        text: "You label the packet: A question kept safe inside a stone. DUTİ adds a little clock beside the sample box. The screen shows SENT, not ANSWER RECEIVED."
      }
    ],
    evidence: [
      "You saved a physical sample on Sol 2.",
      "You studied it in the laboratory on Sol 6.",
      "You compared patterns and evidence before sending your report."
    ],
    replayHint: "A small thing saved early can become a much bigger question later.",
    scienceBoundary: "Fictional research lead only. No confirmed rock age, water history, living organism, or NASA discovery is asserted."
  },
  {
    id: "the-smallest-garden",
    title: "The Smallest Garden on Mars",
    priority: 2,
    allChoices: [
      "6C",
      "8A",
      "10B"
    ],
    anyChoiceGroups: [
      [
        "3A",
        "3B"
      ]
    ],
    story: [
      {
        speakerId: "narrator",
        text: "Inside the handover case, a protected tray holds plants your team kept alive. Beside it are the greenhouse measurements, care instructions, and a blank page labeled NEXT OBSERVATION."
      },
      {
        speakerId: "duti",
        text: "We did not grow a whole farm. We kept one careful experiment going. Somebody else can ask the next question."
      },
      {
        speakerId: "narrator",
        text: "DUTİ slips the once-empty seed box onto the shelf beside the tray. Its label now reads: A garden is also a promise to look after something. The next page belongs to another crew."
      }
    ],
    evidence: [
      "You kept a full or smaller greenhouse operating.",
      "You completed its study on Sol 6.",
      "You protected a living tray and prepared its handover."
    ],
    replayHint: "Some discoveries need care long before the final day.",
    scienceBoundary: "The tray was already growing before arrival. It is not a new ten-sol seed-to-harvest claim, a food-independent colony, or an oxygen supply."
  },
  {
    id: "dutis-secret-constellation",
    title: "DUTİ's Secret Constellation",
    priority: 3,
    allChoices: [
      "1B",
      "5A",
      "8B",
      "9B",
      "10C"
    ],
    anyChoiceGroups: [],
    story: [
      {
        speakerId: "narrator",
        text: "DUTİ dims its screen. Small dots appear: the shelter you prepared, the room where the crew waited safely, and the desk where you restored its pictures. Thin lines join them into the outline of a little bear."
      },
      {
        speakerId: "duti",
        text: "It is not a real constellation. It is my map of when we looked after one another. I was saving it for the last page."
      },
      {
        speakerId: "narrator",
        text: "Your crew recording begins. Behind the voices is DUTİ's smallest beep. You leave the map beside the welcome message, where the next Commander will find it."
      },
      {
        speakerId: "duti",
        text: "We measured a lot of things. Thank you for remembering the people doing the measuring."
      }
    ],
    evidence: [
      "You prepared the shelter and used it during the alert.",
      "You restored DUTİ's pictures.",
      "You recorded the crew and left a welcome message."
    ],
    replayHint: "Not every important moment earns a Science Point.",
    scienceBoundary: "A fictional memory-map image, not a real astronomical constellation or a claim that DUTİ is a living being."
  },
  {
    id: "the-lantern-network",
    title: "The Lantern Network",
    priority: 4,
    allChoices: [
      "1A",
      "4A",
      "5B",
      "7B",
      "8C",
      "9A",
      "10A"
    ],
    anyChoiceGroups: [],
    story: [
      {
        speakerId: "narrator",
        text: "The rover location and survey cassette finally fit together. One lantern symbol becomes several on the old map. Your careful comparison identifies the three-note call as a test message used by a fictional survey network."
      },
      {
        speakerId: "duti",
        text: "Our panel work helped the power budget. Earth helped us use the robot efficiently. Then we kept the crew inside and let our machines investigate. Those choices brought these pieces together."
      },
      {
        speakerId: "narrator",
        text: "Your packet contains the relay location, the cassette log, and the questions still untested. Farther along the old map are other marked stations. No one claims they are working yet."
      },
      {
        speakerId: "duti",
        text: "One signal answered. A whole map of questions left to ask."
      }
    ],
    evidence: [
      "You serviced the panels and received Earth's guidance.",
      "You used the robot during the alert and later located the relay.",
      "You opened the cassette, compared the evidence, and sent the packet."
    ],
    replayHint: "A useful reply, a careful preparation, and a machine doing the risky work can belong to the same story.",
    scienceBoundary: "The older crew, survey network, cassette, and relay are fictional story props, not real NASA assets or an operational Mars network."
  },
  {
    id: "the-visitors-beyond-the-window",
    title: "The Visitors Beyond the Window",
    priority: 5,
    allChoices: [
      "2C",
      "5B",
      "7C",
      "8C",
      "9A",
      "10A"
    ],
    anyChoiceGroups: [],
    fiction: true,
    fictionLabel: "Fictional science-fiction ending",
    fictionNote: "This encounter is fictional. No extraterrestrial life has been confirmed.",
    pages: [
      {
        title: "The light returns",
        story: [
          {
            speakerId: "narrator",
            text: "Beyond the glass, something silver unfolds like a tiny flower. Two small figures stand beside it on the ridge."
          },
          {
            speakerId: "duti",
            text: "Those are not our survey robots."
          }
        ]
      },
      {
        title: "A very small hello",
        story: [
          {
            speakerId: "narrator",
            text: "One visitor raises a hand with four long fingers. DUTİ raises its little metal paw. For a moment, nobody moves."
          },
          {
            speakerId: "duti",
            text: "I have practised many greetings. Somehow, I forgot all of them."
          }
        ]
      },
      {
        title: "The page we left open",
        story: [
          {
            speakerId: "narrator",
            text: "DUTİ holds the notebook to the window, open at UNKNOWN LIGHTS. The visitor points toward the sky, then gently toward the notebook."
          },
          {
            speakerId: "duti",
            text: "I do not know what that means. But I think we have another question."
          }
        ]
      },
      {
        title: "Beyond the ridge",
        story: [
          {
            speakerId: "narrator",
            text: "The figures return to their silver craft. It lifts beyond the ridge, quiet behind the thick window. One pale light remains, then fades."
          },
          {
            speakerId: "duti",
            text: "We kept looking carefully. And this story became bigger than our notebook."
          }
        ]
      },
      {
        title: "A new beginning",
        story: [
          {
            speakerId: "narrator",
            text: "Beneath the final entry, DUTİ draws a small waving paw. Then it turns to a fresh page."
          },
          {
            speakerId: "duti",
            text: "If someone out there keeps a notebook too... what do you think they wrote about us?"
          }
        ]
      }
    ],
    story: [
      {
        speakerId: "narrator",
        text: "Beyond the glass, something silver unfolds like a tiny flower. Two small figures stand beside it on the ridge."
      },
      {
        speakerId: "duti",
        text: "Those are not our survey robots."
      },
      {
        speakerId: "narrator",
        text: "One visitor raises a hand with four long fingers. DUTİ raises its little metal paw. For a moment, nobody moves."
      },
      {
        speakerId: "duti",
        text: "I have practised many greetings. Somehow, I forgot all of them."
      },
      {
        speakerId: "narrator",
        text: "DUTİ holds the notebook to the window, open at UNKNOWN LIGHTS. The visitor points toward the sky, then gently toward the notebook."
      },
      {
        speakerId: "duti",
        text: "I do not know what that means. But I think we have another question."
      },
      {
        speakerId: "narrator",
        text: "The figures return to their silver craft. It lifts beyond the ridge, quiet behind the thick window. One pale light remains, then fades."
      },
      {
        speakerId: "duti",
        text: "We kept looking carefully. And this story became bigger than our notebook."
      },
      {
        speakerId: "narrator",
        text: "Beneath the final entry, DUTİ draws a small waving paw. Then it turns to a fresh page."
      },
      {
        speakerId: "duti",
        text: "If someone out there keeps a notebook too... what do you think they wrote about us?"
      }
    ],
    evidence: [
      "You saved the indoor camera record on Sol 2 and the robot view on Sol 5.",
      "You checked equipment logs on Sol 7 and preserved the cassette picture on Sol 8.",
      "You compared observations without claiming proof, then shared the report on Sol 10."
    ],
    journalSummary: "You kept the pictures, checked the equipment, compared the records and shared what remained unknown. In this fictional ending, the last look through the window revealed friendly visitors.",
    replayHint: "What other questions might a different trail leave in DUTİ's notebook?",
    scienceBoundary: "Fictional science-fiction epilogue. The lights, pictures, visitors and craft are invented story elements. No extraterrestrial life has been confirmed, and no NASA discovery is claimed."
  }
];

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
    localData: "data/nasa-events.json",
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
    localData: "data/meda-jezero.json",
  },
  "moxie-2023": {
    title: "NASA's Oxygen-Generating Experiment MOXIE Completes Mars Mission",
    url: "https://www.nasa.gov/missions/mars-2020-perseverance/perseverance-rover/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/",
    kind: "archival-reference",
    observationPeriod: "2021–2023 (published September 6, 2023)",
  },
  "mars-facts": {
    title: "Mars: Facts",
    url: "https://science.nasa.gov/mars/facts/",
    kind: "reference",
  },
  "perseverance-samples": {
    title: "Mars Rock Samples (Perseverance)",
    url: "https://science.nasa.gov/mission/mars-2020-perseverance/mars-rock-samples/",
    kind: "reference",
  },
  "mars-sunset": {
    title: "Sunset in Mars' Gale Crater",
    url: "https://science.nasa.gov/resource/sunset-in-mars-gale-crater/",
    kind: "archival-reference",
    observationPeriod: "Sol 956 (April 15, 2015)",
  },
  "space-plants": {
    title: "Growing Plants in Space",
    url: "https://www.nasa.gov/exploration-research-and-technology/growing-plants-in-space/",
    kind: "reference",
  },
};
