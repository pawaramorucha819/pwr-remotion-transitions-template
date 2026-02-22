# PWR Remotion Transitions Template

**24種類のトランジション表現**を [Remotion](https://remotion.dev) コンポジションとして実装したテンプレートプロジェクトです。

各トランジションは、2つのシーンの切り替わり方を視覚的にデモンストレーションします。

ご自身の映像・動画制作活動やRemotionを活用したコードの作りの参考にご活用ください。

## ライセンスと権利情報

### 本プロジェクトのライセンス

本プロジェクトのソースコードは [MIT License](./LICENSE) の下で公開されています。

> **注意**: MITライセンスはこのリポジトリのコードにのみ適用されます。キャラクターIPの利用許諾や、依存ライブラリのライセンスは含まれません。

本プロジェクトには権利を侵害する意図は一切ありません。万が一問題がある場合は、お手数ですが以下のメールアドレスまで連絡ください。
<pawaramorucha@gmail.com>


### Remotionのライセンスについて

本プロジェクトは映像生成フレームワーク [Remotion](https://www.remotion.dev/) を使用しています。Remotionは**独自のライセンス（Remotion License）**で提供されており、MITライセンスではありません。

**以下はあくまで2026/2/22時点のものです。最新の情報は必ずご自身で確認のうえ、本プロジェクトを利用してください。**
詳細は公式のライセンスページを確認してください: https://www.remotion.dev/docs/license/

## Transitions

Cut, JumpCut, MatchCut, SmashCut, LCut, JCut, CrossDissolve, FadeIn, FadeOut, DipToBlack, DipToWhite, Wipe, SlideTransition, Push, Iris, ZoomTransition, WhipPan, SpinTransition, Morph, GlitchTransition, FreezeToCut, FilmBurn, LightLeak, LensFlareWipe

## Getting Started（セットアップ手順）

### 1. リポジトリをクローン

```console
git clone https://github.com/pawaramorucha819/pwr-remotion-transitions-template.git
cd pwr-remotion-transitions-template
```

### 2. 依存関係をインストール

```console
npm install
```

### 3. アセットを配置

`public/` 配下に以下のディレクトリとファイルを用意してください（二次配布不可のためリポジトリには含まれていません）。

```
public/
├── font/
│   └── GenEiMGothic2-Black.ttf    ← 日本語フォント（GenEiMGothic2 Black）
├── image/
│   ├── akane-chan.png              ← Scene A 用キャラクター画像
│   └── aoi-chan.png                ← Scene B 用キャラクター画像
└── audio/
    ├── TrackA.mp3                  ← LCut / JCut 用 BGM（Track A）
    └── TrackB.mp3                  ← LCut / JCut 用 BGM（Track B）
```

> **補足**: 音声ファイルは LCut と JCut のデモにのみ使用されます。他のトランジションは画像とフォントのみで動作します。

紹介動画で使用している素材の入手先は [Credits](#credits) を参照してください。お好みの素材に差し替えても動作します。

### 4. プレビュー起動

```console
npm run dev
```

ブラウザで Remotion Studio が開き、全24トランジションをプレビューできます。

### 5. レンダリング（任意）

特定のトランジションを動画として書き出す場合:

```console
npx remotion render <CompositionID>
```

例: `npx remotion render Cut`

## Tech Stack

- [Remotion](https://remotion.dev) 4.0
- React 19
- TypeScript
- Tailwind CSS v4
- Zod

## Credits

YouTubeの紹介動画では、以下のクリエイター様の素材をお借りしています。
いつも大変お世話になっております！
**動画公開次第リンクを貼る**

#### Font
- おたもん様 — [源暎エムゴ(GenEi M Gothic)](https://okoneya.jp/font/genei-m-gothic.html)

#### Image
- ふにちか様 — [ニコニコ静画](https://seiga.nicovideo.jp/seiga/im9809464)

#### Audio
- しゃろう様（DOVA-SYNDROME様のサイトより）
  - [作者ページ](https://dova-s.jp/_contents/author/profile106.html)
  - [SUMMER TRIANGLE](https://dova-s.jp/bgm/play13513.html)
  - [2:23 AM](https://dova-s.jp/bgm/play13002.html)
