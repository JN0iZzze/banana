import type { JsonSlideDocument } from './jsonSlideTypes';
import { parseJsonSlideDocument } from './parseJsonSlideDocument';
import rawAsymmetric from './decks/main/schemas/demo-grid-asymmetric.json';
import rawBento from './decks/main/schemas/demo-grid-bento.json';
import rawHeroJourneyBento from './decks/main/schemas/slide-demo-hero-journey-bento.json';
import rawEqual from './decks/main/schemas/demo-grid-equal.json';
import rawAttentionModels from './decks/main/schemas/slide-attention-models-2026.json';
import rawNanoBananaUseCases from './decks/main/schemas/slide-nano-banana-use-cases.json';
import rawMidjourneyVsNanoBanana from './decks/main/schemas/slide-midjourney-vs-nano-banana.json';
import rawPlatformsEcosystem from './decks/main/schemas/slide-platforms-ecosystem.json';
import rawPromptStructure from './decks/main/schemas/slide-prompt-structure.json';
import rawEditingPromptStructure from './decks/main/schemas/slide-editing-prompt-structure.json';
import rawHighsfield from './decks/main/schemas/slide-higgsfield.json';
import rawNodeBasedSystems from './decks/main/schemas/slide-node-based-systems.json';
import rawFlouxDemo from './decks/main/schemas/slide-floux-demo.json';
import rawAgenticWorkflowResult from './decks/main/schemas/slide-agentic-workflow-result.json';
import rawAgenticWorkflow from './decks/main/schemas/slide-agentic-workflow.json';
import rawPromptOrderPairImages from './decks/main/schemas/slide-prompt-order-pair-images.json';
import rawEditingPromptPrinciples from './decks/main/schemas/slide-editing-prompt-principles.json';
import rawReferenceRoles from './decks/main/schemas/slide-reference-roles.json';
import rawLeoWideShot from './decks/main/schemas/slide-leo-wide-shot.json';
import rawStyleCopyPromptPrinciples from './decks/main/schemas/slide-style-copy-prompt-principles.json';
import rawStyleCopyPromptPrinciplesCopy2 from './decks/main/schemas/slide-style-copy-prompt-principles-copy-2.json';
import rawStyleCopyPromptPrinciplesCopy3 from './decks/main/schemas/slide-style-copy-prompt-principles-copy-3.json';
import rawStyleCopyPromptPrinciplesCopy4 from './decks/main/schemas/slide-style-copy-prompt-principles-copy-4.json';
import rawImageCoverNanoBananaPro from './decks/main/schemas/slide-image-cover-nano-banana-pro.json';
import rawImageCoverMultiReference from './decks/main/schemas/slide-image-cover-multi-reference.json';
import rawImageCoverTexturingModeling from './decks/main/schemas/slide-image-cover-texturing-modeling.json';
import rawImageCoverJsonPrompting from './decks/main/schemas/slide-image-cover-json-prompting.json';
import rawReferenceAnalysis from './decks/main/schemas/slide-reference-analysis.json';
import rawAnglesLighting from './decks/main/schemas/slide-angles-lighting.json';
import rawPhotorealismModelPicks from './decks/main/schemas/slide-photorealism-model-picks.json';
import rawAboutMe from './decks/main/schemas/slide-about-me.json';
import rawProContradictions from './decks/main/schemas/slide-pro-contradictions.json';
import rawLessObviousUseCases from './decks/main/schemas/slide-less-obvious-use-cases.json';
import rawPhotorealismSectionTitle from './decks/main/schemas/slide-photorealism-section-title.json';
import rawNanoBananaConnection from './decks/main/schemas/slide-nano-banana-connection.json';
import rawLessObviousSectionTitle from './decks/main/schemas/slide-less-obvious-section-title.json';
import rawThreeDWorkflowLink from './decks/main/schemas/slide-three-d-workflow-link.json';
import rawCompositionPhotoLink from './decks/main/schemas/slide-composition-photo-link.json';
import rawGrokImagineBento from './decks/main/schemas/slide-grok-imagine-bento.json';
import rawRecraftV4Bento from './decks/main/schemas/slide-recraft-v4-bento.json';
import rawMidjorneyBento from './decks/main/schemas/slide-midjorney-bento.json';
import rawJsonImagesTriptych from './decks/main/schemas/slide-json-images-triptych.json';
import rawTextureWorkflow from './decks/main/schemas/slide-texture-workflow.json';
import rawThreeDTwoRefsTwoOuts from './decks/main/schemas/slide-3d-two-refs-two-outs.json';
import rawWorkflowComparison from './decks/main/schemas/slide-workflow-comparison.json';
import rawOtherExamplesFlouxProjects from './decks/main/schemas/slide-other-examples-floux-projects.json';
import rawPromptOrderFlex from './decks/main/schemas/slide-prompt-order-flex.json';
import rawNanoBananaVersions from './decks/main/schemas/slide-nano-banana-versions.json';
import rawVibecoding01Cover from './decks/vibecoding/schemas/slide-vibecoding-01-cover.json';
import rawVibecoding02Definition from './decks/vibecoding/schemas/slide-vibecoding-02-definition.json';
import rawVibecoding03Refusal from './decks/vibecoding/schemas/slide-vibecoding-03-refusal.json';
import rawVibecoding04Cycle from './decks/vibecoding/schemas/slide-vibecoding-04-cycle.json';
import rawVibecoding05Landscape from './decks/vibecoding/schemas/slide-vibecoding-05-landscape.json';
import rawVibecoding06Platforms from './decks/vibecoding/schemas/slide-vibecoding-06-platforms.json';
import rawVibecoding07Philosophies from './decks/vibecoding/schemas/slide-vibecoding-07-philosophies.json';
import rawVibecoding08ProTools from './decks/vibecoding/schemas/slide-vibecoding-08-pro-tools.json';
import rawVibecoding09CursorVsClaude from './decks/vibecoding/schemas/slide-vibecoding-09-cursor-vs-claude.json';
import rawVibecoding10DoomLoop from './decks/vibecoding/schemas/slide-vibecoding-10-doom-loop.json';
import rawVibecoding11CostOfReliability from './decks/vibecoding/schemas/slide-vibecoding-11-cost-of-reliability.json';
import rawVibecoding12Architecture from './decks/vibecoding/schemas/slide-vibecoding-12-architecture.json';
import rawVibecoding13Rules from './decks/vibecoding/schemas/slide-vibecoding-13-rules.json';
import rawVibecoding14Mcp from './decks/vibecoding/schemas/slide-vibecoding-14-mcp.json';
import rawVibecoding15Subagents from './decks/vibecoding/schemas/slide-vibecoding-15-subagents.json';
import rawVibecoding16Security from './decks/vibecoding/schemas/slide-vibecoding-16-security.json';
import rawVibecoding17Closing from './decks/vibecoding/schemas/slide-vibecoding-17-closing.json';
import rawVibecoding18Demo from './decks/vibecoding/schemas/slide-vibecoding-18-demo.json';
import { VIBECODING_DECK_SLIDE_IDS } from './decks/vibecodingSlideIds';

