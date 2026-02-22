import "./index.css";
import { Composition, Folder } from "remotion";
import { WIDTH, HEIGHT, FPS, DEFAULT_DURATION } from "./utils/constants";
import { EffectSchema, DEFAULT_COLORS } from "./utils/schema";
import type { EffectProps } from "./utils/schema";

// Transitions
import {
  Cut,
  JumpCut,
  MatchCut,
  SmashCut,
  LCut,
  JCut,
  CrossDissolve,
  FadeIn,
  FadeOut,
  DipToBlack,
  DipToWhite,
  Wipe,
  SlideTransition,
  Push,
  Iris,
  ZoomTransition,
  WhipPan,
  SpinTransition,
  Morph,
  GlitchTransition,
  FreezeTocut,
  FilmBurn,
  LightLeak,
  LensFlareWipe,
} from "./categories/01-transitions";

const dp = (title: string, description: string): EffectProps => ({
  title,
  description,
  colors: DEFAULT_COLORS,
});

const comp = (
  id: string,
  Comp: React.FC<EffectProps>,
  defaultProps: EffectProps,
  duration: number = DEFAULT_DURATION,
) => (
  <Composition
    key={id}
    id={id}
    component={Comp}
    schema={EffectSchema}
    defaultProps={defaultProps}
    durationInFrames={duration}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Transitions">
        {comp("Cut", Cut, dp("カット", "シーンを切り替える基本の繋ぎ"))}
        {comp("JumpCut", JumpCut, dp("ジャンプカット", "同一ショット内の時間を飛ばしてテンポを上げる"))}
        {comp("MatchCut", MatchCut, dp("マッチカット", "形・動き・構図が似た要素で自然につなぐ"))}
        {comp("SmashCut", SmashCut, dp("スマッシュカット", "強弱のある唐突な切り替えで印象付ける"))}
        {comp("LCut", LCut, { ...dp("Lカット", "映像を先に切り替えて、音声は前のシーンを残す"), audioBVolume: 0.4 }, 300)}
        {comp("JCut", JCut, { ...dp("Jカット", "音声を先に切り替えて、映像は前のシーンを残す"), audioBVolume: 0.4 }, 300)}
        {comp("CrossDissolve", CrossDissolve, dp("クロスディゾルブ", "前の映像は薄れながら次の映像が重なる"))}
        {comp("FadeIn", FadeIn, dp("フェードイン", "徐々に映像が現れる"))}
        {comp("FadeOut", FadeOut, dp("フェードアウト", "映像が徐々に消えていく"))}
        {comp("DipToBlack", DipToBlack, dp("Dip To Black", "いわゆる暗転、一瞬黒にフェードアウトしてから切り替える"))}
        {comp("DipToWhite", DipToWhite, dp("Dip To White", "一瞬白へフラッシュしてから切り替える"))}
        {comp("Wipe", Wipe, dp("ワイプ", "線が横切り、切り替える"))}
        {comp("SlideTransition", SlideTransition, dp("スライドトランジション(上から下)", "画面全体が上から下にスライドして次の画面に切り替える"))}
        {comp("Push", Push, dp("スライドトランジション(押し出し)", "次のシーンが前のシーンを押し出すように切り替える"))}
        {comp("Iris", Iris, dp("アイリス", "円形マスクが開閉して場面が現れる/消える"), 120)}
        {comp("ZoomTransition", ZoomTransition, dp("ズームトランジション", "急激にズームし、そのまま次のシーンへ繋ぐ"))}
        {comp("WhipPan", WhipPan, dp("WhipPan", "高速移動時のブレを利用して場面を急転換する"))}
        {comp("SpinTransition", SpinTransition, dp("スピントランジション", "画面を回転させながら切り替える"))}
        {comp("Morph", Morph, dp("モーフ", "要素を滑らかに形状変化させて次のシーンへつなげる"))}
        {comp("GlitchTransition", GlitchTransition, dp("グリッチトランジション", "ノイズ/歪み/色ズレでシーンが壊れるように切り替わる"))}
        {comp("FreezeToCut", FreezeTocut, dp("フリーズ→カット", "一瞬静止してから次のシーンへ切り替える"))}
        {comp("FilmBurn", FilmBurn, dp("フィルムバーン", "フィルム焼け風のフラッシュ中に切り替える"))}
        {comp("LightLeak", LightLeak, dp("ライトリーク", "画面を光らせて柔らかく転換する"))}
        {comp("LensFlareWipe", LensFlareWipe, dp("レンズフレアワイプ", "強い光が画面を横切り転換する"))}
      </Folder>
    </>
  );
};
