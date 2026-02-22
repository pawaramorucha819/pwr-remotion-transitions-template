import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing, Img, staticFile, Audio, Sequence } from "remotion";
import { WIDTH, HEIGHT } from "../utils/constants";
import { Label } from "../utils/label";
import { genEiFont } from "../utils/font";
import { SceneA, SceneB } from "../utils/commonScenes";
import { createRng } from "../utils/noise";
import type { EffectProps } from "../utils/schema";

// ─── 1. Cut ─── カット ───
export const Cut: React.FC<EffectProps> = ({ title, description, colors }) => {
  const frame = useCurrentFrame();
  const showB = frame >= 45;

  return (
    <div style={{ position: "relative", width: WIDTH, height: HEIGHT, background: colors.bg, overflow: "hidden" }}>
      {showB ? <SceneB colors={colors} /> : <SceneA colors={colors} />}
      <Label title={title} description={description} colors={colors} />
    </div>
  );
};

// ─── 2. JumpCut ─── ジャンプカット ───
export const JumpCut: React.FC<EffectProps> = ({ title, description, colors }) => {
  const frame = useCurrentFrame();

  // 3セグメント: 0-29, 30-59, 60-89（カットでキャラが大きく飛ぶ）
  const segment = frame < 30 ? 0 : frame < 60 ? 1 : 2;
  const localFrame = frame < 30 ? frame : frame < 60 ? frame - 30 : frame - 60;

  // akane: 右→左、aoi: 左→右 でセグメントごとにジャンプ
  const akaneBaseX = [1500, 900, 300];  // 右から左へ大きく飛ぶ
  const aoiBaseX   = [100,  700, 1300]; // 左から右へ大きく飛ぶ

  // セグメント内の歩行ドリフト（方向が逆）
  const akaneDrift = -localFrame * 7; // 左方向
  const aoiDrift   =  localFrame * 7; // 右方向
  const bob = Math.sin(localFrame * 0.5) * 10;

  const showCutLabel = (frame >= 30 && frame <= 35) || (frame >= 60 && frame <= 65);
  const charHeight = 280;

  return (
    <div style={{ position: "relative", width: WIDTH, height: HEIGHT, background: colors.bg, overflow: "hidden" }}>
      {/* 地面ライン */}
      <div
        style={{
          position: "absolute",
          bottom: 195,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, transparent, ${colors.primary} 15%, ${colors.primary} 85%, transparent)`,
          opacity: 0.35,
        }}
      />

      {/* akane-chan（左向き・右から左へ歩く） */}
      <Img
        src={staticFile("image/akane-chan.png")}
        style={{
          position: "absolute",
          bottom: 199,
          left: akaneBaseX[segment] + akaneDrift,
          height: charHeight,
          transform: `translateY(${bob}px)`,
        }}
      />

      {/* aoi-chan（左から右へ歩く） */}
      <Img
        src={staticFile("image/aoi-chan.png")}
        style={{
          position: "absolute",
          bottom: 199,
          left: aoiBaseX[segment] + aoiDrift,
          height: charHeight,
          transform: `translateY(${bob}px)`,
        }}
      />

      {/* JUMP CUT ラベル */}
      {showCutLabel && (
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: colors.highlight,
            fontSize: 96,
            fontWeight: "bold",
            fontFamily: genEiFont,
            letterSpacing: 6,
            textShadow: `0 0 30px ${colors.highlight}`,
          }}
        >
          JUMP CUT
        </div>
      )}

      <Label title={title} description={description} colors={colors} />
    </div>
  );
};

// ─── 3. MatchCut ─── マッチカット ───
export const MatchCut: React.FC<EffectProps> = ({ title, description, colors }) => {
  const frame = useCurrentFrame();

  // クロスディゾルブ: frame 35〜55 の20フレームで溶ける
  const dissolve = interpolate(frame, [35, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacityA = 1 - dissolve;
  const opacityB = dissolve;

  // 背景色もディゾルブ
  const bgR = interpolate(dissolve, [0, 1], [0x2a, 0x0e]);
  const bgG = interpolate(dissolve, [0, 1], [0x1a, 0x1a]);
  const bgBVal = interpolate(dissolve, [0, 1], [0x0e, 0x2a]);

  // カット前後で連続する歩行X位置・ボブ
  const walkX = interpolate(frame, [0, 90], [80, 1500], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bob = Math.sin(frame * 0.45) * 14;

  const charHeight = 320;

  return (
    <div style={{ position: "relative", width: WIDTH, height: HEIGHT, background: `rgb(${bgR},${bgG},${bgBVal})`, overflow: "hidden" }}>
      {/* 地面ライン */}
      <div
        style={{
          position: "absolute",
          bottom: 195,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, transparent, ${colors.primary} 15%, ${colors.primary} 85%, transparent)`,
          opacity: 0.35,
        }}
      />

      {/* Scene B: aoi-chan（下に置いてAが溶けるにつれ現れる） */}
      <Img
        src={staticFile("image/aoi-chan.png")}
        style={{
          position: "absolute",
          bottom: 199,
          left: walkX,
          height: charHeight,
          transform: `translateY(${bob}px)`,
          opacity: opacityB,
        }}
      />

      {/* Scene A: akane-chan（上に置いてフェードアウト） */}
      <Img
        src={staticFile("image/akane-chan.png")}
        style={{
          position: "absolute",
          bottom: 199,
          left: walkX,
          height: charHeight,
          transform: `scaleX(-1) translateY(${bob}px)`,
          opacity: opacityA,
        }}
      />

      {/* シーンラベル（ディゾルブに合わせてクロスフェード） */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 80,
          color: colors.text,
          fontSize: 52,
          fontFamily: genEiFont,
          opacity: opacityA * 0.5,
        }}
      >
        Scene A
      </div>
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 80,
          color: colors.text,
          fontSize: 52,
          fontFamily: genEiFont,
          opacity: opacityB * 0.5,
        }}
      >
        Scene B
      </div>

      <Label title={title} description={description} colors={colors} />
    </div>
  );
};