export { VIBECODING_DECK_SLIDE_IDS };

export const DEMO_JSON_SLIDE_IDS = {
  asymmetric: 'demo-json-grid-asymmetric',
  equal: 'demo-json-grid-equal',
  bento: 'demo-json-grid-bento',
  heroJourneyBento: 'demo-hero-journey-bento',
} as const;

/** Slide ids that use migrated production JSON documents. */
export const MIGRATED_JSON_SLIDE_IDS = {
  platformsEcosystem: 'platforms-ecosystem-bento',
  attentionModels2026: 'attention-models-2026',
  nanoBananaUseCases: 'nano-banana-use-cases',
  midjourneyVsNanoBanana: 'midjourney-vs-nano-banana',
  promptStructure: 'prompt-structure',
  editingPromptStructure: 'editing-prompt-structure',
  higgsfield: 'higgsfield',
  nodeBasedSystems: 'node-based-systems',
  flouxDemo: 'floux-demo',
  agenticWorkflowResult: 'agentic-workflow-result',
  agenticWorkflow: 'agentic-workflow',
  promptOrderPairImages: 'prompt-order-pair-images',
  editingPromptPrinciples: 'editing-prompt-principles',
  referenceRoles: 'reference-roles',
  leoWideShot: 'leo-wide-shot',
  styleCopyPromptPrinciples: 'style-copy-prompt-principles',
  styleCopyPromptPrinciplesCopy2: 'style-copy-prompt-principles-copy-2',
  styleCopyPromptPrinciplesCopy3: 'style-copy-prompt-principles-copy-3',
  styleCopyPromptPrinciplesCopy4: 'style-copy-prompt-principles-copy-4',
  nanoBananaProCover: 'nano-banana-pro',
  multiReferenceCover: 'multi-reference',
  texturingModelingCover: 'texturing-modeling-cover',
  jsonPromptingCover: 'json-prompting-cover',
  referenceAnalysis: 'reference-analysis',
  anglesLighting: 'angles-lighting',
  photorealismModelPicks: 'photorealism-model-picks',
  aboutMe: 'about-me',
  proContradictions: 'pro-contradictions',
  lessObviousUseCases: 'less-obvious-use-cases',
  photorealismSectionTitle: 'photorealism-section-title',
  nanoBananaConnection: 'nano-banana-connection',
  lessObviousSectionTitle: 'less-obvious-section-title',
  threeDWorkflowLink: 'three-d-workflow-link',
  compositionPhotoLink: 'composition-photo-link',
  grokImagineBento: 'grok-imagine-bento',
  recraftV4Bento: 'recraft-v4-bento',
  midjorneyBento: 'midjorney-bento',
  jsonImagesTriptych: 'json-images-triptych',
  textureWorkflow: 'texture-workflow',
  threeDTwoRefsTwoOuts: '3d-two-refs-two-outs',
  workflowComparison: 'workflow-comparison',
  otherExamplesFlouxProjects: 'other-examples-floux-projects',
  promptOrderFlex: 'prompt-order-flex',
  nanoBananaVersions: 'nano-banana-versions',
} as const;

