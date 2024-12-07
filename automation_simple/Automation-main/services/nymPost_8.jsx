const { JSX, Builder } = require("canvacord");
const { Font } = require("canvacord");
const { createCanvas } = require("@napi-rs/canvas");
const path = require("path");

Font.fromFileSync(
  path.join(
    __dirname,
    "../public/assets/fonts/BubbleGum/BubblegumSans-Regular.ttf"
  ),
  "BubbleGum"
);

class NymPosteight extends Builder {
  constructor({
    width = 3852,
    height = 4398,
    nymFontSize = "570px",
    nymLineHeight = "662.91px",
    Nym = "",
    NymColor = "#000000",
    formatNym = false,
    top = 245,
    left = 0,
    nymWidth = 3505,
    nymHeight = 3989,
    backgroundImageUrl = null,
  } = {}) {
    super(width, height);
    this.bootstrap({
      Nym,
      NymColor,
      nymFontSize,
    });

    this.styles = {
      width,
      height,
      nymFontSize,
      nymLineHeight,
      formatNym,
      nymWidth,
      nymHeight,
      top,
      left,
      backgroundImageUrl,
    };
  }

  setNym(value) {
    this.options.set("Nym", value);
    return this;
  }

  async render() {
    const { Nym, NymColor } = this.options.getOptions();
    const {
      width,
      height,
      nymFontSize,
      nymLineHeight,
      formatNym,
      nymWidth,
      nymHeight,
      top,
      backgroundImageUrl,
      left,
    } = this.styles;

    const nymFontSizeNum = parseFloat(nymFontSize);
    const nymLineHeightNum = parseFloat(nymLineHeight);
    const lineHeightRatio = nymLineHeightNum / nymFontSizeNum;

    const calculatedNymFontSize = `${Math.min(nymWidth, nymHeight) * 0.15}px`;
    const calculatedNymLineHeight = `${
      parseFloat(calculatedNymFontSize) * lineHeightRatio
    }px`;

    const canvas = createCanvas(1, 1);
    const context = canvas.getContext("2d");

    context.font = `${nymFontSize} BubbleGum`;

    const isNymTextFitting = nymFontSizeNum < nymHeight;

    const finalNymFontSize = isNymTextFitting
      ? nymFontSize
      : calculatedNymFontSize;
    const finalNymLineHeight = isNymTextFitting
      ? nymLineHeight
      : calculatedNymLineHeight;

    const formattedNym = formatNym ? Nym.toUpperCase() : Nym;

    return JSX.createElement(
      "div",
      {
        style: {
          position: "relative",
          width: `${width}px`,
          height: `${height}px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          backgroundImage: backgroundImageUrl
            ? `url(${backgroundImageUrl})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        },
      },
      JSX.createElement(
        "h1",
        {
          style: {
            fontSize: finalNymFontSize,
            fontFamily: "BubbleGum",
            color: "#E39751",
            textShadow: `
                5px 5px 0 black, 
                -5px -5px 0 black, 
                5px -5px 0 black, 
                -5px 5px 0 black,
                5px 0 0 black,
                -5px 0 0 black,
                0 5px 0 black,
                0 -5px 0 black
              `,
            lineHeight: finalNymLineHeight,
            width: `${nymWidth}px`,
            position: "absolute",
            marginTop: `${top}px`,
            padding: `0 0 0 ${left}px`,
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            textTransform: formatNym ? "uppercase" : "none",
          },
        },
        formattedNym
      )
    );
  }
}

module.exports = { NymPosteight };