// ─── 4. SmashCut ─── スマッシュカット ───
export const SmashCut: React.FC<EffectProps> = ({ title, description, colors }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const showB = frame >= 45;
  const localB = frame - 45;

  // ── Scene A: aoi-chan の静かなシーン ──
  const aoiBob = Math.sin(frame * 0.18) * 8;

  // ── Scene B: akane-chan の激しいシーン ──
  // 登場スプリング（超大きく→通常サイズ）
  const akaneScale = showB
    ? spring({ frame: localB, fps, from: 3.2, to: 1.2, durationInFrames: 22, config: { damping: 6, stiffness: 140 } })
    : 1;


  // 画面シェイク（登場直後が最大）
  const shakeIntensity = showB
    ? interpolate(localB, [0, 18, 44], [28, 10, 4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;
  const shakeRng = createRng(frame * 13);
  const shakeX = (shakeRng() - 0.5) * 2 * shakeIntensity;
  const shakeY = (shakeRng() - 0.5) * 2 * shakeIntensity;

  // 色収差（登場直後が最大）
  const aberration = showB
    ? interpolate(localB, [0, 20], [20, 4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  // カット瞬間の白フラッシュ
  const flashOpacity =
    frame === 45 ? 1.0 :
    frame === 46 ? 0.65 :
    frame === 47 ? 0.3 : 0;

  const charHeight = 480;
  const rayCount = 16;

  return (
    <div style={{ position: "relative", width: WIDTH, height: HEIGHT, overflow: "hidden",
      background: showB ? "#1a0000" : "#0d0d1f" }}>

      {/* ── Scene A: aoi-chan 静かなシーン ── */}
      {!showB && (
        <>
          {/* 落ち着いたグラデーション背景 */}
          <div style={{
            position: "absolute", top: 0, left: 0, width: WIDTH, height: HEIGHT,
            background: "radial-gradient(ellipse at 50% 60%, #1e1e3a 0%, #0d0d1f 100%)",
          }} />
          {/* 地面ライン */}
          <div style={{
            position: "absolute", bottom: 195, left: 0, right: 0, height: 3,
            background: `linear-gradient(90deg, transparent, ${colors.primary} 15%, ${colors.primary} 85%, transparent)`,
            opacity: 0.3,
          }} />
          {/* aoi-chan（中央・ゆったり呼吸） */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: `translate(-50%, -50%) translateY(${aoiBob}px)`,
          }}>
            <Img src={staticFile("image/aoi-chan.png")} style={{ height: 260, display: "block" }} />
          </div>
          {/* 柔らかいビネット */}
          <div style={{
            position: "absolute", top: 0, left: 0, width: WIDTH, height: HEIGHT,
            background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 100%)",
            pointerEvents: "none",
          }} />
        </>
      )}

      {/* ── Scene B: akane-chan 激しいシーン ── */}
      {showB && (
        <>
          {/* 激しい放射状背景（シェイクあり） */}
          <div style={{
            position: "absolute", top: 0, left: 0, width: WIDTH, height: HEIGHT,
            background: "radial-gradient(ellipse at 50% 50%, #ff5500 0%, #cc2200 35%, #1a0000 70%)",
            transform: `translate(${shakeX}px, ${shakeY}px)`,
          }} />

          {/* スピードライン（放射状） */}
          {Array.from({ length: rayCount }, (_, i) => {
            const rng = createRng(i * 31 + 7);
            const angle = (i / rayCount) * 360;
            const w = 700 + rng() * 600;
            const h = 4 + rng() * 7;
            const op = 0.35 + rng() * 0.45;
            return (
              <div key={i} style={{
                position: "absolute",
                top: "50%", left: "50%",
                width: w, height: h,
                background: "linear-gradient(90deg, rgba(255,200,0,0.9), transparent)",
                transform: `translateY(-50%) rotate(${angle}deg)`,
                transformOrigin: "0 50%",
                opacity: op,
              }} />
            );
          })}

          {/* akane-chan: くるくる回転＆大きく登場（シェイクあり） */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: `translate(-50%, -50%) translate(${shakeX}px, ${shakeY}px)`,
          }}>
            <Img
              src={staticFile("image/akane-chan.png")}
              style={{
                height: charHeight,
                display: "block",
                transform: `scale(${akaneScale})`,
                transformOrigin: "center center",
              }}
            />
          </div>

          {/* 色収差オーバーレイ */}
          <div style={{
            position: "absolute", top: 0, left: aberration, width: WIDTH, height: HEIGHT,
            background: "rgba(255,0,0,0.13)", mixBlendMode: "screen", pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", top: 0, left: -aberration, width: WIDTH, height: HEIGHT,
            background: "rgba(0,80,255,0.13)", mixBlendMode: "screen", pointerEvents: "none",
          }} />

          {/* 激しいビネット */}
          <div style={{
            position: "absolute", top: 0, left: 0, width: WIDTH, height: HEIGHT,
            background: "radial-gradient(ellipse at 50% 50%, transparent 25%, rgba(0,0,0,0.75) 100%)",
            pointerEvents: "none",
          }} />
        </>
      )}

      {/* カット瞬間の白フラッシュ */}
      {flashOpacity > 0 && (
        <div style={{
          position: "absolute", top: 0, left: 0, width: WIDTH, height: HEIGHT,
          background: "#ffffff", opacity: flashOpacity, pointerEvents: "none",
        }} />
      )}

      <Label title={title} description={description} colors={colors} />
    </div>
  );
};

// ─── 5. LCut ─── Lカット ───
export const LCut: React.FC<EffectProps> = ({ title, description, colors, audioBVolume = 0.4 }) => {
  const frame = useCurrentFrame();

  // 映像: SceneAがframe 75-90でフェードアウト、SceneBがframe 90-110でフェードイン
  const opacityA = interpolate(frame, [75, 90], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacityB = interpolate(frame, [90, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 波形ビジュアル用: Audio Aは90-150でフェードアウト、Audio BはAudio A消滅後(150-)にフェードイン
  const audioAOpacity = interpolate(frame, [90, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const audioBOpacity = interpolate(frame, [150, 180], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const rng = createRng(42);
  const waveformBars = Array.from({ length: 30 }, () => rng());

  return (
    <div style={{ position: "relative", width: WIDTH, height: HEIGHT, background: colors.bg, overflow: "hidden" }}>
      {/* Audio A (TrackA): 映像フェードアウト後も60フレーム=2秒残る（Lカットの本質） */}
      <Audio
        src={staticFile("audio/TrackA.mp3")}
        volume={(f) => interpolate(f, [90, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {/* Audio B (TrackB): Audio A消滅後(frame 150)から登場 */}
      <Sequence from={150}>
        <Audio
          src={staticFile("audio/TrackB.mp3")}
          volume={(f) => audioBVolume * interpolate(f, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        />
      </Sequence>
      {/* SceneA: フェードアウト */}
      <SceneA colors={colors} style={{ opacity: opacityA }} />
      {/* SceneB: フェードイン */}
      <SceneB colors={colors} style={{ opacity: opacityB }} />
      {/* Audio waveform visualization */}
      {/* SceneA(赤)の反対色=シアン、SceneB(青)の反対色=オレンジ */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 60,
          right: 60,
          height: 140,
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(0,0,0,0.55)",
          borderRadius: 16,
          padding: "0 32px",
        }}
      >
        {/* Audio A waveform: シアン（SceneA赤の補色） */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 4, opacity: audioAOpacity }}>
          <div style={{ color: "#45c6ff", fontSize: 22, fontFamily: genEiFont, marginRight: 16, whiteSpace: "nowrap", fontWeight: "bold" }}>Audio A</div>
          {waveformBars.slice(0, 15).map((h, i) => {
            const barHeight = interpolate(
              Math.sin(frame * 0.3 + i * 0.5),
              [-1, 1],
              [12, 90 * h + 20]
            );
            return (
              <div
                key={`a-${i}`}
                style={{
                  width: 8,
                  height: barHeight,
                  background: "#45c6ff",
                  borderRadius: 4,
                }}
              />
            );
          })}
        </div>
        {/* Audio B waveform: オレンジ（SceneB青の補色） */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 4, opacity: audioBOpacity }}>
          <div style={{ color: "#ff9f45", fontSize: 22, fontFamily: genEiFont, marginRight: 16, whiteSpace: "nowrap", fontWeight: "bold" }}>Audio B</div>
          {waveformBars.slice(15, 30).map((h, i) => {
            const barHeight = interpolate(
              Math.sin(frame * 0.3 + i * 0.7),
              [-1, 1],
              [12, 90 * h + 20]
            );
            return (
              <div
                key={`b-${i}`}
                style={{
                  width: 8,
                  height: barHeight,
                  background: "#ff9f45",
                  borderRadius: 4,
                }}
              />
            );
          })}
        </div>
      </div>
      <Label title={title} description={description} colors={colors} />
    </div>
  );
};

// ─── 6. JCut ─── Jカット ───
export const JCut: React.FC<EffectProps> = ({ title, description, colors, audioBVolume = 0.4 }) => {
  const frame = useCurrentFrame();

  // 映像: SceneAがframe 195-210でフェードアウト、SceneBがframe 210-225でフェードイン（7秒地点）
  const opacityA = interpolate(frame, [195, 210], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacityB = interpolate(frame, [210, 225], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 波形ビジュアル用: Audio BとAudio Aが同時にクロスフェード（frame 150-180）
  const audioAOpacity = interpolate(frame, [150, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const audioBOpacity = interpolate(frame, [150, 180], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const rng = createRng(99);
  const waveformBars = Array.from({ length: 30 }, () => rng());

  return (
    <div style={{ position: "relative", width: WIDTH, height: HEIGHT, background: colors.bg, overflow: "hidden" }}>
      {/* Audio A (TrackA): Audio Bフェードイン開始と同時にフェードアウト */}
      <Audio
        src={staticFile("audio/TrackA.mp3")}
        volume={(f) => interpolate(f, [150, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {/* Audio B (TrackB): 映像カット2秒前(frame 150)から先行して入る（Jカットの本質） */}
      <Sequence from={150}>
        <Audio
          src={staticFile("audio/TrackB.mp3")}
          volume={(f) => audioBVolume * interpolate(f, [0, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        />
      </Sequence>
      {/* SceneA: フェードアウト */}
      <SceneA colors={colors} style={{ opacity: opacityA }} />
      {/* SceneB: フェードイン */}
      <SceneB colors={colors} style={{ opacity: opacityB }} />
      {/* Audio waveform visualization */}
      {/* SceneA(赤)の反対色=シアン、SceneB(青)の反対色=オレンジ */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 60,
          right: 60,
          height: 140,
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(0,0,0,0.55)",
          borderRadius: 16,
          padding: "0 32px",
        }}
      >
        {/* Audio A waveform: シアン（SceneA赤の補色） */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 4, opacity: audioAOpacity }}>
          <div style={{ color: "#45c6ff", fontSize: 22, fontFamily: genEiFont, marginRight: 16, whiteSpace: "nowrap", fontWeight: "bold" }}>Audio A</div>
          {waveformBars.slice(0, 15).map((h, i) => {
            const barHeight = interpolate(
              Math.sin(frame * 0.3 + i * 0.5),
              [-1, 1],
              [12, 90 * h + 20]
            );
            return (
              <div
                key={`a-${i}`}
                style={{
                  width: 8,
                  height: barHeight,
                  background: "#45c6ff",
                  borderRadius: 4,
                }}
              />
            );
          })}
        </div>
        {/* Audio B waveform: オレンジ（SceneB青の補色） */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 4, opacity: audioBOpacity }}>
          <div style={{ color: "#ff9f45", fontSize: 22, fontFamily: genEiFont, marginRight: 16, whiteSpace: "nowrap", fontWeight: "bold" }}>Audio B</div>
          {waveformBars.slice(15, 30).map((h, i) => {
            const barHeight = interpolate(
              Math.sin(frame * 0.3 + i * 0.7),
              [-1, 1],
              [12, 90 * h + 20]
            );
            return (
              <div
                key={`b-${i}`}
                style={{
                  width: 8,
                  height: barHeight,
                  background: "#ff9f45",
                  borderRadius: 4,
                }}
              />
            );
          })}
        </div>
      </div>
      <Label title={title} description={description} colors={colors} />
    </div>
  );
};

// ─── 7. CrossDissolve ─── クロスディゾルブ ───
export const CrossDissolve: React.FC<EffectProps> = ({ title, description, colors }) => {
  const frame = useCurrentFrame();

  const opacityA = interpolate(frame, [30, 60], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacityB = interpolate(frame, [30, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ position: "relative", width: WIDTH, height: HEIGHT, background: colors.bg, overflow: "hidden" }}>
      <SceneB colors={colors} style={{ opacity: opacityB }} />
      <SceneA colors={colors} style={{ opacity: opacityA }} />
      <Label title={title} description={description} colors={colors} />
    </div>
  );
};

// ─── 8. FadeIn ─── フェードイン ───
export const FadeIn: React.FC<EffectProps> = ({ title, description, colors }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ position: "relative", width: WIDTH, height: HEIGHT, background: "#000000", overflow: "hidden" }}>
      <SceneA colors={colors} style={{ opacity }} />
      <Label title={title} description={description} colors={colors} />
    </div>
  );
};

// ─── 9. FadeOut ─── フェードアウト ───
export const FadeOut: React.FC<EffectProps> = ({ title, description, colors }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [45, 90], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ position: "relative", width: WIDTH, height: HEIGHT, background: "#000000", overflow: "hidden" }}>
      <SceneB colors={colors} style={{ opacity }} />
      <Label title={title} description={description} colors={colors} />
    </div>
  );
};

// ─── 10. DipToBlack ─── ディップ・トゥ・ブラック ───
export const DipToBlack: React.FC<EffectProps> = ({ title, description, colors }) => {
  const frame = useCurrentFrame();

  const opacityA = interpolate(frame, [30, 45], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacityB = interpolate(frame, [45, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ position: "relative", width: WIDTH, height: HEIGHT, background: "#000000", overflow: "hidden" }}>
      {frame <= 45 ? (
        <SceneA colors={colors} style={{ opacity: opacityA }} />
      ) : (
        <SceneB colors={colors} style={{ opacity: opacityB }} />
      )}
      <Label title={title} description={description} colors={colors} />
    </div>
  );
};

// ─── 11. DipToWhite ─── ディップ・トゥ・ホワイト ───
export const DipToWhite: React.FC<EffectProps> = ({ title, description, colors }) => {
  const frame = useCurrentFrame();

  const opacityA = interpolate(frame, [30, 45], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacityB = interpolate(frame, [45, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ position: "relative", width: WIDTH, height: HEIGHT, background: "#ffffff", overflow: "hidden" }}>
      {frame <= 45 ? (
        <SceneA colors={colors} style={{ opacity: opacityA }} />
      ) : (
        <SceneB colors={colors} style={{ opacity: opacityB }} />
      )}
      <Label title={title} description={description} colors={colors} />
    </div>
  );
};

// ─── 12. Wipe ─── ワイプ ───
export const Wipe: React.FC<EffectProps> = ({ title, description, colors }) => {
  const frame = useCurrentFrame();

  const wipeProgress = interpolate(frame, [25, 65], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ position: "relative", width: WIDTH, height: HEIGHT, background: colors.bg, overflow: "hidden" }}>
      <SceneA colors={colors} />
      <SceneB
        colors={colors}
        style={{
          clipPath: `inset(0 ${100 - wipeProgress}% 0 0)`,
        }}
      />
      {/* SceneB wipes in from the left, covering SceneA */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: `${wipeProgress}%`,
          width: 3,
          height: HEIGHT,
          background: colors.text,
          opacity: 0.8,
          zIndex: 10,
        }}
      />
      <Label title={title} description={description} colors={colors} />
    </div>
  );
};

// ─── 13. SlideTransition ─── スライドトランジション ───
export const SlideTransition: React.FC<EffectProps> = ({ title, description, colors }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - 25),
    fps,
    from: 0,
    to: 1,
    durationInFrames: 40,
    config: { damping: 15, stiffness: 80 },
  });

  const slideA = interpolate(progress, [0, 1], [0, HEIGHT]);
  const slideB = interpolate(progress, [0, 1], [-HEIGHT, 0]);

  return (
    <div style={{ position: "relative", width: WIDTH, height: HEIGHT, background: colors.bg, overflow: "hidden" }}>
      <SceneA colors={colors} style={{ transform: `translateY(${slideA}px)` }} />
      <SceneB colors={colors} style={{ transform: `translateY(${slideB}px)` }} />
      <Label title={title} description={description} colors={colors} />
    </div>
  );
};

// ─── 14. Push ─── プッシュ ───
export const Push: React.FC<EffectProps> = ({ title, description, colors }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - 25),
    fps,
    from: 0,
    to: 1,
    durationInFrames: 40,
    config: { damping: 15, stiffness: 80 },
  });

  const offset = interpolate(progress, [0, 1], [0, -WIDTH]);

  return (
    <div style={{ position: "relative", width: WIDTH, height: HEIGHT, background: colors.bg, overflow: "hidden" }}>
      <SceneA colors={colors} style={{ transform: `translateX(${offset}px)` }} />
      <SceneB colors={colors} style={{ transform: `translateX(${offset + WIDTH}px)` }} />
      <Label title={title} description={description} colors={colors} />
    </div>
  );
};

// ─── 15. Iris ─── アイリス ───
export const Iris: React.FC<EffectProps> = ({ title, description, colors }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 円開き: SceneA → SceneB
  const openProgress = spring({
    frame: Math.max(0, frame - 15),
    fps,
    from: 0,
    to: 1,
    durationInFrames: 40,
    config: { damping: 12, stiffness: 80 },
  });

  // 円閉じ: SceneB → 黒
  const closeProgress = spring({
    frame: Math.max(0, frame - 80),
    fps,
    from: 0,
    to: 1,
    durationInFrames: 40,
    config: { damping: 12, stiffness: 80 },
  });

  const isClosing = frame >= 80;
  const radius = isClosing
    ? interpolate(closeProgress, [0, 1], [75, 0])
    : interpolate(openProgress, [0, 1], [0, 75]);

  return (
    <div style={{ position: "relative", width: WIDTH, height: HEIGHT, background: "#000000", overflow: "hidden" }}>
      {!isClosing && <SceneA colors={colors} />}
      {radius > 0.5 && (
        <SceneB
          colors={colors}
          style={{
            clipPath: `circle(${radius}% at 50% 50%)`,
          }}
        />
      )}
      <Label title={title} description={description} colors={colors} />
    </div>
  );
};

// ─── 16. ZoomTransition ─── ズームトランジション ───
export const ZoomTransition: React.FC<EffectProps> = ({ title, description, colors }) => {
  const frame = useCurrentFrame();

  const scaleA = interpolate(frame, [25, 45], [1, 30], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacityA = interpolate(frame, [25, 40], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ position: "relative", width: WIDTH, height: HEIGHT, background: colors.bg, overflow: "hidden" }}>
      <SceneB colors={colors} />
      {frame < 45 && (
        <SceneA colors={colors} style={{ transform: `scale(${scaleA})`, opacity: opacityA }} />
      )}
      <Label title={title} description={description} colors={colors} />
    </div>
  );
};

// ─── 17. WhipPan ─── ホイップパン ───
export const WhipPan: React.FC<EffectProps> = ({ title, description, colors }) => {
  const frame = useCurrentFrame();

  // SceneA slides out fast to the left
  const slideA = interpolate(frame, [30, 38], [0, -WIDTH * 1.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  // SceneB slides in fast from the right
  const slideB = interpolate(frame, [36, 46], [WIDTH * 1.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Motion blur intensity
  const blurAmount = frame >= 30 && frame <= 46
    ? interpolate(frame, [30, 36, 38, 46], [0, 30, 30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  return (
    <div style={{ position: "relative", width: WIDTH, height: HEIGHT, background: colors.bg, overflow: "hidden" }}>
      <SceneB
        colors={colors}
        style={{
          transform: `translateX(${slideB}px)`,
          filter: `blur(${blurAmount * 0.5}px)`,
        }}
      />
      <SceneA
        colors={colors}
        style={{
          transform: `translateX(${slideA}px)`,
          filter: `blur(${blurAmount}px)`,
        }}
      />
      <Label title={title} description={description} colors={colors} />
    </div>
  );
};

// ─── 18. SpinTransition ─── スピントランジション ───
export const SpinTransition: React.FC<EffectProps> = ({ title, description, colors }) => {
  const frame = useCurrentFrame();

  // SceneA spins fast and disappears at the end of rotation
  const rotateA = interpolate(frame, [25, 31], [0, 360], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacityA = interpolate(frame, [29, 32], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // SceneB spins in and settles
  const rotateB = interpolate(frame, [30, 34], [-360, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ position: "relative", width: WIDTH, height: HEIGHT, background: colors.bg, overflow: "hidden" }}>
      <SceneB
        colors={colors}
        style={{
          transform: `rotate(${rotateB}deg)`,
          transformOrigin: "center center",
        }}
      />
      {frame < 32 && (
        <SceneA
          colors={colors}
          style={{
            transform: `rotate(${rotateA}deg)`,
            opacity: opacityA,
            transformOrigin: "center center",
          }}
        />
      )}
      <Label title={title} description={description} colors={colors} />
    </div>
  );
};

// ─── 19. Morph ─── モーフ ───
export const Morph: React.FC<EffectProps> = ({ title, description, colors }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - 15),
    fps,
    from: 0,
    to: 1,
    durationInFrames: 60,
    config: { damping: 15, stiffness: 60 },
  });

  const borderRadius = interpolate(progress, [0, 1], [200, 12]);
  const size = interpolate(progress, [0, 1], [400, 400]);
  const colorR = interpolate(progress, [0, 1], [233, 15]);
  const colorG = interpolate(progress, [0, 1], [69, 52]);
  const colorB = interpolate(progress, [0, 1], [96, 96]);
  const rotation = interpolate(progress, [0, 1], [0, 90]);

  const bgR = interpolate(progress, [0, 1], [26, 15]);
  const bgG = interpolate(progress, [0, 1], [26, 30]);
  const bgB = interpolate(progress, [0, 1], [46, 60]);

  return (
    <div style={{ position: "relative", width: WIDTH, height: HEIGHT, background: `rgb(${bgR},${bgG},${bgB})`, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: size,
          height: size,
          borderRadius,
          background: `rgb(${colorR},${colorG},${colorB})`,
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          boxShadow: `0 0 40px rgba(${colorR},${colorG},${colorB},0.5)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          marginTop: 280,
          color: colors.text,
          fontSize: 48,
          fontWeight: "bold",
          fontFamily: genEiFont,
        }}
      >
        {progress < 0.5 ? "Circle" : "Square"}
      </div>
      <Label title={title} description={description} colors={colors} />
    </div>
  );
};

// ─── 20. GlitchTransition ─── グリッチトランジション ───
export const GlitchTransition: React.FC<EffectProps> = ({ title, description, colors }) => {
  const frame = useCurrentFrame();

  // グリッチ区間（フレーム32〜58、26フレーム）
  const inGlitch = frame >= 32 && frame <= 58;
  const rawIntensity = inGlitch
    ? interpolate(frame, [32, 40, 45, 50, 58], [0, 0.7, 1, 0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;
  // 4段階に量子化してカクカクしたデジタルグリッチ感を出す
  const quantized = Math.floor(rawIntensity * 4) / 4;
  // 40%のフレームにランダムスパイクを追加
  const rSpike = createRng(frame * 97 + 13);
  const spike = inGlitch && rSpike() > 0.6 ? 0.3 : 0;
  const intensity = Math.min(1, quantized + spike);

  const showB = frame >= 45;

  // 画像: 独立した大きな横ズレ＋縦ズレ（50px/20px刻みに量子化）
  const rImg = createRng(frame * 13 + 7);
  const rImgY = createRng(frame * 17 + 11);
  const imgOffsetX = Math.round((rImg() - 0.5) * 800 * intensity / 50) * 50;
  const imgOffsetY = Math.round((rImgY() - 0.5) * 160 * intensity / 20) * 20;

  // テキスト: 独立した大きな横ズレ＋縦ズレ（別シードで別方向に飛ぶ）
  const rTxt = createRng(frame * 29 + 3);
  const rTxtY = createRng(frame * 31 + 5);
  const txtOffsetX = Math.round((rTxt() - 0.5) * 1000 * intensity / 50) * 50;
  const txtOffsetY = Math.round((rTxtY() - 0.5) * 120 * intensity / 20) * 20;

  // 背景: 軽い横ズレ（30px刻み）
  const rBg = createRng(frame * 53 + 17);
  const bgOffsetX = Math.round((rBg() - 0.5) * 200 * intensity / 30) * 30;

  // スキャンラインスライス（ランダム位置・細い帯・半透明）
  const sliceCount = 8;
  const slices = Array.from({ length: sliceCount }, (_, i) => {
    const r = createRng(frame * 41 + i * 19);
    const r2 = createRng(frame * 43 + i * 23);
    return {
      top: r() * 90,
      height: 2 + r2() * 8,
      offsetX: Math.round((r() - 0.5) * 600 * intensity / 30) * 30,
      opacity: 0.4 + r2() * 0.4,
    };
  });

  // RGB分離（強め）
  const rgbShift = intensity * 80;

  // 白フリッカー（30%のフレームで発火）
  const rFlicker = createRng(frame * 67 + 37);
  const flickerOpacity = inGlitch && rFlicker() > 0.7
    ? rFlicker() * 0.4 * intensity
    : 0;

  // SceneA/B の各要素
  const contentTop = (HEIGHT - 600) / 2;
  const imgSrc = showB ? "image/aoi-chan.png" : "image/akane-chan.png";
  const sceneText = showB ? "Scene B" : "Scene A";
  const bg = showB
    ? `linear-gradient(135deg, ${colors.secondary} 0%, #1a5276 100%)`
    : `linear-gradient(135deg, ${colors.primary} 0%, #c0392b 100%)`;

  const imgStyle: React.CSSProperties = { width: 480, height: 480, objectFit: "contain" };
  const txtStyle: React.CSSProperties = { color: colors.text, fontSize: 80, fontWeight: "bold", fontFamily: genEiFont };

  return (
    <div style={{ position: "relative", width: WIDTH, height: HEIGHT, overflow: "hidden" }}>
      {/* 背景レイヤー（軽い横ズレ） */}
      <div style={{
        position: "absolute", top: 0, left: -100, width: WIDTH + 200, height: HEIGHT,
        background: bg, transform: `translateX(${bgOffsetX}px)`,
      }} />

      {/* 画像レイヤー（大きな独立ズレ） */}
      <div style={{
        position: "absolute", top: contentTop, left: 0, width: WIDTH, height: 480,
        display: "flex", justifyContent: "center",
        transform: `translate(${imgOffsetX}px, ${imgOffsetY}px)`, zIndex: 1,
      }}>
        <Img src={staticFile(imgSrc)} style={imgStyle} />
      </div>

      {/* テキストレイヤー（大きな独立ズレ） */}
      <div style={{
        position: "absolute", top: contentTop + 520, left: 0, width: WIDTH,
        display: "flex", justifyContent: "center",
        transform: `translate(${txtOffsetX}px, ${txtOffsetY}px)`, zIndex: 2,
      }}>
        <div style={txtStyle}>{sceneText}</div>
      </div>

      {/* スキャンラインスライス（部分的・半透明） */}
      {inGlitch && slices.map((slice, i) => (
        <div
          key={i}
          style={{
            position: "absolute", top: `${slice.top}%`, left: 0,
            width: WIDTH, height: `${slice.height}%`,
            overflow: "hidden",
            transform: `translateX(${slice.offsetX}px)`,
            opacity: slice.opacity, zIndex: 3,
          }}
        >
          <div style={{ position: "absolute", top: `-${slice.top}%`, left: 0, width: WIDTH, height: HEIGHT, background: bg }}>
            <div style={{ position: "absolute", top: contentTop, left: 0, width: WIDTH, height: 480, display: "flex", justifyContent: "center" }}>
              <Img src={staticFile(imgSrc)} style={imgStyle} />
            </div>
            <div style={{ position: "absolute", top: contentTop + 520, left: 0, width: WIDTH, display: "flex", justifyContent: "center" }}>
              <div style={txtStyle}>{sceneText}</div>
            </div>
          </div>
        </div>
      ))}

      {/* RGB 分離オーバーレイ（強化） */}
      {inGlitch && (
        <>
          <div style={{ position: "absolute", top: 0, left: rgbShift, width: WIDTH, height: HEIGHT, background: "rgba(255,0,0,0.35)", mixBlendMode: "screen", pointerEvents: "none", zIndex: 5 }} />
          <div style={{ position: "absolute", top: 0, left: -rgbShift, width: WIDTH, height: HEIGHT, background: "rgba(0,0,255,0.35)", mixBlendMode: "screen", pointerEvents: "none", zIndex: 5 }} />
        </>
      )}

      {/* 白フリッカー */}
      {flickerOpacity > 0 && (
        <div style={{ position: "absolute", top: 0, left: 0, width: WIDTH, height: HEIGHT, background: "white", opacity: flickerOpacity, pointerEvents: "none", zIndex: 6 }} />
      )}

      <Label title={title} description={description} colors={colors} />
    </div>
  );
};

// ─── 21. FreezeTocut ─── フリーズ→カット ───
export const FreezeTocut: React.FC<EffectProps> = ({ title, description, colors }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isFreezing = frame >= 30 && frame < 55;
  const showB = frame >= 55;
  const charHeight = 280;

  // Phase 1: akane-chan が右から左へ歩く (frame 0-29)、freeze 時は frame=30 の位置で止める
  const akaneFrame = Math.min(frame, 30);
  const akaneX = 1100 - akaneFrame * 10;
  const akaneBob = !isFreezing && !showB ? Math.sin(frame * 0.5) * 10 : 0;

  const desaturation = isFreezing
    ? interpolate(frame, [30, 40], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  const freezeTextOpacity = isFreezing
    ? spring({ frame: frame - 30, fps, from: 0, to: 1, durationInFrames: 10 })
    : 0;

  const freezeTextScale = isFreezing
    ? spring({ frame: frame - 30, fps, from: 1.5, to: 1, durationInFrames: 15, config: { damping: 8, stiffness: 200 } })
    : 1;

  // Phase 3: aoi-chan が左から右へ歩く (frame 55-)
  const aoiLocalFrame = frame - 55;
  const aoiX = 100 + aoiLocalFrame * 12;
  const aoiBob = showB ? Math.sin(aoiLocalFrame * 0.5) * 10 : 0;

  return (
    <div style={{ position: "relative", width: WIDTH, height: HEIGHT, background: colors.bg, overflow: "hidden" }}>
      {/* 地面ライン */}
      <div
        style={{
          position: "absolute",
          bottom: 195,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, transparent, ${colors.primary} 15%, ${colors.primary} 85%, transparent)`,
          opacity: 0.35,
        }}
      />

      {/* Scene A: akane-chan が歩く→フリーズ */}
      {!showB && (
        <Img
          src={staticFile("image/akane-chan.png")}
          style={{
            position: "absolute",
            bottom: 199,
            left: akaneX,
            height: charHeight,
            transform: `translateY(${akaneBob}px)`,
            filter: `grayscale(${desaturation}%)`,
          }}
        />
      )}

      {/* Scene B: aoi-chan がカット後に歩く */}
      {showB && (
        <Img
          src={staticFile("image/aoi-chan.png")}
          style={{
            position: "absolute",
            bottom: 199,
            left: aoiX,
            height: charHeight,
            transform: `translateY(${aoiBob}px)`,
          }}
        />
      )}

      {/* シーンラベル */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 80,
          color: colors.text,
          fontSize: 52,
          fontFamily: genEiFont,
          opacity: showB ? 0 : 0.5,
        }}
      >
        Scene A
      </div>
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 80,
          color: colors.text,
          fontSize: 52,
          fontFamily: genEiFont,
          opacity: showB ? 0.5 : 0,
        }}
      >
        Scene B
      </div>

      {/* FREEZE テキスト */}
      {isFreezing && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${freezeTextScale})`,
            color: colors.text,
            fontSize: 72,
            fontWeight: "bold",
            fontFamily: genEiFont,
            opacity: freezeTextOpacity,
            textShadow: "0 0 20px rgba(255,255,255,0.5)",
            letterSpacing: 8,
            zIndex: 50,
          }}
        >
          FREEZE
        </div>
      )}
      <Label title={title} description={description} colors={colors} />
    </div>
  );
};

// ─── 22. FilmBurn ─── フィルムバーン ───
export const FilmBurn: React.FC<EffectProps> = ({ title, description, colors }) => {
  const frame = useCurrentFrame();

  const showB = frame >= 45;
  const burnProgress = interpolate(frame, [30, 60], [-100, 200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const burnOpacity = interpolate(frame, [30, 42, 48, 60], [0, 0.9, 0.9, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ position: "relative", width: WIDTH, height: HEIGHT, background: colors.bg, overflow: "hidden" }}>
      {showB ? <SceneB colors={colors} /> : <SceneA colors={colors} />}
      {/* Film burn overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: `${burnProgress - 50}%`,
          width: "80%",
          height: HEIGHT,
          background: "linear-gradient(90deg, transparent 0%, rgba(255,165,0,0.8) 20%, rgba(255,255,100,0.9) 50%, rgba(255,165,0,0.8) 80%, transparent 100%)",
          opacity: burnOpacity,
          zIndex: 10,
          pointerEvents: "none",
          filter: "blur(8px)",
        }}
      />
      {/* Secondary burn highlight */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: `${burnProgress - 30}%`,
          width: "40%",
          height: HEIGHT,
          background: "linear-gradient(90deg, transparent, rgba(255,255,200,0.6), transparent)",
          opacity: burnOpacity * 0.7,
          zIndex: 11,
          pointerEvents: "none",
          filter: "blur(15px)",
        }}
      />
      <Label title={title} description={description} colors={colors} />
    </div>
  );
};

// ─── 23. LightLeak ─── ライトリーク ───
export const LightLeak: React.FC<EffectProps> = ({ title, description, colors }) => {
  const frame = useCurrentFrame();

  const showB = frame >= 45;
  const leakOpacity = interpolate(frame, [25, 42, 48, 65], [0, 1.0, 1.0, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const leakX = interpolate(frame, [25, 65], [20, 80], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const leakY = interpolate(frame, [25, 65], [30, 60], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const leakScale = interpolate(frame, [25, 45, 65], [0.8, 2.0, 1.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ピーク時に画面全体を覆うフルカバーオーバーレイ
  const fullCoverOpacity = interpolate(frame, [35, 42, 48, 58], [0, 0.9, 0.9, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ position: "relative", width: WIDTH, height: HEIGHT, background: colors.bg, overflow: "hidden" }}>
      {showB ? <SceneB colors={colors} /> : <SceneA colors={colors} />}
      {/* フルスクリーン暖色オーバーレイ（ピーク時に画面全体を覆う） */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: WIDTH,
          height: HEIGHT,
          background: "rgba(255,200,120,1)",
          opacity: fullCoverOpacity,
          zIndex: 9,
          pointerEvents: "none",
        }}
      />
      {/* メイン光漏れ（放射グラデーション・画面端まで届く） */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: WIDTH,
          height: HEIGHT,
          background: `radial-gradient(ellipse at ${leakX}% ${leakY}%, rgba(255,240,200,1) 0%, rgba(255,200,100,0.9) 30%, rgba(255,160,60,0.6) 60%, rgba(255,140,40,0.3) 100%)`,
          opacity: leakOpacity,
          transform: `scale(${leakScale})`,
          zIndex: 10,
          pointerEvents: "none",
        }}
      />
      {/* サブ光（逆側から差し込む） */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: WIDTH,
          height: HEIGHT,
          background: `radial-gradient(ellipse at ${100 - leakX}% ${100 - leakY}%, rgba(255,220,180,0.7) 0%, rgba(255,180,80,0.4) 40%, transparent 80%)`,
          opacity: leakOpacity * 0.7,
          zIndex: 11,
          pointerEvents: "none",
        }}
      />
      <Label title={title} description={description} colors={colors} />
    </div>
  );
};

// ─── 24. LensFlareWipe ─── レンズフレアワイプ ───
export const LensFlareWipe: React.FC<EffectProps> = ({ title, description, colors }) => {
  const frame = useCurrentFrame();

  const flareX = interpolate(frame, [20, 70], [-10, 110], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flareOpacity = interpolate(frame, [20, 35, 55, 70], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flareSizeX = interpolate(frame, [20, 45, 70], [150, 320, 150], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flareSizeY = interpolate(frame, [20, 45, 70], [HEIGHT * 1.5, HEIGHT * 2.5, HEIGHT * 1.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // フレアが通過した左側のみ SceneB を表示（ワイプと同じマスク方式）
  const revealPercent = Math.max(0, Math.min(100, flareX));

  // ピーク時のフルスクリーンフラッシュ
  const flashOpacity = interpolate(frame, [30, 43, 47, 60], [0, 0.75, 0.75, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ position: "relative", width: WIDTH, height: HEIGHT, background: colors.bg, overflow: "hidden" }}>
      {/* Scene A（ベース） */}
      <SceneA colors={colors} />
      {/* Scene B（フレアが通過した左側のみ表示） */}
      <SceneB
        colors={colors}
        style={{ clipPath: `inset(0 ${100 - revealPercent}% 0 0)` }}
      />
      {/* フルスクリーンフラッシュ */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: WIDTH, height: HEIGHT,
          background: "rgba(255,255,255,1)",
          opacity: flashOpacity,
          zIndex: 9,
          pointerEvents: "none",
        }}
      />
      {/* Main lens flare ellipse */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: `${flareX}%`,
          width: flareSizeX,
          height: flareSizeY,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(255,255,255,1) 0%, rgba(255,255,220,0.9) 25%, rgba(255,200,100,0.5) 55%, transparent 80%)",
          transform: "translate(-50%, -50%)",
          opacity: flareOpacity,
          zIndex: 10,
          pointerEvents: "none",
          filter: "blur(2px)",
        }}
      />
      {/* Horizontal flare streak（太く明るく） */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: `${flareX}%`,
          width: WIDTH * 1.5,
          height: 20,
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.9) 35%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.9) 65%, transparent 100%)",
          transform: "translate(-50%, -50%)",
          opacity: flareOpacity,
          zIndex: 11,
          pointerEvents: "none",
          filter: "blur(4px)",
        }}
      />
      {/* Secondary thinner streak */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: `${flareX}%`,
          width: WIDTH * 2,
          height: 4,
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,200,0.7) 30%, rgba(255,255,255,1) 50%, rgba(255,255,200,0.7) 70%, transparent 100%)",
          transform: "translate(-50%, -50%)",
          opacity: flareOpacity * 0.8,
          zIndex: 12,
          pointerEvents: "none",
        }}
      />
      <Label title={title} description={description} colors={colors} />
    </div>
  );
};