function loadDocument(raw: unknown, label: string): JsonSlideDocument {
  const parsed = parseJsonSlideDocument(raw);
  if (!parsed.ok) {
    throw new Error(`Invalid JSON slide schema (${label}): ${parsed.error}`);
  }
  return parsed.doc;
}

const docAsymmetric = loadDocument(rawAsymmetric, 'demo-grid-asymmetric.json');
const docEqual = loadDocument(rawEqual, 'demo-grid-equal.json');
const docBento = loadDocument(rawBento, 'demo-grid-bento.json');
const docHeroJourneyBento = loadDocument(rawHeroJourneyBento, 'slide-demo-hero-journey-bento.json');
const docPlatforms = loadDocument(rawPlatformsEcosystem, 'slide-platforms-ecosystem.json');
const docAttention = loadDocument(rawAttentionModels, 'slide-attention-models-2026.json');
const docUseCases = loadDocument(rawNanoBananaUseCases, 'slide-nano-banana-use-cases.json');
const docMidjourneyVsNanoBanana = loadDocument(rawMidjourneyVsNanoBanana, 'slide-midjourney-vs-nano-banana.json');
const docPromptStructure = loadDocument(rawPromptStructure, 'slide-prompt-structure.json');
const docEditingPromptStructure = loadDocument(rawEditingPromptStructure, 'slide-editing-prompt-structure.json');
const docHighsfield = loadDocument(rawHighsfield, 'slide-higgsfield.json');
const docNodeBasedSystems = loadDocument(rawNodeBasedSystems, 'slide-node-based-systems.json');
const docFlouxDemo = loadDocument(rawFlouxDemo, 'slide-floux-demo.json');
const docAgenticWorkflowResult = loadDocument(rawAgenticWorkflowResult, 'slide-agentic-workflow-result.json');
const docAgenticWorkflow = loadDocument(rawAgenticWorkflow, 'slide-agentic-workflow.json');
const docPromptOrderPairImages = loadDocument(rawPromptOrderPairImages, 'slide-prompt-order-pair-images.json');
const docEditingPromptPrinciples = loadDocument(rawEditingPromptPrinciples, 'slide-editing-prompt-principles.json');
const docReferenceRoles = loadDocument(rawReferenceRoles, 'slide-reference-roles.json');
const docLeoWideShot = loadDocument(rawLeoWideShot, 'slide-leo-wide-shot.json');
const docStyleCopyPromptPrinciples = loadDocument(rawStyleCopyPromptPrinciples, 'slide-style-copy-prompt-principles.json');
const docStyleCopyPromptPrinciplesCopy2 = loadDocument(
  rawStyleCopyPromptPrinciplesCopy2,
  'slide-style-copy-prompt-principles-copy-2.json',
);
const docStyleCopyPromptPrinciplesCopy3 = loadDocument(
  rawStyleCopyPromptPrinciplesCopy3,
  'slide-style-copy-prompt-principles-copy-3.json',
);
const docStyleCopyPromptPrinciplesCopy4 = loadDocument(
  rawStyleCopyPromptPrinciplesCopy4,
  'slide-style-copy-prompt-principles-copy-4.json',
);
const docImageCoverNanoBananaPro = loadDocument(rawImageCoverNanoBananaPro, 'slide-image-cover-nano-banana-pro.json');
const docImageCoverMultiReference = loadDocument(
  rawImageCoverMultiReference,
  'slide-image-cover-multi-reference.json',
);
const docImageCoverTexturingModeling = loadDocument(
  rawImageCoverTexturingModeling,
  'slide-image-cover-texturing-modeling.json',
);
const docImageCoverJsonPrompting = loadDocument(
  rawImageCoverJsonPrompting,
  'slide-image-cover-json-prompting.json',
);
const docReferenceAnalysis = loadDocument(rawReferenceAnalysis, 'slide-reference-analysis.json');
const docAnglesLighting = loadDocument(rawAnglesLighting, 'slide-angles-lighting.json');
const docPhotorealismModelPicks = loadDocument(rawPhotorealismModelPicks, 'slide-photorealism-model-picks.json');
const docAboutMe = loadDocument(rawAboutMe, 'slide-about-me.json');
const docProContradictions = loadDocument(rawProContradictions, 'slide-pro-contradictions.json');
const docLessObviousUseCases = loadDocument(rawLessObviousUseCases, 'slide-less-obvious-use-cases.json');
const docPhotorealismSectionTitle = loadDocument(rawPhotorealismSectionTitle, 'slide-photorealism-section-title.json');
const docNanoBananaConnection = loadDocument(rawNanoBananaConnection, 'slide-nano-banana-connection.json');
const docLessObviousSectionTitle = loadDocument(rawLessObviousSectionTitle, 'slide-less-obvious-section-title.json');
const docThreeDWorkflowLink = loadDocument(rawThreeDWorkflowLink, 'slide-three-d-workflow-link.json');
const docCompositionPhotoLink = loadDocument(rawCompositionPhotoLink, 'slide-composition-photo-link.json');
const docGrokImagineBento = loadDocument(rawGrokImagineBento, 'slide-grok-imagine-bento.json');
const docRecraftV4Bento = loadDocument(rawRecraftV4Bento, 'slide-recraft-v4-bento.json');
const docMidjorneyBento = loadDocument(rawMidjorneyBento, 'slide-midjorney-bento.json');
const docJsonImagesTriptych = loadDocument(rawJsonImagesTriptych, 'slide-json-images-triptych.json');
const docTextureWorkflow = loadDocument(rawTextureWorkflow, 'slide-texture-workflow.json');
const docThreeDTwoRefsTwoOuts = loadDocument(rawThreeDTwoRefsTwoOuts, 'slide-3d-two-refs-two-outs.json');
const docWorkflowComparison = loadDocument(rawWorkflowComparison, 'slide-workflow-comparison.json');
const docOtherExamplesFlouxProjects = loadDocument(
  rawOtherExamplesFlouxProjects,
  'slide-other-examples-floux-projects.json',
);
const docPromptOrderFlex = loadDocument(rawPromptOrderFlex, 'slide-prompt-order-flex.json');
const docNanoBananaVersions = loadDocument(rawNanoBananaVersions, 'slide-nano-banana-versions.json');
const docVibecoding01Cover = loadDocument(rawVibecoding01Cover, 'slide-vibecoding-01-cover.json');
const docVibecoding02Definition = loadDocument(rawVibecoding02Definition, 'slide-vibecoding-02-definition.json');
const docVibecoding03Refusal = loadDocument(rawVibecoding03Refusal, 'slide-vibecoding-03-refusal.json');
const docVibecoding04Cycle = loadDocument(rawVibecoding04Cycle, 'slide-vibecoding-04-cycle.json');
const docVibecoding05Landscape = loadDocument(rawVibecoding05Landscape, 'slide-vibecoding-05-landscape.json');
const docVibecoding06Platforms = loadDocument(rawVibecoding06Platforms, 'slide-vibecoding-06-platforms.json');
const docVibecoding07Philosophies = loadDocument(rawVibecoding07Philosophies, 'slide-vibecoding-07-philosophies.json');
const docVibecoding08ProTools = loadDocument(rawVibecoding08ProTools, 'slide-vibecoding-08-pro-tools.json');
const docVibecoding09CursorVsClaude = loadDocument(rawVibecoding09CursorVsClaude, 'slide-vibecoding-09-cursor-vs-claude.json');
const docVibecoding10DoomLoop = loadDocument(rawVibecoding10DoomLoop, 'slide-vibecoding-10-doom-loop.json');
const docVibecoding11CostOfReliability = loadDocument(rawVibecoding11CostOfReliability, 'slide-vibecoding-11-cost-of-reliability.json');
const docVibecoding12Architecture = loadDocument(rawVibecoding12Architecture, 'slide-vibecoding-12-architecture.json');
const docVibecoding13Rules = loadDocument(rawVibecoding13Rules, 'slide-vibecoding-13-rules.json');
const docVibecoding14Mcp = loadDocument(rawVibecoding14Mcp, 'slide-vibecoding-14-mcp.json');
const docVibecoding15Subagents = loadDocument(rawVibecoding15Subagents, 'slide-vibecoding-15-subagents.json');
const docVibecoding16Security = loadDocument(rawVibecoding16Security, 'slide-vibecoding-16-security.json');
const docVibecoding17Closing = loadDocument(rawVibecoding17Closing, 'slide-vibecoding-17-closing.json');
const docVibecoding18Demo = loadDocument(rawVibecoding18Demo, 'slide-vibecoding-18-demo.json');

