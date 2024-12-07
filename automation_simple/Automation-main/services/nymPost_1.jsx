// T-shirt and hoodie design 1
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
Font.fromFileSync(
  path.join(__dirname, "../public/assets/fonts/Raleway/Raleway-Regular.ttf"),
  "Raleway"
);

class NymPostone extends Builder {
  constructor({
    width = 3852,
    height = 4398,
    nymFontSize = "540px",
    nymLineHeight = "628.02px",
    definitionFontSize = "250px",
    definitionLineHeight = "293.5px",
    Nym = "Your Nym Text Here",
    Definition = "Your Definition Text Here",
    NymColor = "#000000",
    formatNym = false,
    nymTop = 326,
    definitionTop = 904,
    left = 271,
    nymWidth = 3263,
    nymHeight = 558,
    definitionWidth = 3263,
    definitionHeight = 241,
    distanceBetweenTexts = 20,
  } = {}) {
    super(width, height);
    this.bootstrap({
      Nym,
      Definition,
      NymColor,
      nymFontSize,
      definitionFontSize,
    });

    this.styles = {
      width,
      height,
      nymFontSize,
      nymLineHeight,
      definitionFontSize,
      definitionLineHeight,
      formatNym,
      nymTop,
      left,
      nymWidth,
      nymHeight,
      definitionWidth,
      definitionHeight,
      distanceBetweenTexts,
      definitionTop,
    };
  }

  async render() {
    const { Nym, Definition, NymColor } = this.options.getOptions();
    const {
      width,
      height,
      nymFontSize,
      nymLineHeight,
      definitionFontSize,
      definitionLineHeight,
      formatNym,
      nymTop,
      left,
      nymWidth,
      nymHeight,
      definitionWidth,
      definitionHeight,
      distanceBetweenTexts,
      definitionTop,
    } = this.styles;

    const canvas = createCanvas(1, 1);
    const context = canvas.getContext("2d");

    const getAdjustedFontSize = (
      text,
      baseFontSize,
      widthLimit,
      heightLimit
    ) => {
      context.font = `${baseFontSize} BubbleGum`;
      let measuredTextWidth = context.measureText(text).width;

      let currentFontSize = parseFloat(baseFontSize);
      while (
        (measuredTextWidth > widthLimit || currentFontSize > heightLimit) &&
        currentFontSize > 0
      ) {
        currentFontSize -= 1;
        context.font = `${currentFontSize}px BubbleGum`;
        measuredTextWidth = context.measureText(text).width;
      }
      return `${currentFontSize}px`;
    };

    const adjustedNymFontSize = getAdjustedFontSize(
      Nym.toUpperCase(),
      nymFontSize,
      nymWidth,
      nymHeight
    );
    const adjustedNymHeight = Math.ceil(parseFloat(adjustedNymFontSize) * 1.15);

    const adjustedDefinitionTop =
      nymTop + adjustedNymHeight + distanceBetweenTexts;

    const adjustedDefinitionFontSize = getAdjustedFontSize(
      Definition,
      definitionFontSize,
      definitionWidth,
      definitionHeight
    );

    const adjustedNymLineHeight = `${parseFloat(adjustedNymFontSize) * 1.15}px`;
    const adjustedDefinitionLineHeight = `${
      parseFloat(adjustedDefinitionFontSize) * 1.15
    }px`;

    const originalDefinitionHeight = parseFloat(definitionLineHeight);
    const originalNymHeight = parseFloat(nymLineHeight);

    console.log("Parsed Original Definition Height:", originalDefinitionHeight);
    console.log("Parsed Original Nym Height:", originalNymHeight);

    const adjustedNymFontSizeValue = parseFloat(adjustedNymFontSize);

    console.log(
      "Parsed Adjusted Nym Font Size Value:",
      adjustedNymFontSizeValue
    );
    var newDefinitionLineHeight = 0;
    var newNymLineHeight = 0;
    if (
      isNaN(originalDefinitionHeight) ||
      isNaN(originalNymHeight) ||
      isNaN(adjustedNymFontSizeValue)
    ) {
      console.error("One or more input values are not valid numbers.");
    } else {
      const originalsize = parseFloat(nymFontSize);
      const sizeRatio = adjustedNymFontSizeValue / originalsize;

      console.log("Size Ratio:", sizeRatio);

      const lineHeightDifference = originalNymHeight - originalDefinitionHeight;

      console.log("Line Height Difference:", lineHeightDifference);

      const mul = lineHeightDifference * sizeRatio;
      newDefinitionLineHeight = mul * 2.14;
      newNymLineHeight = newDefinitionLineHeight;
    }

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
          padding: "10px",
        },
      },
      JSX.createElement(
        "h1",
        {
          style: {
            fontSize: adjustedNymFontSize,
            fontFamily: "BubbleGum",
            color: NymColor,
            lineHeight: newNymLineHeight,
            width: `${nymWidth}px`,
            height: `${nymHeight}px`,
            margin: 0,
            position: "absolute",
            top: `${nymTop}px`,
            left: `${left}px`,
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            textTransform: "uppercase",
          },
        },
        formattedNym
      ),
      JSX.createElement(
        "p",
        {
          style: {
            fontSize: adjustedDefinitionFontSize,
            fontFamily: "Raleway",
            color: NymColor,
            lineHeight: newDefinitionLineHeight,
            width: `${definitionWidth}px`,
            height: `${definitionHeight}px`,
            margin: 0,
            position: "absolute",
            top: `${adjustedDefinitionTop}px`,
            left: `${left}px`,
            whiteSpace: "pre-wrap",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          },
        },
        Definition
      )
    );
  }
}

module.exports = { NymPostone };
