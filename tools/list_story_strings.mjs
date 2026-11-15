// AI-assisted generation: Anthropic Claude. See AI_USAGE.md and ai-usage.json.
// Lists every player-visible English string in the scene module, in a stable order.
import { MISSION, SCENE_ORDER, SCENES, ENDINGS, SPECIAL_ENDINGS, NASA_SOURCES } from "../src/game/scenes.js";

export function collectStoryStrings() {
  const out = [];
  const add = text => { if (typeof text === "string" && text && !out.includes(text)) out.push(text); };
  const blocks = list => (list ?? []).forEach(block => { add(block.caption); add(block.text); });
  const choiceText = item => { add(item.label); add(item.warning); add(item.futureConsequence); add(item.unavailableReason); blocks(item.feedback); };

  add(MISSION.title);
  add(MISSION.creditsCard.title); add(MISSION.creditsCard.text);
  add(MISSION.openingCard.title); add(MISSION.openingCard.text); add(MISSION.openingCard.glossary);
  Object.values(MISSION.messages).forEach(add);
  MISSION.profiles.forEach(profile => { add(profile.title); add(profile.briefing); });
  add(MISSION.profileNote);
  add(MISSION.nextCrewReport.title);
  Object.values(MISSION.nextCrewReport.food).forEach(item => add(item.text));
  Object.values(MISSION.nextCrewReport.safety).forEach(item => add(item.text));
  add(MISSION.nextCrewReport.livingTray?.text);
  blocks(MISSION.checkpoint?.feedback);
  for (const id of SCENE_ORDER) {
    const scene = SCENES[id];
    add(scene.title); blocks(scene.story); add(scene.learningGoal);
    if (scene.scienceCard) { add(scene.scienceCard.title); add(scene.scienceCard.text); add(scene.scienceCard.dataNote); }
    for (const choice of scene.choices) {
      choiceText(choice);
      (choice.variants ?? []).forEach(variant => choiceText(variant.overrides));
    }
    add(scene.transition?.note);
  }
  for (const ending of Object.values(ENDINGS)) {
    add(ending.title); add(ending.text); add(ending.replayHint);
    Object.values(ending.reasons ?? {}).forEach(add);
  }
  for (const ending of SPECIAL_ENDINGS) {
    add(ending.title); blocks(ending.story); (ending.evidence ?? []).forEach(add); add(ending.replayHint); add(ending.scienceBoundary);
  }
  Object.values(NASA_SOURCES).forEach(source => { add(source.title); add(source.observationPeriod); });
  return out;
}

if (process.argv[1]?.endsWith("list_story_strings.mjs")) {
  collectStoryStrings().forEach((text, index) => console.log(`${index + 1}\t${text}`));
}