/** Pre-validated schemas keyed by `SlideDefinition.id`. */
export const jsonSlideDocumentBySlideId: Record<string, JsonSlideDocument> = {
  [DEMO_JSON_SLIDE_IDS.asymmetric]: docAsymmetric,
  [DEMO_JSON_SLIDE_IDS.equal]: docEqual,
  [DEMO_JSON_SLIDE_IDS.bento]: docBento,
  [DEMO_JSON_SLIDE_IDS.heroJourneyBento]: docHeroJourneyBento,
  [MIGRATED_JSON_SLIDE_IDS.platformsEcosystem]: docPlatforms,
  [MIGRATED_JSON_SLIDE_IDS.attentionModels2026]: docAttention,
  [MIGRATED_JSON_SLIDE_IDS.nanoBananaUseCases]: docUseCases,
  [MIGRATED_JSON_SLIDE_IDS.midjourneyVsNanoBanana]: docMidjourneyVsNanoBanana,
  [MIGRATED_JSON_SLIDE_IDS.promptStructure]: docPromptStructure,
  [MIGRATED_JSON_SLIDE_IDS.editingPromptStructure]: docEditingPromptStructure,
  [MIGRATED_JSON_SLIDE_IDS.higgsfield]: docHighsfield,
  [MIGRATED_JSON_SLIDE_IDS.nodeBasedSystems]: docNodeBasedSystems,
  [MIGRATED_JSON_SLIDE_IDS.flouxDemo]: docFlouxDemo,
  [MIGRATED_JSON_SLIDE_IDS.agenticWorkflowResult]: docAgenticWorkflowResult,
  [MIGRATED_JSON_SLIDE_IDS.agenticWorkflow]: docAgenticWorkflow,
  [MIGRATED_JSON_SLIDE_IDS.promptOrderPairImages]: docPromptOrderPairImages,
  [MIGRATED_JSON_SLIDE_IDS.editingPromptPrinciples]: docEditingPromptPrinciples,
  [MIGRATED_JSON_SLIDE_IDS.referenceRoles]: docReferenceRoles,
  [MIGRATED_JSON_SLIDE_IDS.leoWideShot]: docLeoWideShot,
  [MIGRATED_JSON_SLIDE_IDS.styleCopyPromptPrinciples]: docStyleCopyPromptPrinciples,
  [MIGRATED_JSON_SLIDE_IDS.styleCopyPromptPrinciplesCopy2]: docStyleCopyPromptPrinciplesCopy2,
  [MIGRATED_JSON_SLIDE_IDS.styleCopyPromptPrinciplesCopy3]: docStyleCopyPromptPrinciplesCopy3,
  [MIGRATED_JSON_SLIDE_IDS.styleCopyPromptPrinciplesCopy4]: docStyleCopyPromptPrinciplesCopy4,
  [MIGRATED_JSON_SLIDE_IDS.nanoBananaProCover]: docImageCoverNanoBananaPro,
  [MIGRATED_JSON_SLIDE_IDS.multiReferenceCover]: docImageCoverMultiReference,
  [MIGRATED_JSON_SLIDE_IDS.texturingModelingCover]: docImageCoverTexturingModeling,
  [MIGRATED_JSON_SLIDE_IDS.jsonPromptingCover]: docImageCoverJsonPrompting,
  [MIGRATED_JSON_SLIDE_IDS.referenceAnalysis]: docReferenceAnalysis,
  [MIGRATED_JSON_SLIDE_IDS.anglesLighting]: docAnglesLighting,
  [MIGRATED_JSON_SLIDE_IDS.photorealismModelPicks]: docPhotorealismModelPicks,
  [MIGRATED_JSON_SLIDE_IDS.aboutMe]: docAboutMe,
  [MIGRATED_JSON_SLIDE_IDS.proContradictions]: docProContradictions,
  [MIGRATED_JSON_SLIDE_IDS.lessObviousUseCases]: docLessObviousUseCases,
  [MIGRATED_JSON_SLIDE_IDS.photorealismSectionTitle]: docPhotorealismSectionTitle,
  [MIGRATED_JSON_SLIDE_IDS.nanoBananaConnection]: docNanoBananaConnection,
  [MIGRATED_JSON_SLIDE_IDS.lessObviousSectionTitle]: docLessObviousSectionTitle,
  [MIGRATED_JSON_SLIDE_IDS.threeDWorkflowLink]: docThreeDWorkflowLink,
  [MIGRATED_JSON_SLIDE_IDS.compositionPhotoLink]: docCompositionPhotoLink,
  [MIGRATED_JSON_SLIDE_IDS.grokImagineBento]: docGrokImagineBento,
  [MIGRATED_JSON_SLIDE_IDS.recraftV4Bento]: docRecraftV4Bento,
  [MIGRATED_JSON_SLIDE_IDS.midjorneyBento]: docMidjorneyBento,
  [MIGRATED_JSON_SLIDE_IDS.jsonImagesTriptych]: docJsonImagesTriptych,
  [MIGRATED_JSON_SLIDE_IDS.textureWorkflow]: docTextureWorkflow,
  [MIGRATED_JSON_SLIDE_IDS.threeDTwoRefsTwoOuts]: docThreeDTwoRefsTwoOuts,
  [MIGRATED_JSON_SLIDE_IDS.workflowComparison]: docWorkflowComparison,
  [MIGRATED_JSON_SLIDE_IDS.otherExamplesFlouxProjects]: docOtherExamplesFlouxProjects,
  [MIGRATED_JSON_SLIDE_IDS.promptOrderFlex]: docPromptOrderFlex,
  [MIGRATED_JSON_SLIDE_IDS.nanoBananaVersions]: docNanoBananaVersions,
  [VIBECODING_DECK_SLIDE_IDS.cover]: docVibecoding01Cover,
  [VIBECODING_DECK_SLIDE_IDS.definition]: docVibecoding02Definition,
  [VIBECODING_DECK_SLIDE_IDS.refusal]: docVibecoding03Refusal,
  [VIBECODING_DECK_SLIDE_IDS.cycle]: docVibecoding04Cycle,
  [VIBECODING_DECK_SLIDE_IDS.landscape]: docVibecoding05Landscape,
  [VIBECODING_DECK_SLIDE_IDS.platforms]: docVibecoding06Platforms,
  [VIBECODING_DECK_SLIDE_IDS.philosophies]: docVibecoding07Philosophies,
  [VIBECODING_DECK_SLIDE_IDS.proTools]: docVibecoding08ProTools,
  [VIBECODING_DECK_SLIDE_IDS.cursorVsClaude]: docVibecoding09CursorVsClaude,
  [VIBECODING_DECK_SLIDE_IDS.doomLoop]: docVibecoding10DoomLoop,
  [VIBECODING_DECK_SLIDE_IDS.costOfReliability]: docVibecoding11CostOfReliability,
  [VIBECODING_DECK_SLIDE_IDS.architecture]: docVibecoding12Architecture,
  [VIBECODING_DECK_SLIDE_IDS.rules]: docVibecoding13Rules,
  [VIBECODING_DECK_SLIDE_IDS.mcp]: docVibecoding14Mcp,
  [VIBECODING_DECK_SLIDE_IDS.subagents]: docVibecoding15Subagents,
  [VIBECODING_DECK_SLIDE_IDS.security]: docVibecoding16Security,
  [VIBECODING_DECK_SLIDE_IDS.closing]: docVibecoding17Closing,
  [VIBECODING_DECK_SLIDE_IDS.demo]: docVibecoding18Demo,
};

export function getJsonSlideDocumentForSlideId(id: string): JsonSlideDocument | undefined {
  return jsonSlideDocumentBySlideId[id];
}
